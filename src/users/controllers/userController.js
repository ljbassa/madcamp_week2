const pool = require('../../config/create_db'); // MySQL 연결
const { updateUser, getUserByKakaoId } = require('../models/userModel');


// 모든 사용자 가져오기
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
};

// 특정 사용자 가져오기
exports.getUserByKakaoId = async (req, res) => {
    const { kakao_id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [kakao_id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

// 사용자 삭제
exports.deleteUserById = async (req, res) => {
    const { kakao_id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
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
    const { kakaoId } = req.params;
    const { nickname, email } = req.body;

    if (!kakaoId) {
        return res.status(400).json({ success: false, message: 'Kakao ID is required.' });
    }

    if (!nickname && !email) {
        return res.status(400).json({ success: false, message: 'At least one field (nickname or email) is required.' });
    }

    try {
        const user = await getUserByKakaoId(kakaoId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await updateUser(kakaoId, { nickname, email });
        res.json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
};