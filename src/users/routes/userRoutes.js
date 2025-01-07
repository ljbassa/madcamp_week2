const multer = require("multer");
const express = require('express');
const fs = require('fs');
const path = require("path");
const { execFile } = require('child_process');

require('dotenv').config();
const { getImageByRandom, updateUserPicture, updateUser, getUserByKakaoId, deleteUserByKakaoId, logout } = require('../controllers/userController');
const router = express.Router();

//이미지 랜덤 get
router.get('/:room_id/randomImage', getImageByRandom)

// 사용자 kakao_id에 따라 PATCH
router.patch('/:kakao_id', updateUser)

// Multer 설정
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            console.error("Upload directory does not exist:", uploadDir);
            return cb(new Error("Upload directory does not exist"));
        }
        console.log("Saving file to:", uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const kakaoId = path.parse(req.params.kakao_id).name;
        cb(null, `${kakaoId}.jpg`);
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
router.patch('/image/:kakao_id', upload.single("photo"), async (req, res) => {
    const { kakao_id } = req.params;
    const originalPath = req.file.path;
    const transformedPath = path.join(uploadDir, `${path.parse(kakao_id).name}_swirl.jpg`);

    console.log("Request received for kakao_id:", kakao_id);
    console.log("File upload:", req.file);

    try {

        // 파이썬 파일 경로
        const pythonScriptPath = path.resolve(__dirname, '../services/soyong.py');

        // Python 실행
        execFile('python3', [pythonScriptPath, originalPath, transformedPath], (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Python script:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to apply swirl effect.',
                });
            }

    console.log('Python script output:', stdout);

        // 데이터베이스에 원본 및 변환된 사진 경로 저장
        const filePaths = {
            original: originalPath.replace(path.resolve(__dirname, '../../uploads'), '/uploads'),
            transformed: transformedPath.replace(path.resolve(__dirname, '../../uploads'), '/uploads'),
        };

        updateUserPicture(kakao_id, filePaths)
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: 'Picture uploaded and transformed successfully',
                        filePaths,
                    });
                })
                .catch((dbError) => {
                    console.error('Database error:', dbError);
                    res.status(500).json({
                        success: false,
                        message: 'Failed to update database.',
                    });
                });
        });
    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to process and transform picture.',
        });
    }
});


// 특정 사용자 가져오기
router.get('/:kakao_id', getUserByKakaoId);

// 사용자 삭제
router.delete('/:kakao_id/delete', deleteUserByKakaoId);

// 사용자 로그아웃
router.post('/:kakao_id/logout', logout)

module.exports = router;