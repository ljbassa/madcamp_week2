const express = require('express');
require('dotenv').config();
const { createRoom } = require('../controllers/roomController');
const router = express.Router();


// 방 생성
router.post('/', createRoom)




module.exports = router;