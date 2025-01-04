const pool = require('../../config/create_db');
require('dotenv').config();

// 사용자 정보 업데이트
async function updateUser(kakaoId, data) {
    const query = `
        UPDATE users
        SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE kakao_id = ?
    `;
    const [result] = await pool.query(query, [data.name, data.email, kakaoId]);
    return result;
}

// 카카오 ID로 사용자 정보 가져오기 (선택)
async function getUserByKakaoId(kakaoId) {
    const query = 'SELECT * FROM users WHERE kakao_id = ?';
    const [rows] = await pool.query(query, [kakaoId]);
    return rows[0]; // 결과가 없으면 undefined 반환
}

module.exports = { updateUser, getUserByKakaoId };