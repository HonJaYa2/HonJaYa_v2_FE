'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navigationbar from "@/app/components/common/Navigationbar";
import { useDispatch, useSelector } from "react-redux";
import { approve } from "@/state/actions";
import { RootState } from "@/state/reducers/rootReducer";
import { FEATURE_OF_HONJAYA } from "@/app/utils/assets/constants";
import FeatureContainer from "../landing/FeatureContainer";
import { verifyUser } from "@/app/utils/verifyUser";
import { useCookies } from 'react-cookie';
import SignUpModal from "@/app/components/signup/SignUpModal";
import Typewriter from './Typewritter'; // Typewriter 컴포넌트 import

const dataTexts = ["천생연분", "알콩달콩", "솔로탈출"];

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined)
  const profileSet = useSelector((state: RootState) => state.profileCheck.profileSet)
  const features = Object.entries(FEATURE_OF_HONJAYA);
  // const [cookies, , removeCookie] = useCookies();
  const [openSignUpModal, setOpenSignUpModal] = useState(false)

  useEffect(() => {
    console.log(isLogined);
    console.log(profileSet);

    // const clearAllCookies = () => {
    //   Object.keys(cookies).forEach(cookieName => {
    //     console.log(cookieName)
    //     removeCookie(cookieName, { path: '/', sameSite: 'none', secure: true });
    //   });
    // };
    //로그인 검증에 verifyUser만 사용하지 않고, isLogined 전역 변수까지 사용하는 이유?
    //페이지를 새로고침하는 경우말고는, 전역변수값 체크로만 로그인 검증 가능하게 하기위해
    //매 페이지마다 verifyUser 호출은 비효율적이라고 생각.
    //성능 측정해서 비교해보자.
    if (!(isLogined === "Y")) {
      // clearAllCookies()

      if (verifyUser()) {
          dispatch(approve());
      }
    } else {
      console.log(profileSet)
      console.log(openSignUpModal)
      if(!profileSet && !openSignUpModal) setOpenSignUpModal(prev => !prev);
    }   
  }, [isLogined, openSignUpModal])

  // useEffect(() => {
  //   if(!profileSet && isLogined === "Y") {
  //     setOpenSignUpModal(true);
  //   }
  // }, [])

  const closeSignUpModal = () => {
    console.log("ssisibal")
    setOpenSignUpModal(false)
  }

  return (
    <div className="flex flex-col items-center justify-between bg-white">
      <Navigationbar />
      <div className="relative w-screen h-screen">
        <Image
          src="/landingImages/mainPoster.jpg"
          alt="혼자야 메인 이미지"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute top-0 right-0 w-full h-full bg-black bg-opacity-50 w-1/3 flex items-end justify-end p-8">
          <div className="text-white text-6xl text-right mb-44">
            <p className="mb-4">연애하고싶을 땐?</p>
            <p className="text-left">혼자야</p>
          </div>
        </div>
      </div>
      
      {/* 2페이지 */}
      <div className="relative w-screen h-screen bg-pink-300 justify-center">
        <div className="text-white text-center">
          <p className="mt-16 mb-4 text-xl">여기서 새로운 연인을 만들어가요</p>
          <p className="text-4xl font-bold">혼자야 에서 <Typewriter texts={dataTexts} /></p>
        </div>

        {/* 좌측 글과 우측 이미지 */}
        <div className="absolute flex items-start" style={{ top: '20%', left: '10%' }}>
          <div className="text-left mr-40">
            <p className="text-4xl text-white mt-10">혼자야를 이용해야 할 3가지</p>
            <p className="text-center text-3xl font-bold text-white">point!!!</p>
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
      <div className="w-screen h-screen bg-red-300 p-14 px-44">
        <div className="text-left text-white text-xl">
          <p>지금 망설이고 있는 당신</p>
          <p>기회를 놓치지 마세요.</p>
          <p>혼자야에서 도와드리겠습니다.</p>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-white text-3xl mb-10 text-center">
            지금이 기회입니다!<br />
            망설이는 동안 시간은 계속 갑니다
          </p>
          <p className="text-white text-lg">이상형 만나러 가기</p>
          
          {/* 애니메이션 화살표 */}
          <div className="animate-bounce mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg">
            카카오 로그인
          </button>
        </div>
        {openSignUpModal && <SignUpModal setOpenSignUpModal={setOpenSignUpModal}/>}
      </div>
    </div>
  );
};

export default Landing;