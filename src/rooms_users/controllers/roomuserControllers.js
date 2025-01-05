const pool = require('../../config/create_db'); // MySQL 연결
const { deleteUserRoomById, getRoomById } = require('../models/roomuserModel');
require('dotenv').config();

// 방 삭제
exports.deleteUserRoomById = async (req, res) => {
    const { room_id, kakao_id } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();


        // 1. rooms_users에서 room_id 삭제
        const deleteRoomUsersQuery = `
            DELETE FROM rooms_users
            WHERE room_id = ?
        `;
        const [deleteRoomUsersResult] = await connection.query(deleteRoomUsersQuery, [room_id]);
        console.log(`Deleted ${deleteRoomUsersResult.affectedRows} rooms from rooms_users`);

        // 2. notifications에서 room_id 삭제
        const deleteNotificationQuery = `
            DELETE FROM notifications
            WHERE room_id = ? AND user_id = ?
        `;
        const [deleteNotificationResult] = await connection.query(deleteNotificationQuery, [room_id, kakao_id]);
        console.log(`Deleted ${deleteNotificationResult.affectedRows} rooms from notifications`);

        // 2. rooms_users에 room_id가 더 이상 없는지 확인
        const checkRoomUsersQuery = `
            SELECT COUNT(*) AS count
            FROM rooms_users
            WHERE room_id = ?
        `;
        const [checkRoomUsersResult] = await connection.query(checkRoomUsersQuery, [room_id]);
        const remainingUsers = checkRoomUsersResult[0].count;

        // 3. rooms_users에 room_id가 없으면 rooms에서 삭제
        if (remainingUsers === 0) {
            const deleteRoomQuery = `
                DELETE FROM rooms
                WHERE id = ?
            `;
            const [deleteRoomResult] = await connection.query(deleteRoomQuery, [room_id]);
            console.log(`Deleted ${deleteRoomResult.affectedRows} rooms from rooms`);
        } else {
            console.log(`Room ${room_id} still has associated users in room_users.`);
        }

        // 트랜잭션 커밋
        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });

        return { success: true, message: 'Room and associated users deleted if applicable.' };
        
    } catch (error) {
        await connection.commit();
        console.error('Error deleting rooms:', error.message);
        throw error;
    } finally {
        connection.release();
    }
};
