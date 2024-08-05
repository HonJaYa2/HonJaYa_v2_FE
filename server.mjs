// const express = require('express');
// const next = require('next');
// const axios = require('axios');
// const cookieParser = require('cookie-parser');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// // 여기에 카카오 개발자 콘솔에서 받은 REST API 키를 입력하세요
// const KAKAO_CLIENT_ID = '9cf71ef46cef2ed784d5f6b86e3ea4ac';

// // 여기에 카카오 개발자 콘솔에서 받은 CLIENT SECRET을 입력하세요

// // 여기에 카카오 개발자 콘솔에서 설정한 Redirect URI를 입력하세요
// const KAKAO_REDIRECT_URI = 'http://localhost:3000/api/auth/kakao/callback';

// app.prepare().then(() => {
//     const server = express();
//     server.use(cookieParser());

//     // 로그인 URL
//     server.get('/api/auth/kakao', (req, res) => {
//         const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
//         res.redirect(kakaoAuthUrl);
//     });

//     // 로그인 콜백 URL
//     server.get('/api/auth/kakao/callback', async (req, res) => {
//         const { code } = req.query;
//         try {
//             const response = await axios.post(
//                 'https://kauth.kakao.com/oauth/token',
//                 {},
//                 {
//                     params: {
//                         grant_type: 'authorization_code',
//                         client_id: KAKAO_CLIENT_ID,
//                         redirect_uri: KAKAO_REDIRECT_URI,
//                         code,
//                     },
//                     headers: {
//                         'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
//                     },
//                 }
//             );
//             const { access_token } = response.data;
//             const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                 },
//             });
//             const userInfo = userInfoResponse.data;
//             res.cookie('token', access_token, { httpOnly: true });
//             res.cookie('user', JSON.stringify(userInfo), { httpOnly: true });
//             res.redirect('/');
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Authentication failed');
//         }
//     });

//     // Next.js가 제공하는 모든 요청 처리
//     server.all('*', (req, res) => {
//         return handle(req, res);
//     });

//     // 서버를 포트 3000에서 시작
//     server.listen(3000, (err) => {
//         if (err) throw err;
//         console.log('> Ready on http://localhost:3000');
//     });
// });


//express는 async/await문법을 정식으로 지원하진 않기 때문에,
//해당 문법을 사용한 비동기 작업 중 발생한 에러를 제대로 잡기위해 
//추가적인 라이브러리(express-async-errors) 설치가 필요
//koa는 정식으로 async/await 문법이 지원됨
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import qs from 'qs';

const app = new Koa();
const router = new Router();

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const getToken = async (auth_code) => {
    try {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                grant_type: 'authorization_code',
                client_id: 'f80b172c8fd2c4405878f3227740f910',
                redirect_uri: 'http://localhost:3000/landing/authcallback',
                code: auth_code,                       
            }),
        });
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        throw new Error('Failed to fetch token');
    }
};

router.post('/token', async (ctx) => {
    const { auth_code } = ctx.request.body;
    if (!auth_code) {
        ctx.status = 400;
        ctx.body = { error: '인증 코드 필요' };
        return;
    }

    try {
        const tokenData = await getToken(auth_code);
        ctx.status = 200;
        ctx.body = tokenData;
    } catch (e) {
        ctx.status = 500;
        ctx.body = { error: e.message };
    }
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
