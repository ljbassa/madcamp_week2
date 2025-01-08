const pool = require('../../config/create_db'); // MySQL 연결
const { createRoom, getRoomById, allVotePlease } = require('../models/roomModel');
require('dotenv').config();


// 방 생성
exports.createRoom = async (req, res) => {
    const { name, names } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Room name is required.' });
    }

    if (!Array.isArray(names) || names.length === 0) {
        return res.status(400).json({ success: false, message: 'User names are required.' });
    }

    try {
        // 방 생성
        const { roomId, kakao_ids } = await createRoom(name, names);

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

// 투표 끝나고 넘어가기
exports.allVotePlease = async (req, res) => {
    const { room_id } = req.params;

    try {
        await allVotePlease(room_id)

        const room = await getRoomById(room_id)

        res.status(201).json({
            success: true,
            message: 'Room created successfully.',
            data: room,
        });
        
    } catch (error) {
        console.error('Error voting:', error.message);
        res.status(500).json({ success: false, message: 'Failed to voting.' });
    }

}

// 랜덤으로 뽑은 메뉴 방 DB에 저장
exports.randomMenu = async (req, res) => {
    const { room_id, menu } = req.params

    try {
        await this.randomMenu(room_id, menu)
        const room = await getRoomById(room_id)
        res.status(201).json({
            success: true,
            message: 'Room created successfully.',
            data: room,
        });
        
    } catch (error) {
        console.error('Error random menu:', error.message);
        res.status(500).json({ success: false, message: 'Failed to random menu.' });
    }
}

