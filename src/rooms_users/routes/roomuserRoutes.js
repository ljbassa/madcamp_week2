const express = require('express');
require('dotenv').config();
const { exitRoomUser, viewUserRooms, viewRoom, updateMenu, updateQuiz, updateVote, inviteUser } = require('../controllers/roomuserController');
const router = express.Router();


// 회원 별 방 나가기
router.delete('/:room_id/:user_id', exitRoomUser)

// 회원 별 방 전체 목록
router.get('/home1/:user_id', viewUserRooms)

// 방 세부 목록
router.get('/home2/:room_id', viewRoom)

// 회원 별 메뉴, 한 줄 어필 작성
router.patch('/menu/:room_id/user_id', updateMenu)

// 회원 별 퀴즈 정답 유무
router.patch('/quiz/:room_id/user_id', updateQuiz)

// 회원 별 방 투표 현황
router.patch('/vote/:room_id/:user_id', updateVote)

// 방 멤버 초대
router.post('/invite/:room_id', inviteUser);



module.exports = router;