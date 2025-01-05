const pool = require('../../config/create_db');
require('dotenv').config();

// 방 생성
async function createRoom(name, kakao_ids) {
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

        // 2. rooms에 users 삽입
        const insertRoomUsersQuery = `
            INSERT INTO rooms_users (room_id, user_id) VALUES ?
        `;
        const roomUserValues = kakao_ids.map(kakaoId => [roomId, kakaoId]);
        await connection.query(insertRoomUsersQuery, [roomUserValues]);
        console.log(`Inserted ${kakao_ids.length} users into room ${roomId}`);

        // 3. notifications에 삽입
        const insertNotificationsQuery = `
            INSERT INTO notifications (room_id, user_id) VALUES ?
        `;
        await connection.query(insertNotificationsQuery, [roomUserValues]);
        console.log(`Inserted ${kakao_ids.length} users into notificationㄴ ${roomId}`);

        await connection.commit();
        return { roomId, kakao_ids };

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