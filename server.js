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

                res.cookie('token', access_token, { httpOnly: false, secure: !dev, sameSite: 'lax' });
                res.cookie('user', JSON.stringify(userInfo), { httpOnly: false, secure: !dev, sameSite: 'lax' });

                await db.query(
                    'INSERT INTO users (kakao_id, username, password, zem_balance) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE username = VALUES(username), password = VALUES(password)',
                    [userInfo.id, nickname, '', 0]
                );

                res.redirect('/landing');
            } catch (error) {
                console.error(error);
                res.redirect('/?login=failed');
            }
        });


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
