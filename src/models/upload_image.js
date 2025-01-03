import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";

const app = express();

// MySQL 연결 설정
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Multer 설정: 파일 업로드 디렉토리와 파일 이름 지정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름
  },
});

const upload = multer({ storage });

// 사진 업로드 API
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const userId = req.body.userId; // 사용자 ID
    const filePath = req.file.path; // 파일 경로 (Multer가 제공)

    // 파일 경로를 DB에 저장
    const query = `
        INSERT INTO users (user_id, file_path)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        picture_path = VALUES(picture_path)
        `;
    await db.execute(query, [userId, filePath]);

    res.status(200).json({ message: "File uploaded and saved to DB", filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});