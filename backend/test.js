const express = require('express');
const authRoutes = require('./auth_test');
const app = express();
require('dotenv').config();


app.use(express.json());

// 인증 관련 라우터 등록
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});