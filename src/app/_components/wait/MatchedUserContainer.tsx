import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Image from 'next/image';
import TimeoutModal from '@/app/(route)/modal/@modal/wait/TimeoutModal';

interface Partner {
  partnerId: string;
  profileImage: string;
  username: string;
  matchedAt: string;
}

const MatchedUserContainer = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [cookies] = useCookies(['user']);
  const userKakaoId = cookies.user?.id;  // 현재 사용자 kakaoId
  const [itemCount, setItemCount] = useState(3); // 임시 아이템 수량
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false); // 타임아웃 모달 상태
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null); // 선택된 파트너 ID

  useEffect(() => {
    const fetchMatchedUsers = async () => {
        try {
            console.log('Fetching matched users for ID:', userKakaoId);
            const response = await axios.get(`/api/getMatchedUsers/${userKakaoId}`);
            console.log('Fetched matched users data:', response.data); // 데이터 구조 확인
            setPartners(response.data);
        } catch (error) {
            console.error('Failed to fetch matched users:', error);
        }
    };

    if (userKakaoId) {
        fetchMatchedUsers();
    }
}, [userKakaoId]);

const handleReenterChat = async (partnerId: string) => {
  console.log('Attempting to re-enter chat with partnerId:', partnerId);
  try {
    // partnerId로 roomId를 가져옵니다.
    const roomResponse = await axios.get(`/api/getRoomId/${partnerId}`);
    const roomId = roomResponse.data.roomId;
    console.log('Fetched roomId:', roomId);

    // roomId로 남은 시간 확인 요청
    const timeResponse = await axios.get(`/api/getRoomTime/${roomId}`);
    const { remainingTime } = timeResponse.data;
    console.log('Remaining time:', remainingTime);

    if (remainingTime > 0) {
      window.location.href = `/chat?roomId=${roomId}`;
    } else {
      setSelectedPartnerId(partnerId);
      setIsTimeoutModalOpen(true);
    }
  } catch (error) {
    console.error('Failed to fetch room time:', error);
  }
};


  const handleConfirm = () => {
    if (itemCount > 0) {
      setItemCount(itemCount - 1);
      setIsTimeoutModalOpen(false);
      if (selectedPartnerId) {
        window.location.href = `/chat?roomId=${selectedPartnerId}`;
      }
    } else {
      alert('아이템이 부족합니다.');
    }
  };

  const handleClose = () => {
    setIsTimeoutModalOpen(false);
  };

  return (
    <div className="flex flex-wrap justify-center items-center">
      {partners.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">아직 매칭된 상대가 없습니다.</div>
      ) : (
        partners.map((partner) => (
          <div
            key={partner.partnerId}
            className="w-1/5 h-1/5 m-4 border-2 border-gray-200 rounded-lg flex items-center justify-center"
            onClick={() => handleReenterChat(partner.partnerId)}
          >
            <Image
              src={partner.profileImage || '/wait/default-profileImage.png'}
              alt="매칭된 유저 프로필"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
            <div className="mt-2 text-center">
              <div>{partner.username}</div>
              <div className="text-sm text-gray-500">
                {new Date(partner.matchedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      )}

      {isTimeoutModalOpen && (
        <TimeoutModal onClose={handleClose} onConfirm={handleConfirm} itemCount={itemCount} />
      )}
    </div>
  );
};

export default MatchedUserContainer;
