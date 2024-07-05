'use client'

import Navigationbar from "@/app/_components/common/Navigationbar";
import KakaoLoginButton from "@/app/_components/buttons/KakaoLoginButton";
import EnterMainButton from "@/app/_components/buttons/EnterMainButton";

import { useDispatch, useSelector } from "react-redux";
import { approve, deny } from "@/state/actions";
import { RootState } from "@/state/reducers/rootReducer";

import { FEATURE_OF_HONJAYA } from "@/app/utils/assets/constants"
import FeatureContainer from "../landing/FeatureContainer";
import { useEffect, useState } from "react";
import { verifyUser } from "@/app/utils/verifyUser";
import { useCookies } from 'react-cookie';
import SignUpModal from "@/app/_components/signup/SignUpModal";

const Landing = () => {
  const dispatch = useDispatch();
  const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined)
  const profileSet = useSelector((state: RootState) => state.profileCheck.profileSet)
  const features = Object.entries(FEATURE_OF_HONJAYA);
  // const [cookies, , removeCookie] = useCookies();
  const [openSignUpModal, setOpenSignUpModal] = useState(false)

  useEffect(() => {
    console.log(isLogined)

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

      if(!profileSet && !openSignUpModal) setOpenSignUpModal(prev => !prev);
    }

  }, [isLogined, openSignUpModal])

  // useEffect(() => {
  //   if(!profileSet && isLogined === "Y") {
  //     setOpenSignUpModal(true);
  //   }
  // }, [])


  return (

    <div className="flex h-screen w-screen flex-col items-center justify-between bg-white">
      <Navigationbar />
      <div className="w-full h-2"></div>
      <div className="w-full h-full scroll-auto">
        <div className="w-full h-2/5 ">
          <div className='flex rounded-sm items-center justify-end bg-couple-image-1 bg-cover bg-center w-full h-full'>
            <div className="flex justify-center items-center w-1/4 h-3/5 box-border p-10">
              {isLogined === "Y" ? <EnterMainButton /> : null}
            </div>
          </div>
        </div>
        <div className="w-full h-auto ">
          {features.map((contents, index) => (
            <FeatureContainer key={index} index={index} imageFirst={index % 2 === 0} imageUrl={contents[1][0]} contents={contents[1][1]} />
          ))}
        </div>
        {openSignUpModal && <SignUpModal setOpenSignUpModal={() => setOpenSignUpModal}/>}
      </div>
    </div>
  );
}

export default Landing;