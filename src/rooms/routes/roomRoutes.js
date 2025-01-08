const express = require('express');
require('dotenv').config();
const { randomMenu, createRoom, allVotePlease } = require('../controllers/roomController');
const router = express.Router();


// 방 생성
router.post('/', createRoom)

// 투표 끝나고 넘어가기
router.patch('/vote/:room_id', allVotePlease)

// 랜덤으로 뽑은 메뉴 DB에 저장
router.patch('/:room_id/:menu', randomMenu)


module.exports = router;