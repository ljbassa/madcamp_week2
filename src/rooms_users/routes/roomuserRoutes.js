const express = require('express');
require('dotenv').config();
const { createRoom, deleteUserRoomById } = require('../controllers/roomuserController');
const router = express.Router();


// 방 생성
router.post('/', createRoom)

// 사용자 삭제
router.delete('/:room_id/:kakao_id', deleteUserRoomById);



module.exports = router;