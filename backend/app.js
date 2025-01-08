const express = require('express');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const http = require('http');
const https = require('https');

const kakaoAuthRoutes = require('./src/kakaoAuth/routes/kakaoAuthRoutes');
const userRoutes = require('./src/users/routes/userRoutes')
const roomRoutes = require('./src/rooms/routes/roomRoutes')
const roomuserRoutes = require('./src/rooms_users/routes/roomuserRoutes')
const notificationRoutes = require('./src/notifications/routes/notificationRoutes')

require('dotenv').config();

const app = express();

// Certificate 인증서 경로
const privateKey = fs.readFileSync('./../../etc/letsencrypt/live/api.hmhgmg.r-e.kr/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./../../etc/letsencrypt/live/api.hmhgmg.r-e.kr/cert.pem', 'utf8');
const ca = fs.readFileSync('./../../etc/letsencrypt/live/api.hmhgmg.r-e.kr/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//https://gmghmh.netlify.app
//http://localhost:3000
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
const uploadDir = path.resolve(__dirname, "src/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

//room 관리
app.use('/rooms', roomRoutes)

//room-user 관리
app.use('/rooms_users', roomuserRoutes)

//notification 관리
app.use('/notifications', notificationRoutes)

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
