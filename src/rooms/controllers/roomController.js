const pool = require('../../config/create_db'); // MySQL 연결
const { createRoom, getRoomById } = require('../models/roomModel');
require('dotenv').config();


// 방 생성
exports.createRoom = async (req, res) => {
    const { name, names } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Room name is required.' });
    }

    try {
        // 방 생성
        const { roomId, names } = await createRoom(name, names);

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



