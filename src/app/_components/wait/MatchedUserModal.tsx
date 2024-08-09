'use client'
import { useState, useEffect, useRef } from 'react';

import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { postData } from '@/app/api/api';
import { useDispatch } from 'react-redux';
import { setMatchingModalClose } from '@/state/actions';
import MatchingModal from './MatchingModal';
import { idealType } from '@/app/(route)/wait/page';
import Image from 'next/image';

interface Props {
    idealData: idealType;
}

type UserInfo = {
    userName: String,
    profileImage: String,

    birthday: Date,
    gender: String,
    height: Number,
    weight: Number,
    mbti: String,
    religion: String,
    drinkAmount: String,
    smoke: Boolean,
    address: String,
}

const MatchedUserModal = ({ idealData }: Props) => {
    const dispatch = useDispatch();
    const [matchedUserId, setMatchedUserId] = useState<String>();
    const [openMatchingModal, setOpenMatchingModal] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>()
    // const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    // const stompClientRef = useRef<CompatClient>();
    // const subscriptionRef = useRef<any>();

    useEffect(() => {
        // if (!openMatchingModal && !userInfo) {
        //     setOpenMatchingModal(() => true);
        // }
        console.log(matchedUserId)
        const getUserInfo = async () => {
            const response = await fetch('http://localhost:8080/user/getInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    matchedUserId: matchedUserId,
                }),
            });
            console.log(response)
            return response.json();
        }
        if(matchedUserId) {
            getUserInfo().then(data => {
                console.log(data)
                setUserInfo(data.matchedUser[0])
            });
        }

    }, [openMatchingModal])

    // useEffect(() => {    
    //     const socket = new SockJS('http://localhost:8080/api/ws/match');
    //     stompClientRef.current = Stomp.over(socket);

    //     const connectCallback = (frame:any) => {
    //         console.log('Connected: ' + frame);

    //         if (subscriptionRef.current) {
    //             subscriptionRef.current.unsubscribe();
    //         }

    //         subscriptionRef.current = stompClientRef.current?.subscribe(`/topic/match/${userId}`, (message) => {
    //             try {
    //                 const result = JSON.parse(message.body);
    //                 setMatchingResult(result);
    //                 console.log(`New match received for User ${userId}:`, result);
    //             } catch (error) {
    //                 console.error(`Error parsing message body for User ${userId}:`, error);
    //             }
    //         });

    //         requestMatch();
    //     };

    //     stompClientRef.current.connect({}, connectCallback);

    //     return () => {
    //         if (subscriptionRef.current) {
    //             subscriptionRef.current.unsubscribe();
    //         }
    //         if (stompClientRef.current) {
    //             stompClientRef.current.disconnect();
    //         }
    //     };
    // }, [userId]);

    // const requestMatch = async () => {
    //     const response = await postData(`/match/${userId}`, "", "honjaya");
    //     console.log(response);
    // };

    // useEffect(() => {
    //     if (matchingResult) {
    //         alert("매칭 성사!");
    //         dispatch(setMatchingModalClose());
    //     }
    // }, [matchingResult]);

    const exitModal = () => {
        dispatch(setMatchingModalClose());
    }

    const handleMatchingModal = () => {
        const newState = !openMatchingModal;
        setOpenMatchingModal(newState);
    }

    return (
        <div className="z-20 w-full h-full flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className=" w-6/10 h-7/10 flex flex-col items-center justify-center bg-white border-main-color border-4 rounded-md">
                <div className="w-full h-1/10 pr-4 flex flex-col items-end justify-end box-border p-1">
                    <button
                        type="button"
                        className="w-1/10 h-6/10 text-white outline-none rounded-sm bg-main-color hover:ring-2 hover:ring-red-100 active:mt-1 active:border-none active:ring-0"
                        onClick={exitModal}>
                        <div className="w-full h-full flex-col flex items-center justify-center text-center outline-none active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2">
                            X
                        </div>
                    </button>
                </div>
                <p className='w-7/10 h-1/10 font-mono text-xl text-red-500 text-center'>
                    매칭이 성사되었습니다
                </p>

                <div className="w-4/5 h-6/10  flex justify-around box-border p-1">
                    <div className='w-2/5 h-full border-2 rounded-md border-main-color'>
                        {/* <Image
                            src={userInfo?.profileImage as string}
                            alt="matchedUser_profile_image"
                            layout="fill"
                            objectFit="cover"
                        /> */}
                    </div>
                    <div className='w-2/5 h-full border-2 rounded-md flex justify-center flex-col items-center border-main-color'>
                        <div>
                            이름: {userInfo?.userName} <br/>
                            {/* 나이: {userInfo?.birthday.getFullYear()} <br/> */}
                            {/* 키: {userInfo?.height.toFixed()}<br/> */}
                            {/* 몸무게: {userInfo?.weight.toFixed()}<br/> */}
                            MBTI: {userInfo?.mbti}<br/>
                            종교: {userInfo?.religion} <br/>
                            주량: {userInfo?.drinkAmount}<br/>
                            흡연여부: {userInfo?.smoke? "흡연" : "비흡연"}<br/>
                        </div>                        
                    </div>
                </div>
                <div className="w-4/5 h-2/10  flex flex-col justify-around items-center box-border p-1">
                    <button type="button" className="w-1/2 h-4/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-full hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">
                        채팅방 입장하기
                    </button>

                    <button type="button" onClick={handleMatchingModal} className="w-1/2 h-4/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-full hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">
                        다른 분과 매칭을 원해요
                    </button>
                </div>
            </div>
            {openMatchingModal && <MatchingModal idealData={idealData} handleMatchingModal={handleMatchingModal} setMatchedUserId={setMatchedUserId} />}
        </div >
    );
};

export default MatchedUserModal;