const express = require('express');
const next = require('next');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const KAKAO_CLIENT_ID = '6d162d06e3d6478d7d70318a5a6e8735';
const KAKAO_REDIRECT_URI = 'http://localhost:3000/api/auth/kakao/callback';

app.prepare().then(() => {
    const server = express();
    server.use(cookieParser());

    // CORS 설정 추가
    server.use(cors({
        origin: 'http://localhost:3000', // 클라이언트의 도메인
        credentials: true // 쿠키를 포함한 요청을 허용
    }));

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

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
