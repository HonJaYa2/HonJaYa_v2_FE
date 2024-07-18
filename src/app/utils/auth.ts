import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';

// 로그인 상태를 확인하는 함수
export const checkAuth = (): boolean => {
  const cookies = parseCookies();
  console.log('Parsed Cookies:', cookies); // 파싱된 쿠키 확인
  return !!cookies.token; // 쿠키에 token이 있는지 확인하여 로그인 상태를 반환
};

// 파싱된 쿠키를 반환하는 함수
export const getParsedCookies = () => {
  const cookies = parseCookies();
  return {
    token: cookies.token,
    user: cookies.user ? JSON.parse(cookies.user) : null,
  };
};

// 카카오 로그아웃 함수
export const kakaoLogout = () => {
  axios.get('/api/auth/logout')
    .then(() => {
      // 로컬 쿠키 삭제
      destroyCookie(null, 'token');
      destroyCookie(null, 'user');
      window.location.href = '/'; // 홈 페이지로 리다이렉트
    })
    .catch((e) => {
      console.log('Error during logout:', e);
    });
};
