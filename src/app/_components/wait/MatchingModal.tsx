'use client'
import { useState, useEffect, useRef } from 'react';

import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { postData } from '@/app/api/api';
import { useDispatch } from 'react-redux';
import { setMatchingModalClose } from '@/state/actions';
import { idealType } from '@/app/(route)/wait/page';

interface Props {
    idealData: idealType;
    handleMatchingModal : ()=>void
    setMatchedUserId: (value: String)=>void
}

const MatchingModal = ({idealData, handleMatchingModal, setMatchedUserId}: Props) => {
    const dispatch = useDispatch();
    // const [matchedUserId, setMatchedUserId] = useState<String>();
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    useEffect(() => {
        const handleMatchRequest = async () => {
            try {
                console.log(userId);
                console.log(idealData);

              const response = await fetch('http://localhost:8080/matching', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  requestUserId: userId,
                  idealType: idealData,
                }),
              });
          
              if (!response.ok) {
                throw new Error('매칭 요청 실패');
              }
          
              const data = await response.json();
          
              if (data.wsPort) {
                const ws = new WebSocket(`ws://localhost:${data.wsPort}`);
          
                ws.onopen = () => {
                  ws.send(JSON.stringify({ type: 'join', data: { userId: userId } }));
                };
          
                ws.onmessage = (event) => {
                  const message = JSON.parse(event.data);
          
                  if (message.type === 'match') {
                    const response = JSON.stringify(message.matchedUserId)
                    alert('매칭 성공: ' + response);
                    setMatchedUserId(response);
                    console.log(response)
                    ws.close();
                  } else if (message.type === 'timeout') {
                    alert('매칭 실패: 시간 초과');
                    ws.close();
                  }
                };
          
                ws.onclose = () => {
                  console.log('WebSocket connection closed');
                  handleMatchingModal();
                };
              }
            } catch (error) {
              console.error('매칭 요청 실패:', error);
              handleMatchingModal();
            }
          };
          handleMatchRequest();
    })

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

    return (
        <div className="z-20 w-full h-full flex justify-center items-center fixed inset-0 bg-black bg-opacity-0">
            <div className=" w-6/10 h-7/10 flex flex-col items-center justify-center bg-white border-main-color border-4 rounded-md">

                <div className='w-4/10 h-1/10'>
                <p className='w-full h-7/10 font-mono flex items-center justify-center text-center text-lg text-white shadow-sm bg-main-color rounded-full'>
                    매칭 중
                </p>
                </div>


                <div className="w-4/5 h-6/10 flex flex-col items-center justify-center box-border p-1">
                    <div className='w-2/5 h-3/5 bg-gray-300 rounded-full border-main-color'>
                    </div>
                </div>
                <div className="w-4/5 h-2/10 text-3xl flex flex-col justify-center items-center box-border p-1">
                &nbsp;&nbsp;&nbsp;&nbsp;잠시만 기다려주세요...
                </div>
            </div>
        </div >
    );
};

export default MatchingModal;