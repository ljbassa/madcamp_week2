const pool = require('../../config/create_db');
require('dotenv').config();

// 방 생성
async function createRoom(name, names) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. room create
        const insertRoomQuery = `
            INSERT INTO rooms (name) VALUES (?)
        `;
        const [roomResult] = await connection.query(insertRoomQuery, [name]);
        const roomId = roomResult.insertId;
        console.log('room created with ID: ${roomId}');

        // 1.5 names -> kakao_ids 로 변환
        // 동적으로 생성된 IN 절에 사용할 자리표시자 생성
        const placeholders = names.map(() => '?').join(', ');

        // SQL 쿼리 작성
        const query = `
            SELECT name, kakao_id
            FROM users
            WHERE name IN (${placeholders})
        `;
        try {
            // 쿼리 실행
            const [rows] = await pool.query(query, names);
            // 결과에서 kakao_id만 추출하여 배열로 반환
            const kakao_ids = rows.map(row => row.kakao_id);
            return kakao_ids;
        } catch (error) {
            console.error('Error fetching kakao_ids:', error);
            throw error;
        }



        // 2. rooms에 users 삽입
        const insertRoomUsersQuery = `
            INSERT INTO rooms_users (room_id, user_id) VALUES ?
        `;
        const roomUserValues = kakao_ids.map(kakaoId => [roomId, kakaoId]);
        await connection.query(insertRoomUsersQuery, [roomUserValues]);
        console.log(`Inserted ${names.length} users into room ${roomId}`);

        // 3. notifications에 삽입
            // 1. 해당 데이터 존재 여부 확인
        const checkQuery = `
            SELECT id FROM notifications
            WHERE room_id = ? AND user_id = ?
        `;
        const [rows] = await connection.query(checkQuery, [roomId, kakaoId]);

        if (rows.length > 0) {
            // 데이터가 존재하면 업데이트
            const updateQuery = `
                UPDATE notifications
                SET created_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const [updateResult] = await connection.query(updateQuery, [rows[0].id]);
            console.log(`Updated notification ID: ${rows[0].id}`);
        } else {
            // 데이터가 존재하지 않으면 삽입
            const insertQuery = `
                INSERT INTO notifications (room_id, user_id)
                VALUES (?, ?)
            `;
            const [insertResult] = await connection.query(insertQuery, [roomId, kakaoId]);
            console.log(`Inserted notification ID: ${insertResult.insertId}`);
        }

        await connection.commit();
        return { roomId, names };

    } catch (error) {
        await connection.rollback();
        console.error('error creating rome with users:', error);
        throw error;
    } finally { connection.release(); }
}

// 방 조회
async function getRoomById(room_id) {
    const query = 'SELECT * FROM rooms WHERE id = ?';
    const [rows] = await pool.query(query, [room_id]);
    return rows[0]; // 방 정보 반환
}


module.exports = { createRoom, getRoomById };