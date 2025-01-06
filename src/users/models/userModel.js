const pool = require('../../config/create_db');
require('dotenv').config();

// 사용자 정보 업데이트
async function updateUser(kakao_id, data) {
    const query = `
        UPDATE users
        SET name = ?, nickname = ?, introduce = ?, 
        created_at = CURRENT_TIMESTAMP
        WHERE kakao_id = ?
    `;
    const [result] = await pool.query(query, [data.name, data.nickname, data.introduce, kakao_id]);
    return result;
}

//사용자 이미지 업데이트
async function updateUserPicture(kakao_id, filePath) {
    const query =`
        INSERT INTO users (kakao_id, picture_path, name)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        picture_path = VALUES(picture_path)
    `;

    try {

        console.log("Executing SQL query:", query);
        console.log("With values:", [kakao_id, filePath]);

        const [result] = await pool.query(query, [kakao_id, filePath, "default name"]);
        console.log("SQL query result:", result);
        
        return result;

    } catch (error) {
        throw new Error("Failed to update user picture in database: " + error.message);
    }
}

// 카카오 ID로 사용자 정보 가져오기 (선택)
async function getUserByKakaoId(kakao_id) {
    const query = 'SELECT * FROM users WHERE kakao_id = ?';
    const [rows] = await pool.query(query, [kakao_id]);
    return rows[0]; // 결과가 없으면 undefined 반환
}

// 리프레시 토큰 무효화
async function invalidateRefreshToken(kakao_id) {
    const query = `
        UPDATE users
        SET refresh_token = NULL
        WHERE kakao_id = ?
    `;
    const [result] = await pool.query(query, [kakao_id]);
    return result;
}

// refresh token 저장
async function saveRefreshToken(kakaoId, refreshToken) {
    const query = `
        UPDATE users
        SET refresh_token = ?
        WHERE kakao_id = ?
    `;
    const [result] = await pool.query(query, [refreshToken, kakaoId]);
    return result;
}

module.exports = { updateUserPicture, updateUser, getUserByKakaoId, invalidateRefreshToken, saveRefreshToken };