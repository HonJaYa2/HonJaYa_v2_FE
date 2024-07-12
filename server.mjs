// const express = require('express');
// const next = require('next');
// const axios = require('axios');
// const cookieParser = require('cookie-parser');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// const KAKAO_CLIENT_ID = '9cf71ef46cef2ed784d5f6b86e3ea4ac'; 
// const KAKAO_CLIENT_SECRET = 'Ah6axWFPXt1YOerW2q6UMXXSzFCOOwlr'; 
// const KAKAO_REDIRECT_URI = 'http://localhost:3000/api/auth/kakao/callback';

// app.prepare().then(() => {
//     const server = express();
//     server.use(cookieParser());

//     // Kakao 로그인 URL로 리다이렉트
//     server.get('/api/auth/kakao', (req, res) => {
//         console.log('Redirecting to Kakao OAuth page');
//         const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
//         res.redirect(kakaoAuthUrl);
//     });

//     // Kakao에서 돌아왔을 때 콜백을 처리
//     server.get('/api/auth/kakao/callback', async (req, res) => {
//         const { code } = req.query;

//         if (!code) {
//             console.error('Authorization code is missing');
//             return res.status(400).send('Authorization code is missing');
//         }

//         try {
//             console.log('Authorization code:', code);

//             const response = await axios.post(
//                 'https://kauth.kakao.com/oauth/token',
//                 {},
//                 {
//                     params: {
//                         grant_type: 'authorization_code',
//                         client_id: KAKAO_CLIENT_ID,
//                         redirect_uri: KAKAO_REDIRECT_URI,
//                         code,
//                         client_secret: KAKAO_CLIENT_SECRET,
//                     },
//                     headers: {
//                         'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
//                     },
//                 }
//             );

//             const { access_token } = response.data;

//             if (!access_token) {
//                 console.error('Access token is missing');
//                 return res.status(400).send('Access token is missing');
//             }

//             console.log('Access token:', access_token);

//             const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`, // 액세스 토큰
//                 },
//             });

//             const userInfo = userInfoResponse.data;

//             console.log('User info:', userInfo);

//             // 클라이언트에서 접근할 수 있도록 로컬 스토리지에 저장할 스크립트를 작성
//             res.send(`
//                 <script>
//                     localStorage.setItem('token', '${access_token}');
//                     localStorage.setItem('user', JSON.stringify(${JSON.stringify(userInfo)}));
//                     window.location.href = '/';
//                 </script>
//             `);
//         } catch (error) {
//             console.error('Error during OAuth callback:', error);
//             res.status(500).send('Authentication failed');
//         }
//     });

//     // 로그아웃 처리
//     server.post('/api/auth/logout', (req, res) => {
//         res.clearCookie('token');
//         res.clearCookie('user');
//         res.send({ status: 'success' });
//     });

//     // 모든 요청을 Next.js로 전달
//     server.all('*', (req, res) => {
//         return handle(req, res);
//     });

//     // 서버 실행
//     server.listen(3000, (err) => {
//         if (err) throw err;
//         console.log('> Ready on http://localhost:3000');
//     });
// });
