const mysql = require('mysql2/promise'); // mysql2/promise 가져오기
require('dotenv').config();

// MySQL 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
  connectionLimit: 100,
});

// 데이터베이스와 테이블 초기화
async function initializeDatabase() {
  const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;

  const createTables = `
    USE ${process.env.DB_NAME};

    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kakao_id BIGINT NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL DEFAULT 'unknown',
      nickname VARCHAR(100),
      email VARCHAR(100),
      introduce VARCHAR(255),
      picture_path VARCHAR(255),
      refresh_token VARCHAR(255), -- 리프레시 토큰
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT NOT NULL,
      room_id INT NOT NULL,
      menu VARCHAR(100),
      appeal VARCHAR(255),
      quiz TINYINT(1) DEFAULT 1,
      vote TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_id INT NOT NULL,
      user_id BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // 데이터베이스 생성
    await pool.query(createDatabase);
    console.log('Database created successfully.');

    // 테이블 생성
    await pool.query(createTables);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error during database initialization:', err.message);
  }
}

// 초기화 함수 실행
initializeDatabase();

module.exports = pool; // MySQL 풀 내보내기