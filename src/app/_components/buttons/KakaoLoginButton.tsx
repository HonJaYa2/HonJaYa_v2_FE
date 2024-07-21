import { useState, useEffect } from 'react';
import { checkAuth, kakaoLogout, getParsedCookies } from '@/app/utils/auth';
import Link from 'next/link';
import Image from 'next/image';
import useAuthCookies from '@/app/utils/useAuthCookies';

const KakaoLoginButton = () => {
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const cookies = getParsedCookies();

  useEffect(() => {
    
    setIsLogined(checkAuth()); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, [cookies]); // 빈 배열을 의존성 배열로 설정하여 한 번만 실행되도록 설정

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
