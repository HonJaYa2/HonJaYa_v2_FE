import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';

const SingleChatRoom = ({ object }: any) => {
  const [partnerProfile, setPartnerProfile] = useState<string>("")
  const [roomId, setRoomId] = useState<string>("")
  const [remainHour, setRemainHour] = useState<number>()
  const [remainMinute, setRemainMinute] = useState<number>()

  useEffect(() => {
    const now = new Date().getTime();
    const createdAt = new Date(object.createdAt).getTime();
    const remain_time_by_second = (86400000 - (now - createdAt)) / 1000
    setRemainHour(Math.floor(remain_time_by_second / 3600));
    setRemainMinute(Math.floor((remain_time_by_second % 3600) / 60)); 

    if (object.participants[0].id.toString() === localStorage.getItem("user_id")) {
      setPartnerProfile(() => object.participants[1].profileImageUrl);
    } else {
      setPartnerProfile(() => object.participants[0].profileImageUrl);
    }
  }, [object])

  return (
    <div className="w-4/5 h-4/5 flex-col justify-center shadow-lg rounded-lg">
      <Link className="w-full h-full" href={`/chat/${object.id}`}>
        <div className="relative w-full h-full hover:border-main-color hover:border-4 rounded-lg">
        <img
          className="absolute inset-0 w-full h-full object-cover shadow-lg rounded-md"
          src={partnerProfile}
          alt="partner_profile"
        />
        </div>
      </Link>
      <div className='w-full h-2/10 text-center flex justify-end'>
        <div className='text-2xl z-50 w-full h-full border-box flex-col flex items-center justify-center'>
          {remainHour} : {remainMinute}
        </div>
      </div>
    </div>
  )
}

export default SingleChatRoom;