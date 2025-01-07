const express = require('express');
require('dotenv').config();
const { sendNotification, getNotifications, deleteNotificationById } = require('../controllers/notificationController');
const router = express.Router();


// 사용자 별 전체 알람 확인
router.get('/:user_id', getNotifications)

// 사용자 별 알람 삭제
router.delete('/delete/:id', deleteNotificationById);

// 알림 보내기
router.post('/send/:room_id/:user1_id/:user2_id', sendNotification);



module.exports = router;