async function inviteUser(room_id, names) {
    const connection = await pool.getConnection(); // 연결 가져오기

    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        // 1. names -> kakao_ids 로 변환
        const placeholders = names.map(() => '?').join(', ');

        const query = `
            SELECT name, kakao_id
            FROM users
            WHERE name IN (${placeholders})
        `;

        // 쿼리 실행
        const [rows] = await connection.query(query, names);

        // 결과에서 kakao_id만 추출하여 배열로 반환
        const kakao_ids = rows.map(row => row.kakao_id);

        // 2. rooms에 users 삽입
        const insertRoomUsersQuery = `
            INSERT INTO rooms_users (room_id, user_id) VALUES ?
        `;
        const roomUserValues = kakao_ids.map(kakaoId => [room_id, kakaoId]);
        await connection.query(insertRoomUsersQuery, [roomUserValues]);
        console.log(`Inserted ${kakao_ids.length} users into room ${room_id}`);

        // 3. notifications에 삽입
        for (const kakaoId of kakao_ids) {
            // 3.1 해당 데이터 존재 여부 확인
            const checkQuery = `
                SELECT id FROM notifications
                WHERE room_id = ? AND user_id = ?
            `;
            const [notificationRows] = await connection.query(checkQuery, [room_id, kakaoId]);

            if (notificationRows.length > 0) {
                // 데이터가 존재하면 업데이트
                const updateQuery = `
                    UPDATE notifications
                    SET created_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `;
                await connection.query(updateQuery, [notificationRows[0].id]);
                console.log(`Updated notification ID: ${notificationRows[0].id}`);
            } else {
                // 데이터가 존재하지 않으면 삽입
                const insertQuery = `
                    INSERT INTO notifications (room_id, user_id)
                    VALUES (?, ?)
                `;
                const [insertResult] = await connection.query(insertQuery, [room_id, kakaoId]);
                console.log(`Inserted notification ID: ${insertResult.insertId}`);
            }
        }

        await connection.commit(); // 트랜잭션 커밋
        return { room_id, kakao_ids }; // 결과 반환

    } catch (error) {
        await connection.rollback(); // 트랜잭션 롤백
        console.error('Error creating room with users:', error);
        throw error;
    } finally {
        connection.release(); // 연결 반환
    }
}