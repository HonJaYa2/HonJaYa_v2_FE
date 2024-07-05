'use client'
import { useState, useEffect, useRef } from 'react';

import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { postData } from '@/app/api/api';
import { useDispatch } from 'react-redux';
import { setMatchingModalClose } from '@/state/actions';
import MatchingModal from './MatchingModal';

const MatchedUserModal = () => {
    const dispatch = useDispatch();
    const [matchingResult, setMatchingResult] = useState(null);
    const [openMatchingModal, setOpenMatchingModal] = useState(false);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));
    const stompClientRef = useRef<CompatClient>();
    const subscriptionRef = useRef<any>();

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
        setOpenMatchingModal(true); 
    }

    return (
        <div className="z-20 w-full h-full flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className=" w-4/10 h-7/10 flex flex-col items-center justify-center bg-white border-main-color border-4 rounded-md">
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
                        프로필 이미지
                    </div>
                    <div className='w-2/5 h-full border-2 rounded-md border-main-color'>
                        프로필
                    </div>
                </div>
                <div className="w-4/5 h-2/10  flex flex-col justify-around items-center box-border p-1">
                    <button type="button"  className="w-1/2 h-4/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-full hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">
                    채팅방 입장하기
                    </button>

                    <button type="button" onClick={handleMatchingModal} className="w-1/2 h-4/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-full hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">
                    다른 분과 매칭을 원해요
                    </button>
                </div>
            </div>
            {openMatchingModal && <MatchingModal setOpenMatchingModal={()=>setOpenMatchingModal}/>}
        </div >
    );
};

export default MatchedUserModal;
