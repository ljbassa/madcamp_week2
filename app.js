const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const kakaoAuthRoutes = require('./src/kakaoAuth/routes/kakaoAuthRoutes');
const userRoutes = require('./src/users/routes/userRoutes')
const roomRoutes = require('./src/rooms/routes/roomRoutes')
const roomuserRoutes = require('./src/rooms_users/routes/roomuserRoutes')
const notificationRoutes = require('./src/notifications/routes/notificationRoutes')

require('dotenv').config();

const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // 요청 로그
    next();
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack || err);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000', // 허용할 클라이언트의 출처
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키 인증 정보 허용
}));

// Body-parser 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
// 카카오 로그인
app.use('/auth/kakao', kakaoAuthRoutes);

//user 관리
app.use('/users', userRoutes);

// 정적 파일 제공 (사진 파일 접근 가능)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/src/uploads", express.static(uploadDir));

//room 관리
app.use('/rooms', roomRoutes)

//room-user 관리
app.use('/rooms_users', roomuserRoutes)

//notification 관리
app.use('/notifications', notificationRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});