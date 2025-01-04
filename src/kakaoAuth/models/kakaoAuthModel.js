const pool = require('../../config/create_db');
require('dotenv').config();

async function saveUser(userInfo) {
    console.log('Saving user info:', userInfo);
    const { id, properties, kakao_account } = userInfo;
    const nickname = properties?.nickname || null;

    const query = `
        INSERT INTO users (kakao_id, name, nickname, email, picture_path)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
    `;

    await pool.query(query, [id, nickname, nickname, ElementInternals, 'default_path']);
}

module.exports = { saveUser };