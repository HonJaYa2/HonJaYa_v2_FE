import { useState, useEffect } from 'react';
import { checkAuth, kakaoLogout } from '@/app/utils/auth';
import Link from 'next/link';
import Image from 'next/image';
import { useCookies } from 'react-cookie';

const KakaoLoginButton = () => {
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);

  useEffect(() => {
    console.log('Cookies:', cookies); // 쿠키 확인
    setIsLogined(checkAuth()); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, [cookies]); // 쿠키가 변경될 때마다 확인

  const handleLogout = () => {
    kakaoLogout(); // 카카오 로그아웃 함수 호출
    setIsLogined(false); // 상태 업데이트
  };

  return (
    <>
      {isLogined ? (
        <button onClick={handleLogout} className="mr-5 text-white">
          Logout
        </button>
      ) : (
        <Link href="/api/auth/kakao"> 
          <div className="mr-5">
            <Image
              src="/kakao_login_medium_narrow.png"
              alt="카카오 로그인"
              width={160}
              height={40}
              className="object-contain"
            />
          </div>
        </Link>
      )}
    </>
  );
};

export default KakaoLoginButton;
