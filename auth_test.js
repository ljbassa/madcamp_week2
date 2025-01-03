const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;
const redirectUri = process.env.REDIRECT_URI;

// Redirect URI 처리
router.get('/kakao/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // 인증 코드로 액세스 토큰 요청
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: '09a698a4561ba30fa6ac339bcd61a899',
                redirect_uri: 'http://localhost:3000/auth/kakao/callback',
                code,
            },
        });

        const { access_token } = tokenResponse.data;

        // 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userInfo = userResponse.data;

        res.json({
            success: true,
            user: userInfo,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
});

module.exports = router;