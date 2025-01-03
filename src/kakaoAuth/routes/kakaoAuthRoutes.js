const express = require('express');
const { handleKakaoCallback } = require('../controllers/kakaoAuthController');

const router = express.Router();

// 카카오 로그인 콜백
router.get('/callback', handleKakaoCallback);

module.exports = router;