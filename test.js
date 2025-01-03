const express = require('express');
const app = express();
const port = 3000;

// CORS 설정 (프론트엔드와 다른 도메인에서 접근 가능하도록 설정)
const cors = require('cors');
app.use(cors());

// JSON 데이터 처리를 위한 미들웨어
app.use(express.json());

// 간단한 API 엔드포인트
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});