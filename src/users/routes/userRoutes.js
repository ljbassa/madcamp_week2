const multer = require("multer");
const express = require('express');
const fs = require('fs');
const path = require("path");

require('dotenv').config();
const { updateUserPicture, updateUser, getUserByKakaoId, deleteUserByKakaoId, logout } = require('../controllers/userController');
const router = express.Router();

// 사용자 kakao_id에 따라 PATCH
router.patch('/:kakao_id', updateUser)

// Multer 설정
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Saving file to:", uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        console.log("Uploaded file name:", file.originalname);
        cb(null, `${req.params.kakao_id}.jpg`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG and PNG files are allowed"), false);
        }
        cb(null, true);
    },
});

// 사진 업로드 라우트
router.patch('/image/:kakao_id', upload.single("photo"), (req, res, next) => {
    console.log("Request received for kakao_id:", req.params.kakao_id);
    console.log("File upload:", req.file);
    next();
}, updateUserPicture);


// 특정 사용자 가져오기
router.get('/:kakao_id', getUserByKakaoId);

// 사용자 삭제
router.delete('/:kakao_id/delete', deleteUserByKakaoId);

// 사용자 로그아웃
router.post('/:kakao_id/logout', logout)

module.exports = router;