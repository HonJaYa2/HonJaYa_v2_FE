'use client'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMatchingModalClose } from '@/state/actions';
import { filterDataType } from '@/app/(route)/wait/page';
import Cookies from 'js-cookie';

interface Props {
    filterData: filterDataType;
    handleMatchingModal: (matchedUserId: string | null) => void; // 수정된 부분
    setMatchedUserId: (value: string) => void;
}


const MatchingModal = ({ filterData, handleMatchingModal, setMatchedUserId }: Props) => {
   // 쿠키에서 user 정보를 가져오고 userId를 추출합니다.
   const userCookie = Cookies.get('user');
   let userId: string | undefined;

if (userCookie) {
    const user = JSON.parse(userCookie);
    userId = user.id as string; // 타입을 문자열로 단언
} else {
    console.error('User ID not found in cookies');
}


    // 예시: 매칭이 성공했을 때 handleMatchingModal을 호출하는 부분에서
    useEffect(() => {
        const handleMatchRequest = async () => {
            try {
                console.log('Sending match request with userId:', userId); // 추가된 부분
                const response = await fetch('http://localhost:3000/user/match', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        kakaoId: userId,
                        filterData: filterData,
                    }),
                });
    
                if (response.status === 404) {
                    alert('조건에 맞는 사용자가 없습니다.');
                    handleMatchingModal(null);  // 실패 시 null 전달
                    return;
                }
    
                if (!response.ok) {
                    throw new Error('매칭 요청 실패');
                }
    
                const data = await response.json();
                const matchedUserId = data.matchedUser.kakao_id;
    
                setMatchedUserId(matchedUserId);
                alert('매칭 성공: ' + matchedUserId);
                handleMatchingModal(matchedUserId);  // 성공 시 매칭된 사용자 ID 전달
            } catch (error) {
                console.error('매칭 요청 실패:', error);
                alert('매칭 중 오류가 발생했습니다.');
                handleMatchingModal(null);  // 오류 발생 시 null 전달
            }
        };
    
        if (userId) {
            handleMatchRequest();
        } else {
            console.error('userId is undefined, cannot send match request');
        }
    }, [filterData, handleMatchingModal, setMatchedUserId, userId]);
    


    return (
        <div className="z-20 w-full h-full flex justify-center items-center fixed inset-0 bg-black bg-opacity-0">
            <div className="w-6/10 h-7/10 flex flex-col items-center justify-center bg-white border-main-color border-4 rounded-md">
                <div className='w-4/10 h-1/10'>
                    <p className='w-full h-7/10 font-mono flex items-center justify-center text-center text-lg text-white shadow-sm bg-main-color rounded-full'>
                        매칭 중
                    </p>
                </div>

                <div className="w-4/5 h-6/10 flex flex-col items-center justify-center box-border p-1">
                    <div className='w-2/5 h-3/5 bg-gray-300 rounded-full border-main-color'></div>
                </div>
                <div className="w-4/5 h-2/10 text-3xl flex flex-col justify-center items-center box-border p-1">
                    &nbsp;&nbsp;&nbsp;&nbsp;잠시만 기다려주세요...
                </div>
            </div>
        </div>
    );
};

export default MatchingModal;
