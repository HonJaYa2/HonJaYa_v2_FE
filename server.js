import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import next from 'next';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const KAKAO_SECRET_KEY = 'DEV418F3416856E0F8D07D365ADD2E0B7387BDE3';
const KAKAO_CLIENT_ID = '6d162d06e3d6478d7d70318a5a6e8735';
const KAKAO_REDIRECT_URI = 'http://localhost:3000/api/auth/kakao/callback';

let rooms = {}; // 각 방의 남은 시간을 저장할 객체

async function init() {
    // MySQL 연결 설정
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root59',
        database: 'zem_shop',
    });

    // 서버 시작 시 실행되는 초기화 코드
    // is_waiting을 0으로 항상 초기화해논다.(그래야 매칭버튼을 누르면 1로 변경 후 변경된 자들끼리 매칭 가능)
    db.execute('UPDATE users_preferences SET is_waiting = 0');


    await db.connect();
    console.log('MySQL connected successfully.');

    app.prepare().then(() => {
        const server = express();
        server.use(cookieParser());
        server.use(bodyParser.json());
        const httpServer = createServer(server);
        const io = new Server(httpServer);

        // CORS 설정 추가
        server.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }));

        // 카카오 로그인 엔드포인트
        server.get('/api/auth/kakao', (req, res) => {
            const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;
            res.redirect(kakaoAuthUrl);
        });

        server.get('/api/auth/kakao/callback', async (req, res) => {
            const { code } = req.query;
            try {
                const response = await axios.post(
                    'https://kauth.kakao.com/oauth/token',
                    {},
                    {
                        params: {
                            grant_type: 'authorization_code',
                            client_id: KAKAO_CLIENT_ID,
                            redirect_uri: KAKAO_REDIRECT_URI,
                            code,
                        },
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                        },
                    }
                );
        
                const { access_token } = response.data;
                const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                const userInfo = userInfoResponse.data;
                const nickname = userInfo.kakao_account.profile.nickname;
        
                // 사용자 정보를 데이터베이스에 저장하고 preferences_completed 값을 가져옵니다.
                const [userResult] = await db.query(
                    'INSERT INTO users (kakao_id, username, password, zem_balance) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password)',
                    [userInfo.id, nickname, '', 0]
                );
        
                const [userPreferences] = await db.query('SELECT preferences_completed FROM users WHERE kakao_id = ?', [userInfo.id]);
        
                // user 객체에 preferences_completed 값을 추가합니다.
                userInfo.preferences_completed = userPreferences[0].preferences_completed;
        
                res.cookie('token', access_token, { httpOnly: false, secure: !dev, sameSite: 'lax' });
                res.cookie('user', JSON.stringify(userInfo), { httpOnly: false, secure: !dev, sameSite: 'lax' });
        
                res.redirect('/landing?login=success');
            } catch (error) {
                console.error(error);
                res.redirect('/?login=failed');
            }
        });

        // 결제준비 엔드포인트
        server.post('/api/pay/ready', async (req, res) => {
            try {
                const { itemName, price, kakaoId } = req.body;
                const partner_order_id = `order_${new Date().getTime()}`; // partner_order_id 생성
                const data = {
                    cid: 'TC0ONETIME',
                    partner_order_id: partner_order_id,
                    partner_user_id: kakaoId,
                    item_name: itemName,
                    quantity: 1,
                    total_amount: price,
                    vat_amount: 0,
                    tax_free_amount: 0,
                    approval_url: 'http://localhost:3000/api/pay/approve',
                    fail_url: 'http://localhost:3000/api/pay/fail',
                    cancel_url: 'http://localhost:3000/api/pay/cancel',
                };

                const response = await axios.post(
                    'https://open-api.kakaopay.com/online/v1/payment/ready',
                    data,
                    {
                        headers: {
                            Authorization: `SECRET_KEY ${KAKAO_SECRET_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const { next_redirect_pc_url, tid } = response.data;
                res.cookie('tid', tid, { httpOnly: true });
                res.cookie('partner_user_id', kakaoId, { httpOnly: true });  // kakaoId 쿠키에 저장
                res.cookie('partner_order_id', partner_order_id, { httpOnly: true }); // partner_order_id 쿠키에 저장
                res.json({ redirectUrl: next_redirect_pc_url });
            } catch (error) {
                console.error('Error creating KakaoPay payment:', error);
                res.status(500).json({ error: 'Failed to create KakaoPay payment' });
            }
        });

        // 결제 승인 엔드포인트
        server.get('/api/pay/approve', async (req, res) => {
            const { pg_token } = req.query;
            const tid = req.cookies.tid;
            const partner_user_id = req.cookies.partner_user_id;
            const partner_order_id = req.cookies.partner_order_id; // 쿠키에서 가져오기
            try {
                const data = {
                    cid: 'TC0ONETIME',
                    tid,
                    partner_order_id: partner_order_id,
                    partner_user_id: partner_user_id,  // 동일한 kakaoId 사용
                    pg_token,
                };

                const response = await axios.post(
                    'https://open-api.kakaopay.com/online/v1/payment/approve',
                    data,
                    {
                        headers: {
                            Authorization: `SECRET_KEY ${KAKAO_SECRET_KEY}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // 결제 완료 후 Zem 수 업데이트
                const approvedData = response.data;
                const kakaoId = approvedData.partner_user_id;
                const zemAmount = parseInt(approvedData.amount.total, 10); // 예시: 결제 금액을 Zem 수로 사용

                await db.query('UPDATE users SET zem_balance = zem_balance + ? WHERE kakao_id = ?', [zemAmount, kakaoId]);

                res.redirect(`http://localhost:3000/shop?payment=success&kakaoId=${kakaoId}`); // 결제 성공 후 클라이언트로 리디렉션
            } catch (error) {
                console.error(error);
                res.redirect('http://localhost:3000/shop?payment=fail'); // 결제 실패 후 클라이언트로 리디렉션
            }
        });

        // 취향정보 입력 여부 확인
        server.get('/api/getPreferencesStatus/:kakaoId', async (req, res) => {
            const kakaoId = req.params.kakaoId;
            try {
                const [results] = await db.query('SELECT preferences_completed FROM users WHERE kakao_id = ?', [kakaoId]);
                if (results.length > 0) {
                    res.json({ preferences_completed: results[0].preferences_completed });
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            } catch (err) {
                console.error('Error fetching preferences status:', err);
                res.status(500).json({ error: 'Error fetching preferences status' });
            }
        });
        
        
        // 취향 정보를 저장하는 API 엔드포인트
        server.post('/api/savePreferences', async (req, res) => {
            const { kakaoId, preferences } = req.body;
            try {
                // 취향 정보 저장 로직 추가
        
                // 취향 정보 입력 완료 표시
                await db.query('UPDATE users SET preferences_completed = ? WHERE kakao_id = ?', [true, kakaoId]);
        
                res.json({ success: true });
            } catch (error) {
                console.error('Error saving preferences:', error);
                res.status(500).json({ error: 'Error saving preferences' });
            }
        });
        
        // 로그아웃
        server.get('/api/auth/logout', async (req, res) => {
            try {
                const token = req.cookies.token;

                await axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                });

                res.clearCookie('token');
                res.clearCookie('user');
                res.redirect('/');
            } catch (error) {
                console.error('Error during logout:', error);
                res.redirect('/?logout=failed');
            }
        });

        // 사용자의 Zem 수를 가져오는 API 엔드포인트
        server.get('/api/getZem/:kakaoId', async (req, res) => {
            const kakaoId = req.params.kakaoId;
            try {
                const [results] = await db.query('SELECT zem_balance FROM users WHERE kakao_id = ?', [kakaoId]);
                if (results.length > 0) {
                    res.json(results[0].zem_balance);
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            } catch (err) {
                console.error('Error fetching ZEM:', err);
                res.status(500).json({ error: 'Error fetching ZEM' });
            }
        });

        // 사용자 인벤토리를 가져오는 API 엔드포인트 추가
        server.get('/api/getInventory/:kakaoId', async (req, res) => {
            const kakaoId = req.params.kakaoId;
            try {
                const [results] = await db.query('SELECT * FROM user_inventory WHERE kakao_id = ?', [kakaoId]);
                if (results.length > 0) {
                    res.json(results);
                } else {
                    res.status(404).json({ error: 'Inventory not found' });
                }
            } catch (err) {
                console.error('Error fetching inventory:', err);
                res.status(500).json({ error: 'Error fetching inventory' });
            }
        });

         // 아이템 목록을 가져오는 API 엔드포인트 추가
         server.get('/api/items', async (req, res) => {
            try {
                const [results] = await db.query('SELECT * FROM shop_items');
                res.json(results);
            } catch (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ error: 'Error fetching items' });
            }
        });

        // 구매내역
        server.get('/api/getPurchaseHistory/:kakaoId', async (req, res) => {
            const kakaoId = req.params.kakaoId;
            try {
                const [results] = await db.query('SELECT * FROM purchase_history WHERE kakao_id = ?', [kakaoId]);
                if (results.length > 0) {
                    res.json(results);
                } else {
                    console.error('Purchase history not found for user:', kakaoId);
                    res.status(404).json({ error: 'Purchase history not found' });
                }
            } catch (err) {
                console.error('Error fetching purchase history:', err);
                res.status(500).json({ error: 'Error fetching purchase history' });
            }
        });
        

        server.post('/api/buyItem', async (req, res) => {
            const { kakaoId, itemId } = req.body;

            try {
                const [itemResults] = await db.query('SELECT * FROM shop_items WHERE id = ?', [itemId]);

                if (itemResults.length === 0) {
                    return res.status(404).json({ error: 'Item not found' });
                }

                const item = itemResults[0];
                const [userResults] = await db.query('SELECT zem_balance FROM users WHERE kakao_id = ?', [kakaoId]);

                if (userResults.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const userZem = userResults[0].zem_balance;

                if (userZem < item.price) {
                    return res.status(400).json({ error: 'Not enough ZEM' });
                }

                await db.query('UPDATE users SET zem_balance = zem_balance - ? WHERE kakao_id = ?', [item.price, kakaoId]);

                const [inventoryResults] = await db.query('SELECT * FROM user_inventory WHERE kakao_id = ? AND item_id = ?', [kakaoId, itemId]);

                if (inventoryResults.length > 0) {
                    await db.query('UPDATE user_inventory SET quantity = quantity + 1 WHERE kakao_id = ? AND item_id = ?', [kakaoId, itemId]);
                } else {
                    await db.query('INSERT INTO user_inventory (kakao_id, item_id, quantity) VALUES (?, ?, 1)', [kakaoId, itemId]);
                }

                await db.query('INSERT INTO purchase_history (kakao_id, item_id, quantity) VALUES (?, ?, 1)', [kakaoId, itemId]);

                res.json({ success: true, message: 'Item purchased successfully' });
            } catch (err) {
                console.error('Error processing purchase:', err);
                res.status(500).json({ error: 'Error processing purchase' });
            }
        });


        // 예시: user/setInfo API에서 userId 대신 kakaoId 사용
        server.post('/user/setInfo', async (req, res) => {
            const { kakaoId, userData } = req.body;

            try {
                // 사용자 정보를 users_preferences 테이블에 저장
                const query = `
                    INSERT INTO users_preferences (kakao_id, birthday, gender, height, weight, mbti, religion, drink_amount, smoke, address)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        birthday = VALUES(birthday),
                        gender = VALUES(gender),
                        height = VALUES(height),
                        weight = VALUES(weight),
                        mbti = VALUES(mbti),
                        religion = VALUES(religion),
                        drink_amount = VALUES(drink_amount),
                        smoke = VALUES(smoke),
                        address = VALUES(address)
                `;

                await db.execute(query, [
                    kakaoId,
                    userData.birthday,
                    userData.gender,
                    userData.height,
                    userData.weight,
                    userData.mbti,
                    userData.religion,
                    userData.drinkAmount,
                    userData.smoke,
                    userData.address
                ]);

                // 사용자 정보 입력이 완료되었다면, users 테이블에서 preferences_completed 값을 1로 업데이트
                const updatePrefCompletedQuery = `
                    UPDATE users
                    SET preferences_completed = 1
                    WHERE kakao_id = ?
                `;
                await db.execute(updatePrefCompletedQuery, [kakaoId]); // 데이터베이스에서 실행시킴

                res.status(200).json({ message: 'User preferences saved successfully.' });
            } catch (error) {
                console.error('Error saving user preferences:', error);
                res.status(500).json({ error: 'Failed to save user preferences.' });
            }
        }); 



        // 유저 매칭 대기상태 확인
        server.post('/api/setWaitingState', async (req, res) => {
            const { kakaoId, isWaiting } = req.body;
            try {
                await db.query('UPDATE users_preferences SET is_waiting = ? WHERE kakao_id = ?', [isWaiting, kakaoId]);
                res.status(200).json({ success: true });
            } catch (error) {
                console.error('Failed to set waiting state:', error);
                res.status(500).json({ error: 'Failed to set waiting state' });
            }
        });
        
        
// 매칭
server.post('/user/match', async (req, res) => {
    const { kakaoId, filterData } = req.body;

    console.log('Matching request received with kakaoId:', kakaoId);
    console.log('Filter data received:', filterData);

    try {
        const query = `
            SELECT * FROM users_preferences
            WHERE 
                TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN ? AND ? AND
                height BETWEEN ? AND ? AND
                weight BETWEEN ? AND ? AND
                mbti = ? AND
                religion = ? AND
                drink_amount = ? AND
                smoke = ? AND
                is_waiting = true  -- 매칭 대기 상태 확인
        `;
        const [rows] = await db.execute(query, [
            filterData.minAge,
            filterData.maxAge,
            filterData.minHeight,
            filterData.maxHeight,
            filterData.minWeight,
            filterData.maxWeight,
            filterData.mbti,
            filterData.religion,
            filterData.drink_amount,
            filterData.smoke
        ]);

        console.log('Matching users found:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ error: '조건에 맞는 사용자가 아직 존재하지 않습니다.' });
        }

        // 랜덤으로 한 명을 선택
        const randomIndex = Math.floor(Math.random() * rows.length);
        const matchedUser = rows[randomIndex];

        const [userInfo] = await db.execute(`SELECT id, kakao_id FROM users WHERE kakao_id = ?`, [matchedUser.kakao_id]);

        if (userInfo.length === 0) {
            return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
        }

        res.status(200).json({ matchedUser: userInfo[0] });
    } catch (error) {
        console.error('Error during user matching:', error);
        res.status(500).json({ error: 'Failed to match user' });
    }
});


        
        server.get('/user/:id', async (req, res) => {
            const userId = req.params.id;
            try {
                const query = `
                    SELECT * FROM users_preferences
                    WHERE id = ?
                `;
                const [rows] = await db.execute(query, [userId]);
        
                if (rows.length === 0) {
                    return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
                }
        
                const user = rows[0];
                res.status(200).json(user);
            } catch (error) {
                console.error('Error fetching user info:', error);
                res.status(500).json({ error: '사용자 정보를 가져오는 데 실패했습니다.' });
            }
        });

        
        // 채팅방 생성 API
server.post('/api/createSingleChatRoom', async (req, res) => {
    const { user1Id, user2Id } = req.body;
    console.log(`Received create chat room request for users: ${user1Id} and ${user2Id}`);

    // 사용자 ID를 정렬 : 서로 
    const sortedIds = [user1Id, user2Id].sort();

    try {
        // 이미 존재하는 채팅방을 찾기
        const findQuery = `
            SELECT id FROM single_chat_rooms
            WHERE (user1_id = ? AND user2_id = ?)
            ORDER BY id ASC
        `;
        const [existingRooms] = await db.execute(findQuery, [sortedIds[0], sortedIds[1]]);

        if (existingRooms.length > 0) {
            // 가장 오래된 채팅방의 ID를 반환
            const oldestRoomId = existingRooms[0].id;
            return res.status(200).json({ SingleChatRoomId: oldestRoomId });
        } else {
            // 새로운 채팅방을 생성
            const createQuery = `
                INSERT INTO single_chat_rooms (user1_id, user2_id)
                VALUES (?, ?)
            `;
            const [result] = await db.execute(createQuery, [sortedIds[0], sortedIds[1]]);

            const SingleChatRoomId = result.insertId;
            console.log(`Created new room with ID: ${SingleChatRoomId}`);
            res.status(200).json({ SingleChatRoomId });
        }
    } catch (error) {
        console.error('Failed to create or find chat room:', error);
        res.status(500).json({ error: 'Failed to create or find chat room' });
    }
});



        

        // 1:1 채팅방 접근
        server.get('/chat/single/:roomId', (req, res) => {
            const { roomId } = req.params;
            app.render(req, res, '/chat/single', { roomId });
        });

        // Socket.IO 설정
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('joinRoom', (roomId) => {
                socket.join(roomId);
                console.log(`User joined room ${roomId}`);
                
                // 방에 처음 접속한 경우 24시간 타이머 시작
                if (!rooms[roomId]) {
                    rooms[roomId] = 24 * 60 * 60; // 24시간을 초로 변환
                    console.log(`Starting timer for room ${roomId} with ${rooms[roomId]} seconds remaining.`);
                    startTimer(roomId);
                } else {
                    console.log(`Room ${roomId} already has an active timer with ${rooms[roomId]} seconds remaining.`);
                }

                // 현재 남은 시간 전송
                io.to(socket.id).emit('updateTimer', rooms[roomId]);
            });

            // 메시지 전송 핸들러
            socket.on('sendMessage', async (data) => {
                const { senderId, roomId, message } = data;

                // 데이터베이스에서 username을 조회
                const [userRows] = await db.execute('SELECT username FROM users WHERE kakao_id = ?', [senderId]);

                if (userRows.length > 0) {
                    const username = userRows[0].username;
                    const formatDate = (date) => {
                        const d = new Date(date);
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        const hours = String(d.getHours()).padStart(2, '0');
                        const minutes = String(d.getMinutes()).padStart(2, '0');
                        const seconds = String(d.getSeconds()).padStart(2, '0');
                        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    };

                    // 메시지 데이터에 username을 추가하여 전송
                    const messageData = {
                        id: data.id,
                        roomId,
                        senderId,
                        senderName: username,  // username 추가
                        senderProfile: data.senderProfile,
                        message,
                        timestamp: formatDate(new Date()),
                    };

                    // 메시지를 데이터베이스에 저장
                try {
                    await db.execute(`
                        INSERT INTO chat_messages (room_id, sender_id, message, timestamp)
                        VALUES (?, ?, ?, ?)
                    `, [roomId, senderId, message, messageData.timestamp]);
                    
                    console.log('Message inserted to DB:', { roomId, senderId, message, timestamp: messageData.timestamp });
                    
                    console.log('Message saved to database:', messageData);
                } catch (error) {
                    console.error('Failed to save message:', error);
                }

                    // 해당 채팅방에 있는 모든 클라이언트에게 메시지 전송
                    io.to(roomId).emit('receiveMessage', messageData);
                }
            });


            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        const startTimer = (roomId) => {
            const timer = setInterval(() => {
                if (rooms[roomId] <= 0) {
                    clearInterval(timer);
                    io.to(roomId).emit('timerEnded');
                    delete rooms[roomId]; // 방의 타이머 종료 후 삭제
                } else {
                    rooms[roomId]--;
                    io.to(roomId).emit('updateTimer', rooms[roomId]);
                }
            }, 1000);
        };

        // 채팅방 내역 가져오기
        server.get('/api/getChatMessages/:roomId', async (req, res) => {
            const { roomId } = req.params;
        
            try {
                const [messages] = await db.execute(
                    'SELECT sender_id, message, timestamp FROM chat_messages WHERE room_id = ? ORDER BY timestamp ASC',
                    [roomId]
                );
                console.log('Fetched chat messages:', messages);
                res.status(200).json(messages);
            } catch (error) {
                console.error('Failed to fetch chat messages:', error);
                res.status(500).json({ error: 'Failed to fetch chat messages' });
            }
        });
        

        // 매칭된 유저 정보 저장
        server.post('/api/saveMatchedUser', async (req, res) => {
            const { user_kakao_id, matched_kakao_id } = req.body;

            try {
                const query = `
                    INSERT INTO matched_users (user_kakao_id, matched_kakao_id)
                    VALUES (?, ?)
                `;
                await db.execute(query, [user_kakao_id, matched_kakao_id]);

                console.log('Matched user saved successfully:', { user_kakao_id, matched_kakao_id }); // 수정된 로그
                res.status(200).json({ message: 'Matched user saved successfully' });
            } catch (error) {
                console.error('Error saving matched user:', error);
                if (!res.headersSent) { // 응답이 이미 전송되었는지 확인
                    res.status(500).json({ error: 'Failed to save matched user' });
                }
            }
        });

        
           // 매칭된 사용자 조회
           server.get('/api/getMatchedUsers/:userKakaoId', async (req, res) => {
            const { userKakaoId } = req.params;
        
            try {
                const query = `
                    SELECT u.kakao_id AS partnerId, u.username, u.profileImage, mu.matched_at 
                    FROM matched_users mu
                    JOIN users u ON u.kakao_id = mu.matched_kakao_id
                    WHERE mu.user_kakao_id = ?
                    ORDER BY mu.matched_at DESC
                `;
                
                const [rows] = await db.execute(query, [userKakaoId]);
                console.log('Matched users fetched:', rows);
        
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error fetching matched users:', error);
                res.status(500).json({ error: 'Failed to fetch matched users' });
            }
        });
        

       // 서버에서 타이머 확인 API
server.get('/api/getRoomTime/:roomId', (req, res) => {
    const { roomId } = req.params;

    // 방의 남은 시간을 저장하는 rooms 객체를 사용하여 남은 시간 확인
    const remainingTime = rooms[roomId];

    // 콘솔 로그로 남은 시간 확인
    if (remainingTime !== undefined) {
        console.log(`Room ${roomId} has ${remainingTime} seconds remaining.`);
        res.status(200).json({ remainingTime, roomId });
    } else {
        console.log(`Room ${roomId} not found or time has expired.`);
        res.status(404).json({ error: 'Room not found or time has expired' });
    }
});


// partnerId를 기반으로 roomId 가져오기
server.get('/api/getRoomId/:partnerId', async (req, res) => {
    const { partnerId } = req.params;

    try {
        const findQuery = `
            SELECT id FROM single_chat_rooms
            WHERE (user1_id = ? OR user2_id = ?)
            ORDER BY id ASC
        `;
        const [existingRooms] = await db.execute(findQuery, [partnerId, partnerId]);

        if (existingRooms.length > 0) {
            const roomId = existingRooms[0].id;
            res.status(200).json({ roomId });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        console.error('Failed to get room ID:', error);
        res.status(500).json({ error: 'Failed to get room ID' });
    }
});


        server.all('*', (req, res) => {
            return handle(req, res);
        });

        httpServer.listen(3000, (err) => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        });
    });
}

init();
