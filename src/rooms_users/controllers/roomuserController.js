const pool = require('../../config/create_db'); // MySQL 연결
const { viewRoom, viewUserRooms, updateMenu, updateQuiz, updateVote, inviteUser } = require('../models/roomuserModel');
require('dotenv').config();

// 사용자 삭제
exports.exitRoomUser = async (req, res) => {
    const { room_id, user_id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM rooms_users WHERE room_id = ? AND user_id = ?', [room_id, user_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'RoomUser not found.' });
        }
        res.json({ success: true, message: 'RoomUser deleted successfully.' });
    } catch (error) {
        console.error('Error deleting roomuser:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete roomuser.' });
    }
};

// 회원 별 방 전체 목록
exports.viewUserRooms = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [rows] = await viewUserRooms(user_id);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'RoomUser not found.' });
        }
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching roomuser:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch roomuser.' });
    }
};

// 각 방 조회, 방 정보와 속한 회원 이름 리스트 반환
exports.viewRoom = async (req, res) => {
    const { room_id } = req.params;
    try {
        const {roomInfo, names} = await viewRoom(room_id);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'RoomUser not found.' });
        }
        res.json({ success: true, data: {roomInfo, names} });
    } catch (error) {
        console.error('Error fetching roomuser:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch roomuser.' });
    }
};

// 회원 별 메뉴, 한 줄 어필 작성
exports.updateMenu = async (req, res) => {
    const { room_id, user_id } = req.params;
    const { menu, appeal } = req.body;

    if (!menu && !appeal ) {
        return res.status(400).json({ success: false, message: 'At least one field (menu or appeal) is required.' });
    }

    try {
        await updateMenu(room_id, user_id, {menu, appeal});
        console.log('update menu:', {menu, appeal})

        res.json({ success: true, message: 'menu and appeal updated successfully.' });
    } catch (error) {
        console.error('Error updating menu:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update menu.' });
    }
};

// 회원 별 메뉴, 한 줄 어필 작성
exports.updateQuiz = async (req, res) => {
    const { room_id, user_id } = req.params;
    const { quiz } = req.body;

    if (!quiz ) {
        return res.status(400).json({ success: false, message: 'At least one field quiz is required.' });
    }

    try {
        await updateQuiz(room_id, user_id, {quiz});
        console.log('update quiz:', {quiz})

        res.json({ success: true, message: 'quiz updated successfully.' });
    } catch (error) {
        console.error('Error updating quiz:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update quiz.' });
    }
};

// 회원 별 메뉴, 한 줄 어필 작성
exports.updateVote = async (req, res) => {
    const { room_id, user_id } = req.params;
    const { vote } = req.body;

    if (!vote ) {
        return res.status(400).json({ success: false, message: 'At least one field vote is required.' });
    }

    try {
        await updateVote(room_id, user_id, {vote});
        console.log('update vote:', {vote})

        res.json({ success: true, message: 'vote updated successfully.' });
    } catch (error) {
        console.error('Error updating vote:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update vote.' });
    }
};

// 방에 멤버 추가 초대
exports.inviteUser = async (req, res) => {
    const { room_id } = req.params;
    const { names } = req.body;

    if ( names.length == 0 ) {
        return res.status(400).json({ success: false, message: 'At least one name is required.' });
    }

    try {
        await inviteUser(room_id, {names});
        console.log('update members:', {names})

        res.json({ success: true, message: 'invited successfully.' });
    } catch (error) {
        console.error('Error updating member:', error.message);
        res.status(500).json({ success: false, message: 'Failed to inviting.' });
    }
};

