const pool = require('../../config/create_db'); // MySQL 연결
const { getNotifications, sendNotification } = require('../models/notificationModel');
require('dotenv').config();


// 회원의 모든 알림 가져오기
exports.getNotifications = async (req, res) => {
    const { user_id } = req.params;
    try {
        const rows = await getNotifications(user_id)
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

// 특정 알림 삭제
exports.deleteNotificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM notifications WHERE id = ? ', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};

exports.sendNotification = async (req, res) => {
    const {room_id, user1_id, user2_id} = req.params;
    try {
        const rows = await sendNotification(room_id, user1_id, user2_id)
        res.json({success:true, data:rows})
    } catch (error) {
        console.error('Error fetching send notif:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch send notif.' });
    }
}



