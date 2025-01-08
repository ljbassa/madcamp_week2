const pool = require('../../config/create_db');
require('dotenv').config();

// 방 생성
async function createRoom(name, names) {
    const connection = await pool.getConnection();
    let kakao_ids = [];

    if (names.length === 0) {
        throw new Error('No user names provided for room creation.');
    }

    try {
        await connection.beginTransaction();

        // 1. room create
        const insertRoomQuery = `
            INSERT INTO rooms (name) VALUES (?)
        `;
        const [roomResult] = await connection.query(insertRoomQuery, [name]);
        const roomId = roomResult.insertId;
        console.log('room created with ID: ${roomId}');

        // 1.5 names -> kakao_ids 로 변환
        // 동적으로 생성된 IN 절에 사용할 자리표시자 생성
        const placeholders = names.map(() => '?').join(', ');

        // SQL 쿼리 작성
        const query = `
            SELECT name, kakao_id
            FROM users
            WHERE name IN (${placeholders})
        `;

        
        // 쿼리 실행
        const [rows] = await pool.query(query, names);
        // 결과에서 kakao_id만 추출하여 배열로 반환
        kakao_ids = rows.map(row => row.kakao_id);



        // 2. rooms에 users 삽입
        const insertRoomUsersQuery = `
            INSERT INTO rooms_users (room_id, user_id) VALUES ?
        `;
        const roomUserValues = kakao_ids.map(kakaoId => [roomId, kakaoId]);
        await connection.query(insertRoomUsersQuery, [roomUserValues]);
        console.log(`Inserted ${names.length} users into room ${roomId}`);

        // 3. notifications에 삽입
        for (const kakaoId of kakao_ids) {
            const checkQuery = `
                SELECT id FROM notifications
                WHERE room_id = ? AND user_id = ?
            `;
            const [notificationRows] = await connection.query(checkQuery, [roomId, kakaoId]);

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
                const [insertResult] = await connection.query(insertQuery, [roomId, kakaoId]);
                console.log(`Inserted notification ID: ${insertResult.insertId}`);
            }
        }


        await connection.commit();
        return { roomId, kakao_ids };

    } catch (error) {
        await connection.rollback();
        console.error('error creating rome with users:', error);
        throw error;
    } finally { connection.release(); }
}

// 방 조회
async function getRoomById(room_id) {
    const query = 'SELECT * FROM rooms WHERE id = ?';
    const [rows] = await pool.query(query, [room_id]);
    return rows[0]; // 방 정보 반환
}

// 랜덤으로 뽑은 메뉴 방 디비에 저장
async function randomMenu(room_id, menu) {
    const query = `
        UPDATE rooms
        SET menu = ?
        WHERE id = ?
    `;
    await pool.query(query, [menu, room_id]);
    console.log(`Room ${room_id} menu updated to ${menu}`);
}

// 투표 끝나고 넘어가기
async function allVotePlease(room_id) {
    const connection = await pool.getConnection(); // 연결 가져오기

    try {
        // 트랜잭션 시작
        await connection.beginTransaction();

        // 1. rooms_users 테이블에서 해당 room_id의 vote 상태 확인
        const queryVotes = `
            SELECT vote
            FROM rooms_users
            WHERE room_id = ?
        `;

        const [votes] = await connection.query(queryVotes, [room_id]);

        // 모든 vote가 NULL이 아니면 업데이트 수행
        const allVotesPresent = votes.every(row => row.vote !== null);

        if (allVotesPresent) {
            // 2. rooms 테이블에서 vote 값을 1로 업데이트
            const updateRoomQuery = `
                UPDATE rooms
                SET vote = 1
                WHERE id = ?
            `;

            await connection.query(updateRoomQuery, [room_id]);
            console.log(`Room ${room_id} vote updated to 1`);
        } else {
            console.log(`Room ${room_id} vote update skipped (some votes are NULL)`);
        }

        // 트랜잭션 커밋
        await connection.commit();

    } catch (error) {
        // 트랜잭션 롤백
        await connection.rollback();
        console.error('Error updating room vote:', error);
        throw error;

    } finally {
        // 연결 반환
        connection.release();
    }
}


module.exports = { randomMenu, createRoom, getRoomById, allVotePlease };