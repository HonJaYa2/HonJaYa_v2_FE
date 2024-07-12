// 'use client'
// import { useState, useEffect, useRef } from 'react';

// import SockJS from 'sockjs-client';
// import { CompatClient, Stomp } from '@stomp/stompjs';
// import { postData } from '@/app/api/api';
// import { useDispatch } from 'react-redux';
// import { setMatchingModalClose } from '@/state/actions';

// const MatchingModal = () => {
//     const dispatch = useDispatch();
//     const [matchingResult, setMatchingResult] = useState(null);
//     const [userId, setUserId] = useState(localStorage.getItem('user_id'));
//     const stompClientRef = useRef<CompatClient>();
//     const subscriptionRef = useRef<any>();

//     useEffect(() => {
//         const socket = new SockJS('http://localhost:8080/api/ws/match');
//         stompClientRef.current = Stomp.over(socket);

//         const connectCallback = (frame:any) => {
//             console.log('Connected: ' + frame);

//             if (subscriptionRef.current) {
//                 subscriptionRef.current.unsubscribe();
//             }

//             subscriptionRef.current = stompClientRef.current?.subscribe(`/topic/match/${userId}`, (message) => {
//                 try {
//                     const result = JSON.parse(message.body);
//                     setMatchingResult(result);
//                     console.log(`New match received for User ${userId}:`, result);
//                 } catch (error) {
//                     console.error(`Error parsing message body for User ${userId}:`, error);
//                 }
//             });

//             requestMatch();
//         };

//         stompClientRef.current.connect({}, connectCallback);

//         return () => {
//             if (subscriptionRef.current) {
//                 subscriptionRef.current.unsubscribe();
//             }
//             if (stompClientRef.current) {
//                 stompClientRef.current.disconnect();
//             }
//         };
//     }, [userId]);

//     const requestMatch = async () => {
//         const response = await postData(`/match/${userId}`, "", "honjaya");
//         console.log(response);
//     };

//     useEffect(() => {
//         if (matchingResult) {
//             alert("매칭 성사!");
//             dispatch(setMatchingModalClose());
//         }
//     }, [matchingResult]);

//     return (
//         <div className='invisible'>
//             매칭 중!
//         </div>
//     );
// };

// export default MatchingModal;
