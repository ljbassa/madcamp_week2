const { getToken, getUserInfo } = require('../services/kakaoAuthService');
const { saveUser } = require('../models/kakaoAuthModel');
require('dotenv').config();

async function handleKakaoCallback(req, res) {
    const code = req.query.code;

    if (!code) {
        console.error('Authorization code is missing');
        return res.status(400).send('Authorization code is missing');
    }

    console.log('Authorization code:', code);

    try {
        const tokenData = await getToken(code);
        console.log('Token data:', tokenData);

        const userInfo = await getUserInfo(tokenData.access_token);
        console.log('User info:', userInfo);

        res.json({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            userInfo});
    } catch (err) {
        console.error('Error during Kakao login:', err.message);
        res.status(500).send('Kakao login failed');
    }
};
module.exports = { handleKakaoCallback };