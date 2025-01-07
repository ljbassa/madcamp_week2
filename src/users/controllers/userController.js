const pool = require('../../config/create_db'); // MySQL 연결
const path = require("path");
const { getImageByRandom, updateUserPicture, updateUser, getUserByKakaoId, invalidateRefreshToken } = require('../models/userModel');
require('dotenv').config();

// 이미지 랜덤 get
exports.getImageByRandom = async (req, res) => {
    const { room_id } = req.params;
    try {
        const user = await getImageByRandom(room_id)
        res.json({success: true, data: user})
    } catch (error) {
        console.error('Error fetching get Image By Random:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch getImageByRandom.' });
    }
}

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



// 사용자 삭제
exports.deleteUserByKakaoId = async (req, res) => {
    const { kakao_id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE kakao_id = ?', [kakao_id]);
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
    const { name, nickname, introduce } = req.body;

    if (!kakao_id) {
        return res.status(400).json({ success: false, message: 'Kakao ID is required.' });
    }

    if (!name && !nickname && !introduce) {
        return res.status(400).json({ success: false, message: 'At least one field (nickname or email) is required.' });
    }

    try {
        const user = await getUserByKakaoId(kakao_id);
        console.log('useruseruser:', {user, kakao_id})

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await updateUser(kakao_id, { name, nickname, introduce });
        res.json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
};

// 사진 업로드
exports.updateUserPicture = async (kakao_id, filePaths) => {
    try {

        // Multer 파일 확인
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // 확장자 제거 (필요 시)
        kakao_id = path.parse(kakao_id).name;
    
        // 데이터베이스 업데이트
        await updateUserPicture(kakao_id, filePaths);
    
        res.status(200).json({
          success: true,
          message: "Picture path updated successfully",
          filePaths,
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({
          success: false,
          message: "Failed to update picture",
        });
      }
}


// 로그아웃
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