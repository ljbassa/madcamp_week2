function formatUserData(userInfo) {
    return {
        kakaoId: userInfo.id,
        nickname: userInfo.properties?.nickname || 'Unknown',
        email: userInfo.kakao_account?.email || 'No email',
    };
}

module.exports = { formatUserData };