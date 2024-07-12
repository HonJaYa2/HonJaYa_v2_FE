'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigationbar from "@/app/_components/common/Navigationbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";
import { FEATURE_OF_HONJAYA } from "@/app/utils/assets/constants";
import FeatureContainer from "../landing/FeatureContainer";
import { useCookies } from 'react-cookie';
import Typewriter from './Typewritter'; 
import KakaoLoginButton from '@/app/_components/buttons/KakaoLoginButton';
import { useSearchParams } from 'next/navigation';  // useSearchParams 훅 추가
import { FiCheckCircle } from 'react-icons/fi'; // 성공
import { BsChatDots } from 'react-icons/bs'; // 그룹 채팅
import { GiCycle } from 'react-icons/gi'; // 유동적

const dataTexts = ["천생연분", "알콩달콩", "솔로탈출" , "오늘부터 1일"];

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const features = Object.entries(FEATURE_OF_HONJAYA);
  const [cookies, , removeCookie] = useCookies(['token', 'user']);
  const [alwaysVisible, setAlwaysVisible] = useState(true);
  const searchParams = useSearchParams();  // useSearchParams 훅 사용

  useEffect(() => {
    console.log('Cookies:', cookies);

    const login = searchParams.get('login');

    if (login === 'success') {
      alert('로그인에 성공했습니다!');
    } else if (login === 'failed') {
      alert('로그인에 실패했습니다.');
    }

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setAlwaysVisible(false);
      } else {
        setAlwaysVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cookies, searchParams]);

  // 랜덤 하트 생성
  const createHearts = () => {
    const hearts = [];
    for (let i = 0; i < 30; i++) { // 하트 개수 30개로 줄이기
      const size = Math.random() * 30 + 5;
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 80}%`,
        animationDuration: `${Math.random() * 55 + 15}s`
      };
      hearts.push(<div key={i} className="heart" style={style}></div>);
    }
    return hearts;
  };

  return (
    <div className="flex flex-col items-center justify-between bg-white">
      <Navigationbar alwaysVisible={alwaysVisible} />
      <div className="relative w-screen h-screen">
        <Image
          src="/landingImages/mainPoster.jpg"
          alt="혼자야 메인 이미지"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-black bg-opacity-50 flex items-end justify-end p-8">
          <div className="text-white text-right mb-44 mr-20">
            <p className="mb-4 text-5xl">연애하고싶을 땐?</p>
            <p className="text-left text-4xl">혼자야</p>
          </div>
        </div>
      </div>
      
      {/* 2페이지 */}
      <div className="relative w-screen h-screen bg-red-300 justify-center">
        <div className="text-white text-center">
          <p className="mt-16 mb-4 text-xl">여기서 새로운 연인을 만들어가요</p>
          <p className="text-4xl font-bold">혼자야 에서 <Typewriter texts={dataTexts} /></p>
        </div>

        {/* 좌측 글과 우측 이미지 */}
        <div className="absolute flex items-start" style={{ top: '20%', left: '10%' }}>
          <div className="bg-white p-10 shadow-lg rounded-lg mr-10 mt-20">
            <p className="text-3xl text-gray-800 text-center">혼자야를 이용해야 할</p>
            <p className="text-center text-2xl font-bold text-gray-800 mb-20 border-b-2 py-4"><span className="text-red-500 text-3xl">3</span>가지 point!</p>
            <div className="flex space-x-10">
              <div className="relative flex flex-col items-center border-4 rounded-xl">
                <span className="text-5xl text-gray-800 opacity-60 mt-4">01</span>
                <span className="font-bold text-xl whitespace-nowrap mt-4 text-center bg-yellow-300 text-black px-2">높은 매칭 성공률</span>
                <FiCheckCircle size={40} color="green" className="mt-4 mb-4" />
              </div>
              <div className="relative flex flex-col items-center border-4 rounded-xl">
                <span className="text-5xl text-gray-800 opacity-60 mt-4">02</span>
                <span className="font-bold text-xl whitespace-nowrap mt-4 text-center bg-yellow-300 text-black px-2">그룹 채팅 지원</span>
                <BsChatDots size={40} color="blue" className="mt-4" />
              </div>
              <div className="relative flex flex-col items-center border-4 rounded-xl">
                <span className="text-5xl text-gray-800 opacity-60 mt-4">03</span>
                <span className="font-bold text-xl whitespace-nowrap mt-4 text-center bg-yellow-300 text-black px-2">유동적 매칭 관리</span>
                <GiCycle size={40} color="orange" className="mt-4" />
              </div>
            </div>
          </div>

          <Image
            src="/landingImages/couple.png"
            alt="우측 이미지"
            width={500} // 이미지 너비 조정
            height={500} // 이미지 높이 조정
            className="mt-20 ml-60"
          />
        </div>
      </div>

      {/* 3페이지 */}
      <div className="w-full h-auto">
        {features.map((contents, index) => (
          <FeatureContainer
            key={index}
            index={index}
            imageFirst={index % 2 === 0}
            imageUrl={contents[1][0] as string}  // 이미지 URL은 string으로 타입 캐스팅
            contents={contents[1][1]}  // contents는 JSX.Element로 전달
          />
        ))}
      </div>

       {/* 4페이지 */}
      <div className="bg-red-100 heart-section w-screen h-screen p-14 px-44 relative overflow-hidden">
        <div className="text-left text-white-300 text-xl relative z-10">
          <p>지금 망설이고 있는 당신!!</p>
          <p>기회를 놓치지 마세요.</p>
          <p>혼자야에서 도와드리겠습니다.</p>
        </div>
        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <div className="relative z-10 p-4">
            <p className="font-bold text-gray-700 text-3xl mb-40 text-center">
              지금이 기회입니다!<br />
              망설이는 동안 시간은 계속 갑니다
            </p>
            <p className="text-center text-gray-500 text-lg">이상형 만나러 가기</p>
          </div>
          
          {/* 애니메이션 화살표 */}
          <div className="animate-bounce mb-4 relative z-10">
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {/* 카카오 로그인 이미지 버튼 */}
          <KakaoLoginButton />
        </div>

        {/* 애니메이션 하트 추가 */}
        {createHearts()}
      </div>
    </div>
  );
};

export default Landing;
