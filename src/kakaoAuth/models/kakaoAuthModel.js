const pool = require('../../config/create_db');

async function saveUser(userInfo) {
    const { id, properties, kakao_account } = userInfo;
    const nickname = properties?.nickname || null;
    const profileImage = properties?.profile_image || null;
    const email = kakao_account?.email || null;

    const query = `
        INSERT INTO users (kakao_id, nickname, profile_image, email)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        nickname = VALUES(nickname),
        profile_image = VALUES(profile_image),
        email = VALUES(email)
    `;

    await pool.query(query, [id, nickname, profileImage, email]);
}

module.exports = { saveUser };