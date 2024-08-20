import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import Image from 'next/image';

interface Partner {
  id: string;
  profileImage: string;
  username: string;
  matchedAt: string;
}

const MatchedUserContainer = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [cookies] = useCookies(['user']);
  const userKakaoId = cookies.user?.id;  // 현재 사용자 kakoId

  useEffect(() => {
    const fetchMatchedUsers = async() => {
      try {
        console.log('Fetching matched users for ID:', userKakaoId);
        const response = await axios.get(`/api/getMatchedUsers/${userKakaoId}`); // 여기서도 수정
        setPartners(response.data);
      } 
      catch (error) {
        console.error('fetch matched users 접근에 실패:', error);
      }
  };
  if (userKakaoId) {
    fetchMatchedUsers();
}
}, [userKakaoId]);
  
  return (
    <div className="flex flex-wrap justify-center items-center">
      {partners.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">아직 매칭된 상대가 없습니다.
        </div>
      ) : (
        partners.map((partner) => (
          <div key={partner.id} className="w-1/5 h-1/5 m-4 border-2 border-gray-200 rounded-lg flex items-center justify-center">
            <Image
              src={partner.profileImage || "/wait/default-profileImage.png"}
              alt = "매칭된 유저 프로필"
              width={100}  // 원하는 너비로 설정
              height={100}
              className="w-full h-full object-cover"
              />
              <div className="mt-2 text-center">
                <div>{partner.username}</div>
                <div className="text-sm text-gray-500">{new Date(partner.matchedAt).toLocaleDateString()}</div>
              </div>
          </div>     
        ))
      )}
    </div>
  )
}

export default MatchedUserContainer;
