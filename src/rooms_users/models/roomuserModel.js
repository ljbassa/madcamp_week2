const pool = require('../../config/create_db');
require('dotenv').config();


async function quiznommenu(room_id) {
    const query = `
            SELECT menu
            FROM rooms_users
            WHERE room_id = ?
            AND quiz = 1;
            `;

    const [rows] = await pool.query(query, [room_id]);
    const menuList = rows.map(row => row.menu);
    return menuList;
}




async function viewUserRooms(user_id) {
    let datas = [];

    const roomIdListQuery = `
        SELECT room_id FROM rooms_users WHERE user_id = ?
    `;
    const [roomIdRows] = await pool.query(roomIdListQuery, [user_id]);
    const roomIds = roomIdRows.map(row => row.room_id);

    for (const roomId of roomIds) {
        // 3.1 해당 데이터 존재 여부 확인
        const data = await viewRoom(roomId)
        datas.push(data)
    }
    console.log(datas)
    return datas
}



// 방 정보와 속한 회원 이름 리스트 반환
async function viewRoom(room_id) {
    const connection = await pool.getConnection(); // 연결 가져오기

    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        // room 정보 반환
        const query = `
            SELECT * FROM rooms WHERE id = ?
        `;

        
        const [roomInfo] = await connection.query(query, [room_id]);

        // 유저 카카오 아이디 리스트 반환
        const userIdListQuery = `
            SELECT user_id FROM rooms_users WHERE room_id = ?
        `;
        const [userIdRows] = await connection.query(userIdListQuery, [room_id]);
        const userIds = userIdRows.map(row => row.user_id);

        // 유저 이름 리스트 반환
        const userNameListQuery = `
            SELECT u.name
            FROM users u
            JOIN rooms_users ru ON u.kakao_id = ru.user_id
            WHERE ru.room_id = ?
        `;

        const [userNameRows] = await connection.query(userNameListQuery, [room_id]);
        const names = userNameRows.map(row => row.name);
        console.log(userIds, names); // 이름 리스트 출력

        return {roomInfo, names, userIds};



    } catch (error) {
        await connection.rollback(); // 트랜잭션 롤백
        console.error('Error rooms_users viewRoom:', error);
        throw error;
    } finally {
        connection.release(); // 연결 반환
    }

}



// 메뉴 정보 업데이트
async function updateMenu(room_id, user_id, data) {
    const query = `
        UPDATE rooms_users
        SET menu = ?, appeal = ?,
        created_at = CURRENT_TIMESTAMP
        WHERE room_id = ? AND user_id = ?
    `;
    const [result] = await pool.query(query, [data.menu, data.appeal, room_id, user_id]);
    return result;
}

// 퀴즈 정보 업데이트
async function updateQuiz(room_id, user_id, data) {
    const query = `
        UPDATE rooms_users
        SET quiz = ?,
        created_at = CURRENT_TIMESTAMP
        WHERE room_id = ? AND user_id = ?
    `;
    const [result] = await pool.query(query, [data.quiz, room_id, user_id]);
    return result;
}

// 투표 정보 업데이트
async function updateVote(room_id, user_id, data) {
    const query = `
        UPDATE rooms_users
        SET vote = ?,
        created_at = CURRENT_TIMESTAMP
        WHERE room_id = ? AND user_id = ?
    `;
    const [result] = await pool.query(query, [data.vote, room_id, user_id]);
    return result;
}

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

module.exports = {quiznommenu, viewUserRooms, viewRoom, updateQuiz, updateMenu, updateVote, inviteUser}

