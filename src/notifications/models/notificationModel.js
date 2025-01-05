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



module.exports = { getNotifications };