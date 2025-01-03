const { getToken, getUserInfo } = require('../services/kakaoAuthService');
const { saveUser } = require('../models/kakaoAuthModel');

async function handleKakaoCallback(req, res) {
    try {
        const code = req.query.code;
        const tokenData = await getToken(code); // 카카오 API로 액세스 토큰 요청
        const userInfo = await getUserInfo(tokenData.access_token); // 사용자 정보 요청
        await saveUser(userInfo); // 사용자 정보 저장

        res.json({ success: true, user: userInfo });
    } catch (error) {
        console.error('Kakao login error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
}

module.exports = { handleKakaoCallback };