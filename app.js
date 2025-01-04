const express = require('express');
const { kakaoAuthRoutes } = require('./src/kakaoAuth');
require('dotenv').config();

const app = express();

// 카카오 로그인 라우터 등록
app.use('/auth/kakao', kakaoAuthRoutes);

//사용자 관리
//app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});