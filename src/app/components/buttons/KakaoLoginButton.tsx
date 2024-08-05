import Link from 'next/link';
import Image from 'next/image';

const KakaoLoginButton = () => {
  const redirect_URI = "http://localhost:3000/landing/authcallback"
  const client_ID = "f80b172c8fd2c4405878f3227740f910"
  return (
      <Link
        href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${client_ID}&redirect_uri=${redirect_URI}`}
      >
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
  );
};

export default KakaoLoginButton;