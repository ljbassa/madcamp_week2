const express = require('express');
const cors = require('cors');
const kakaoAuthRoutes = require('./src/kakaoAuth/routes/kakaoAuthRoutes');
const userRoutes = require('./src/users/routes/userRoutes')
const roomRoutes = require('./src/rooms/routes/roomRoutes')
const roomuserRoutes = require('./src/rooms_users/routes/roomuserRoutes')
const notificationRoutes = require('./src/notifications/routes/notificationRoutes')

require('dotenv').config();

const app = express();

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3001', // 허용할 클라이언트의 출처
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키 인증 정보 허용
}));

// Body-parser 설정
app.use(express.json());

// 라우터 등록
// 카카오 로그인
app.use('/auth/kakao', kakaoAuthRoutes);
//user 관리
app.use('/users', userRoutes);
//room 관리
app.use('/rooms', roomRoutes)
//room-user 관리
app.use('/rooms_users', roomuserRoutes)
//notification 관리
app.use('/notifications', notificationRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});