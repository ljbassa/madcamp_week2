const mysql = require('mysql2');
require('dotenv').config(); // dotenv 로드

// MySQL 연결 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true, // 다중 쿼리 실행 허용
  connectionLimit: 100,      // 최대 10개의 연결 유지
});


// 데이터베이스와 테이블 생성
const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;

const createTables = `
  USE my_database;

  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kakao VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    email VARCHAR(100),
    introduce VARCHAR(255),
    picture_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rooms_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
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
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
`;

// 쿼리 실행
// 데이터베이스 생성
pool.query(createDatabase, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    pool.end();
    return;
  }
  console.log('Database created successfully.');

  // 테이블 생성
  pool.query(createTables, (err) => {
    if (err) {
      console.error('Error creating tables:', err.message);
    } else {
      console.log('Tables created successfully.');
    }
    pool.end();
  });
});

module.exports = pool; //모듈내보내기