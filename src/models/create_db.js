const mysql = require('mysql2');

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 데이터베이스 생성
connection.query('CREATE DATABASE my_database', (err, results) => {
  if (err) {
    console.error('Error creating database:', err.message);
    return;
  }
  console.log('Database created successfully!');
  connection.end();
});