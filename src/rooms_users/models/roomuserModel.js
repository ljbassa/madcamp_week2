const pool = require('../../config/create_db');
require('dotenv').config();

// 메뉴 정보 업데이트
async function updateMenu(room_id, user_id, data) {
    const query = `
        UPDATE rooms_users
        SET menu = ?, appeal = ?,
        created_at = CURRENT_TIMESTAMP
        WHERE room_id = ? AND user_id = ?
    `;
    const [result] = await pool.query(query, [data.menu, data.appeal, room_id, user_id]);
    return result;
}

// 퀴즈 정보 업데이트
async function updateQuiz(room_id, user_id, data) {
    const query = `
        UPDATE rooms_users
        SET quiz = ?,
        created_at = CURRENT_TIMESTAMP
        WHERE room_id = ? AND user_id = ?
    `;
    const [result] = await pool.query(query, [data.quiz, room_id, user_id]);
    return result;
}

// 투표 정보 업데이트
async function updateVote(room_id, user_id, data) {
    const query = `
        UPDATE rooms_users
        SET vote = ?,
        created_at = CURRENT_TIMESTAMP
        WHERE room_id = ? AND user_id = ?
    `;
    const [result] = await pool.query(query, [data.vote, room_id, user_id]);
    return result;
}

// 방 생성
async function inviteUser(name, kakao_ids) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. room create
        const insertRoomQuery = `
            INSERT INTO rooms_users (name) VALUES (?)
        `;
        const [roomResult] = await connection.query(insertRoomQuery, [name]);
        const roomId = roomResult.insertId;
        console.log('room created with ID: ${roomId}');

        // 2. rooms에 users 삽입
        const insertRoomUsersQuery = `
            INSERT INTO rooms_users (room_id, user_id) VALUES ?
        `;
        const roomUserValues = kakao_ids.map(kakaoId => [roomId, kakaoId]);
        await connection.query(insertRoomUsersQuery, [roomUserValues]);
        console.log(`Inserted ${kakao_ids.length} users into room ${roomId}`);

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
        return { roomId, kakao_ids };

    } catch (error) {
        await connection.rollback();
        console.error('error creating rome with users:', error);
        throw error;
    } finally { connection.release(); }
}


module.exports = {updateQuiz, updateMenu, updateVote, inviteUser}