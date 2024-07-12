import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { approve, logout as logoutAction } from '@/state/actions';

declare global {
  interface Window {
    Kakao: any;
  }
}

const KakaoLoginButton: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
      // 로그인 상태 확인
      if (window.Kakao.Auth.getAccessToken()) {
        setIsAuthenticated(true);
        console.log('Login successful, access token:', window.Kakao.Auth.getAccessToken());
        dispatch(approve());
      }
    };
  }, [dispatch]);

  const handleLogin = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.authorize({
        redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
      });
    }
  };

  const handleLogout = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout(() => {
        setIsAuthenticated(false);
        dispatch(logoutAction());
        console.log('Logged out');
      });
    }
  };

  return (
    <div className="mr-5" style={{ cursor: 'pointer' }}>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div onClick={handleLogin}>
          <Image
            src="/kakao_login_medium_narrow.png"
            alt="카카오 로그인"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default KakaoLoginButton;
