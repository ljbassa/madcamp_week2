const pool = require('../../config/create_db');
require('dotenv').config();

// 카카오 ID로 알림 정보 가져오기
async function getNotifications(kakao_id) {
    const query = `
        SELECT 
            n.*, 
            r.name AS room_name
        FROM
            notifications n
        JOIN
            rooms r
        ON
            n.room_id = r.id
        WHERE 
            n.user_id = ?
    `;
    const [rows] = await pool.query(query, [kakao_id]);
    return rows; // 결과가 없으면 [] 빈 배열 반환
}

async function sendNotification(room_id, user1_id, user2_id) {
    const query = `
        INSERT INTO notifications (room_id, user_id)
        VALUES (?, ?);
        `;

    const selectQuery = `
        SELECT 
            r.name AS room_name,
            u1.name AS user1_name,
            u2.name AS user2_name
        FROM rooms r
        JOIN users u1 ON u1.kakao_id = ?
        JOIN users u2 ON u2.kakao_id = ?
        WHERE r.id = ?;
    `;


    // 1. notifications 테이블에 데이터 삽입
    await pool.query(query, [room_id, user2_id]);

    // 2. rooms와 users 테이블에서 데이터 가져오기
    const [rows] = await pool.query(selectQuery, [user1_id, user2_id, room_id]);

    if (rows.length === 0) {
        throw new Error("No matching data found for the given IDs.");
    }

    // 데이터 반환
    return {
        room_name: rows[0].room_name,
        user1_name: rows[0].user1_name,
        user2_name: rows[0].user2_name,
    };
}


module.exports = { getNotifications, sendNotification };