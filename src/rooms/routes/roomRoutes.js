const express = require('express');
require('dotenv').config();
const { createRoom, getRoomById, getAllRoom, getAllRooms } = require('../controllers/roomController');
const router = express.Router();

// 전체 방 겟 - 미구현
// router.get('/', getAllRooms)

// 방 생성
router.post('/', createRoom)

// 모든 사용자 가져오기
//router.get('/', getAllUsers);

// 특정 사용자 가져오기
router.get('/:kakao_id', getUserByKakaoId);

// 사용자 삭제
router.delete('/:kakao_id/delete', deleteUserByKakaoId);

// 사용자 로그아웃
router.post('/:kakao_id/logout', logout)

module.exports = router;