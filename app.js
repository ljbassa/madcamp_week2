const express = require('express');
const { kakaoAuthRoutes } = require('./src/kakaoAuth');
const homeRoutes = require('./src/home/routes/homeRoutes');
require('dotenv').config();

const app = express();

// Body-parser 설정
app.use(express.json());

// 카카오 로그인 라우터 등록
app.use('/auth/kakao', kakaoAuthRoutes);

//사용자 관리
//app.use('/users', userRoutes);

//홈 탭 ???
app.use('/home', homeRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});