const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 4000;

// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const cors = require('cors');
app.use(cors());


// API 엔드포인트
app.get('/api/data', (req, res) => {
    res.json({ message: 'tkffuwnj' });
});

app.get('/users', (req, res) => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ];
    res.json(users); // JSON 형식으로 응답
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://${process.env.DB_HOST}:${port}`);
});