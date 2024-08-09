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

async function init() {
    // MySQL 연결 설정
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root59',
        database: 'zem_shop',
    });

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

        // Socket.IO 연결 이벤트 처리
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('send_message', (data) => {
                io.emit('receive_message', data);
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id);
            });
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
