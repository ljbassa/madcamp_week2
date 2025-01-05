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