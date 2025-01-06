const express = require('express');
import multer from "multer";
require('dotenv').config();
const { updateUserPicture, updateUser, getUserByKakaoId, deleteUserByKakaoId, logout } = require('../controllers/userController');
const router = express.Router();

// 사용자 kakao_id에 따라 PATCH
router.patch('/:kakao_id', updateUser)

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "src/uploads/"), // 저장 디렉토리
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // 파일 이름
});
  
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 파일 크기 제한 (50MB)
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG and PNG files are allowed"), false);
        }
        cb(null, true);
    },
});

// 사용자 사진 연결
router.patch('/image/:kakao_id', upload.single("photo"), updateUserPicture)


// 특정 사용자 가져오기
router.get('/:kakao_id', getUserByKakaoId);

// 사용자 삭제
router.delete('/:kakao_id/delete', deleteUserByKakaoId);

// 사용자 로그아웃
router.post('/:kakao_id/logout', logout)

module.exports = router;