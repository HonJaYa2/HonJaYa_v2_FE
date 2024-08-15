'use client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMatchingModalClose } from '@/state/actions';
import { filterDataType } from '@/app/(route)/wait/page';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface UserInfo {
    id: string;
    userName: string;
    profileImage: string;
    birthday: Date;
    gender: string;
    height: number;
    weight: number;
    mbti: string;
    religion: string;
    drink_amount: string;
    smoke: string;
    address: string;
}

interface Props {
    filterData: filterDataType;
    matchedUserId: string;  // 서버에서 받은 매칭된 사용자 ID
    handleClose: () => void;
}

const MatchedUserModal = ({ matchedUserId, handleClose }: Props) => {
    console.log('MatchedUserModal 렌더링됨:', matchedUserId);
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [cookies] = useCookies(['user']);
    const [singleChatRoomId, setSingleChatRoomId] = useState<string | null>(null);
    
    const hasCreatedRoom = useRef(false);

    useEffect(() => {
        if (!hasCreatedRoom.current && matchedUserId) {
            createSingleChatRoom();
            hasCreatedRoom.current = true;
        }
    }, [matchedUserId]);

    const fetchUserInfo = async () => {
        try {
            console.log(`Fetching user info from http://localhost:3000/user/${matchedUserId}`);
            const response = await fetch(`http://localhost:3000/user/${matchedUserId}`);
            console.log('Fetch response:', response);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched user info:', data);
                setUserInfo(data);
            } else {
                console.error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        if (matchedUserId) {
            fetchUserInfo();
        }
    }, [matchedUserId]);

    const createSingleChatRoom = async () => {
        if (singleChatRoomId) return; // 이미 채팅방이 생성된 경우 재생성 방지
        try {
            const response = await axios.post('/api/createSingleChatRoom', { 
                user1Id: cookies['user'].id, 
                user2Id: matchedUserId 
            });
            if (response.status === 200) {
                console.log('Chat room created with ID:', response.data.SingleChatRoomId);
                setSingleChatRoomId(response.data.SingleChatRoomId);
            }
        } catch (error) {
            console.error('Failed to create chat room:', error);
        }
    };

    const enterChatRoom = () => {
        if (singleChatRoomId) {
            console.log('Entering chat room with ID:', singleChatRoomId);
            window.location.href = `/chat?roomId=${singleChatRoomId}`;
        } else {
            alert('채팅방 생성 중 오류가 발생했습니다.');
        }
    };

    const calculateAge = (birthday: Date) => {
        const birthDate = new Date(birthday);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const exitModal = async () => {
        try {
            await axios.post('/api/setWaitingState', { 
                kakaoId: cookies.user.id,
                isWaiting: false 
            });
        } catch (error) {
            console.error('Failed to reset waiting state:', error);
        }

        handleClose();
        dispatch(setMatchingModalClose());
    };

    return (
        <div className="z-20 w-full h-full flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-6/10 h-7/10 flex flex-col items-center justify-center bg-white border-main-color border-4 rounded-md">
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

                {userInfo ? (
                    <div className="w-4/5 h-6/10 flex justify-around box-border p-1">
                        <div className='w-2/5 h-full border-2 rounded-md border-main-color'>
                            <img src={userInfo.profileImage} alt="Profile" className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div className='w-2/5 h-full border-2 rounded-md flex justify-center flex-col items-center border-main-color'>
                            <div>
                                이름: {userInfo.userName} <br />
                                나이: {calculateAge(userInfo.birthday)} <br />
                                키: {userInfo.height}cm<br />
                                몸무게: {userInfo.weight}kg<br />
                                MBTI: {userInfo.mbti}<br />
                                종교: {userInfo.religion} <br />
                                주량: {userInfo.drink_amount}<br />
                                흡연여부: {userInfo.smoke}<br />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-4/5 h-6/10 flex justify-center items-center">
                        <p>사용자 정보를 불러오는 중...</p>
                    </div>
                )}

                <div className="w-4/5 h-2/10 flex flex-col justify-around items-center box-border p-1">
                    <button 
                        onClick={enterChatRoom} 
                        disabled={!singleChatRoomId} 
                        className="w-1/2 h-4/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-full hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">
                        채팅방 입장하기
                    </button>

                    <button type="button" onClick={exitModal} className="w-1/2 h-4/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-full hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">
                        다른 분과 매칭을 원해요
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchedUserModal;
