const pool = require('../../config/create_db'); // MySQL 연결
const { createRoom, getRoomById, getAllRooms } = require('../models/roomModel');
require('dotenv').config();

// 특정 사용자 가져오기
exports.getUserByKakaoId = async (req, res) => {
    const { kakao_id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE kakao_id = ?', [kakao_id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

// 방 생성
exports.createRoom = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Room name is required.' });
    }

    try {
        // 방 생성
        const roomId = await createRoom(name);

        // 생성된 방 정보 조회
        const room = await getRoomById(roomId);

        res.status(201).json({
            success: true,
            message: 'Room created successfully.',
            data: room,
        });
    } catch (error) {
        console.error('Error creating room:', error.message);
        res.status(500).json({ success: false, message: 'Failed to create room.' });
    }
}

//전체 방 구하기 - 미구현
exports.getAllRooms = async (req, res) => {
    try {
        const users = await getAllRooms();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching rooms:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch rooms.' });
    }
};



// 사용자 삭제
exports.deleteUserByKakaoId = async (req, res) => {
    const { kakao_id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE kakao_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};



// 사용자 정보 업데이트
exports.updateUser = async (req, res) => {
    const { kakao_id } = req.params;
    const { nickname, email, introduce } = req.body;

    if (!kakao_id) {
        return res.status(400).json({ success: false, message: 'Kakao ID is required.' });
    }

    if (!nickname && !email && !introduce) {
        return res.status(400).json({ success: false, message: 'At least one field (nickname or email) is required.' });
    }

    try {
        const user = await getUserBykakaoId(kakao_id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await updateUser(kakao_id, { nickname, email, introduce });
        res.json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
};

exports.logout = async (req, res) => {
    const { kakao_id } = req.params;

    if (!kakao_id) {
        return res.status(400).json({ success: false, message: 'Kakao ID is required.' });
    }

    try {
        // 리프레시 토큰 무효화
        const result = await invalidateRefreshToken(kakao_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({ success: true, message: 'Logout successful.' });
    } catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({ success: false, message: 'Failed to logout.' });
    }
};