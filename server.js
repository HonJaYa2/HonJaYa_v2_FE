const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const KAKAO_SECRET_KEY = 'DEV418F3416856E0F8D07D365ADD2E0B7387BDE3';
const KAKAO_CLIENT_ID = '6d162d06e3d6478d7d70318a5a6e8735';
const KAKAO_REDIRECT_URI = 'http://localhost:3000/api/auth/kakao/callback';

// MySQL 연결 설정
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root59',
    database: 'zemshop'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
    } else {
        console.log('MySQL connected successfully.');
    }
});

app.prepare().then(() => {
    const server = express();
    server.use(cookieParser());
    server.use(bodyParser.json());

    // CORS 설정 추가
    server.use(cors({
        origin: 'http://localhost:3000', // 클라이언트의 도메인
        credentials: true // 쿠키를 포함한 요청을 허용
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

            console.log('User ID:', userInfo.id);
            console.log('Access Token:', access_token);

            // 사용자 정보와 토큰을 쿠키에 저장
            res.cookie('token', access_token, { httpOnly: false, secure: !dev, sameSite: 'lax' });
            res.cookie('user', JSON.stringify(userInfo), { httpOnly: false, secure: !dev, sameSite: 'lax' });

            // 사용자 정보를 데이터베이스에 저장
            db.query('INSERT INTO users (token, user) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), user = VALUES(user)', [access_token, JSON.stringify(userInfo)], (err) => {
                if (err) {
                    console.error('Error inserting user:', err);
                }
            });

            console.log('Redirecting to /landing');
            res.redirect('/landing');  // 로그인 후 랜딩 페이지로 리디렉션
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
    server.get('/api/getZem/:userId', (req, res) => {
        const userId = req.params.userId;
        db.query('SELECT zem FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching ZEM:', err);
                res.status(500).json({ error: 'Error fetching ZEM' });
            } else {
                if (results.length > 0) {
                    res.json(results[0].zem);
                } else {
                    console.error('User not found:', userId);
                    res.status(404).json({ error: 'User not found' });
                }
            }
        });
    });

    // 결제준비 엔드포인트
    server.post('/api/pay/ready', async (req, res) => {
        try {
            const { itemName, price, userId } = req.body;
            const partner_order_id = `order_${new Date().getTime()}`; // partner_order_id 생성
            const data = {
                cid: 'TC0ONETIME',
                partner_order_id: partner_order_id,
                partner_user_id: userId,
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
            res.cookie('partner_user_id', userId, { httpOnly: true });  // userId 쿠키에 저장
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
                partner_user_id: partner_user_id,  // 동일한 userId 사용
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
            const userId = approvedData.partner_user_id;
            const zemAmount = parseInt(approvedData.amount.total, 10); // 예시: 결제 금액을 Zem 수로 사용

            db.query('UPDATE users SET zem = zem + ? WHERE id = ?', [zemAmount, userId], (err) => {
                if (err) {
                    console.error('Error updating ZEM:', err);
                    res.status(500).json({ error: 'Error updating ZEM' });
                } else {
                    res.redirect(`http://localhost:3000/shop?payment=success&userId=${userId}`); // 결제 성공 후 클라이언트로 리디렉션
                }
            });
        } catch (error) {
            console.error(error);
            res.redirect('http://localhost:3000/shop?payment=fail'); // 결제 실패 후 클라이언트로 리디렉션
        }
    });

    // 결제 실패 엔드포인트
    server.get('/api/pay/fail', (req, res) => {
        res.status(400).json({ message: 'Payment failed' });
    });

    // 결제 취소 엔드포인트
    server.get('/api/pay/cancel', (req, res) => {
        res.status(200).json({ message: 'Payment canceled' });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
