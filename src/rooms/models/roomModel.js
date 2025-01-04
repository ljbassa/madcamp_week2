const pool = require('../../config/create_db');
require('dotenv').config();

// 방 생성
async function createRoom() {
    const query = `
        INSERT INTO rooms (name)
        VALUES (?)
    `;
    const [result] = await pool.query(query);
    return result.insertId;
}

// 방 조회
async function getRoomById(room_id) {
    const query = 'SELECT * FROM rooms WHERE id = ?';
    const [rows] = await pool.query(query, [room_id]);
    return rows[0]; // 방 정보 반환
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

// 전체 방 구하기 - 미구현, rooms_users 에서 추가로 멤버 정보 얻어와야 함
async function getAllRooms() {
    const query = 'SELECT * FROM rooms';
    const [rows] = await pool.query(query);
    return rows; // 모든 사용자 정보 반환
}


module.exports = { createRoom, getUserByKakaoId, invalidateRefreshToken, getAllRooms };