const express = require('express');
require('dotenv').config();
const { updateUser, getUserByKakaoId, deleteUserByKakaoId, logout } = require('../controllers/userController');
const router = express.Router();

// 사용자 kakao_id에 따라 PATCH
router.patch('/:kakao_id', updateUser)

// 사용자 사진 연결 - 미구현
//router.patch('/:kakao_id/image', updateImage)

// 모든 사용자 가져오기
//router.get('/', getAllUsers);

// 특정 사용자 가져오기
router.get('/:kakao_id', getUserByKakaoId);

// 사용자 삭제
router.delete('/:kakao_id/delete', deleteUserByKakaoId);

// 사용자 로그아웃
router.post('/:kakao_id/logout', logout)

module.exports = router;