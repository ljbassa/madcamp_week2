const pool = require('../../config/create_db');
require('dotenv').config();

// 이미지 랜덤 get, 이름과 사진경로 반환
async function getImageByRandom(room_id) {
    const query = `
    SELECT u.name, u.picture_path, u.menu, u.appeal
    FROM rooms_users ru
    JOIN users u ON ru.user_id = u.kakao_id
    WHERE ru.room_id = ?
    ORDER BY RAND()
    LIMIT 1;
    `
    const [result] = await pool.query(query, [room_id])
    
    if (result.length === 0) {
        return null; // 해당 room_id에 사용자가 없을 경우
    }

    const originalPicturePath = result[0].picture_path;

    // 변환된 사진 경로 생성 (_swirl 붙이기)
    const swirlPicturePath = originalPicturePath.replace(/(\.[\w\d_-]+)$/i, '_swirl$1');

    // 반환 데이터에 swirl 경로 추가
    return {
        ...result[0],
        picture_path: swirlPicturePath,
    };
}


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
async function updateUserPicture(kakao_id, filePaths) {
    const query =`
        INSERT INTO users (kakao_id, picture_path, name)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        picture_path = VALUES(picture_path)
    `;

    try {

        console.log("Executing SQL query:", query);
        console.log("With values:", [kakao_id, filePath]);
        const {original, transformed} = filePaths
        const [result] = await pool.query(query, [kakao_id, original, "default name"]);
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

module.exports = { getImageByRandom, updateUserPicture, updateUser, getUserByKakaoId, invalidateRefreshToken, saveRefreshToken };