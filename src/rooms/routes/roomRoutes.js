const express = require('express');
require('dotenv').config();
const { createRoom, deleteRoomById } = require('../controllers/roomController');
const router = express.Router();


// 방 생성
router.post('/', createRoom)

// 사용자 삭제
router.delete('/:room_id', deleteRoomById);



module.exports = router;