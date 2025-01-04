const express = require('express');
const { getAllUsers, getUserById, deleteUserById } = require('../controllers/userController');
const router = express.Router();

// 모든 사용자 가져오기
router.get('/', getAllUsers);

// 특정 사용자 가져오기
router.get('/:id', getUserById);

// 사용자 삭제
router.delete('/:id', deleteUserById);

module.exports = router;