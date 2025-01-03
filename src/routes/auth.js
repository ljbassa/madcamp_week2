const axios = require('axios');
require('dotenv').config();


const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;
const redirectUri = process.env.REDIRECT_URI;

async function getToken(code) {
    const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
            grant_type: 'authorization_code',
            client_id: kakaoRestApiKey,
            redirect_uri: redirectUri,
            code,
        },
    });
    return response.data;
}