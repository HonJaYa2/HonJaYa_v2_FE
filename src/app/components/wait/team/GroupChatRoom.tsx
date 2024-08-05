import React, { useEffect, useState } from 'react'
import Link from 'next/link';

type Props = {
  object: any;
}

const GroupChatRoom = ({ object }: Props) => {
  // const [title, setTitle] = useState<string>("");
  // const [content, setContent] = useState<string>("")
  const [gender, setGender] = useState<string>("");
  // const [members, setMembers] = useState<string[]>([])
  const [chatName, setChatName] = useState<string>("");

  useEffect(() => {
    const setMetaData = () => {
      // setTitle(() => object.title)
      // setContent(() => object.content)
      setGender(() => object.gender);
      setChatName(() => object.chatName);
    }
    setMetaData();
  }, [object])

  

  return (
    <div className="w-1/5 h-2/5 mx-5 py-1 flex flex-col justify-around bg-white box-border shadow-lg rounded-md border-main-color border-2 hover:border-4" >
      <Link className="w-full h-full flex flex-col justify-around items-center" href={`/chat/${object.id}`}>
        <div className='w-full h-2/10'>
          {chatName}
        </div>
      </Link>
    </div>
  )
}

export default GroupChatRoom;