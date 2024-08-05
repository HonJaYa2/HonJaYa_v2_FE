'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getData, putData } from "@/app/api/api";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";


type Props = {
    setOpenTeamInfoModal: () => void;
}

type memberInfo = {
    name: string;
    // gender: string;
}

const TeamInfoModal = ({ setOpenTeamInfoModal }: Props) => {

    const [myId, setMyId] = useState<string>("");
    // const [enterButton, setEnterButton] = useState<boolean>(false);
    const [chatRoomId, setChatRoomId] = useState<String>("");
    const [refresh, setRefresh] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<String>("");
    // const [members, setMembers] = useState<string[]>([]);
    const [memberNames, setMemberNames] = useState<string[]>([]);
    const [isJoined, setIsJoined] = useState<boolean>(true);
    // const onGroup = useSelector((state: RootState) => state.onGroup.onGroup)
    // const dispatch = useDispatch()
    const [showTooltip, setShowTooltip] = useState(false);
    const [memberInfo, setMemberInfo] = useState<memberInfo>()
    const router = useRouter();
    const timerRef = useRef<any>();

    useEffect(() => {
        const getMemberName = async (memberId: string) => {
            try {
                const response = await getData(`/user/get/${memberId}`, "groupChat")
                return response.name
            } catch (error) {
                console.log(error);
            }
        }

        const getGroupInfo = async () => {
            try {
                const response = await getData(`/group/user/${localStorage.getItem('mongoId')}`, "groupChat")
                console.log(response);
                setTitle(response.title)
                setContent(response.content)
                const members = response.members;
                members.map(async (member: string,) => {
                    if (member !== localStorage.getItem("mongoId")) {
                        const name = await getMemberName(member)
                        console.log(name)
                        setMemberNames(prev => [...prev, name])
                    }
                })

                //채팅 방 잡혀있으면 채팅 방 ID 가져오기
                if (response.roomId) {
                    setChatRoomId(response.roomId)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getGroupInfo();
        if (refresh) setRefresh(false);
    }, [refresh,]);

    // const getMemberName = async (memberId: string) => {
    //     try {
    //         const response = await getData(`/user/get/${memberId}`, "groupChat" )
    //         return response.name
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    //다른 모달이랑 데이터 가져오는 로직 통일해야됨
    // useEffect(() => {
    //     const getMemberName = async (memberId: string) => {
    //         try {
    //             const response = await getData(`/user/get/${memberId}`, "groupChat")
    //             return response.name
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     console.log(chatRoomId)
    //     if (isJoined) {
    //         members.map(async (member,) => {
    //             if (member !== localStorage.getItem("mongoId")) {
    //                 const name = await getMemberName(member)
    //                 console.log(name)
    //                 setMemberNames(prev => [...prev, name])
    //             }
    //         })
    //     }
    // }, [isJoined])

    const exitModal = () => {
        setOpenTeamInfoModal();
    }

    const handleRefresh = () => {
        setRefresh(prev => !prev);
    }

    const enterChatRoom = () => {
        router.push(`chat/${chatRoomId}`)
    }

    const handleDisabledButton = () => {
        alert("팀 채팅 방이 아직 생성되지 않았습니다.")
    }

    const handleMouseEnter = async (memberName: string) => {
        try {
            // const response = await getData(`/user/get/${member}`, "groupChat")
            // setMemberInfo({ name: response.name, gender: response.gender })
            setMemberInfo({ name: memberName })

            timerRef.current = setTimeout(() => {
                setShowTooltip(true);
            }, 3000); // 3초 후에 툴팁 표시
        } catch (e) {
            console.log(e);
        }
    }

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setShowTooltip(false);
    }


    return (
        <div className="z-20 w-screen h-screen flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
            <form className='z-30 absolute bg-white w-4/10 h-7/10 border-main-color border-4 rounded-lg flex-col justify-around'>
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
                <div className='w-full h-6/10 font-jua text-lg flex-col flex justify-center items-center rounded-sm'>
                    <div className="font-jua text-3xl w-full h-2/10 text-center">
                        멤 버
                    </div>

                    <div className='w-8/10 h-3/10 border-2 border-main-color overflow-auto '>
                        {memberNames?.map((memberName, index) => (
                            <div className="w-full h-1/2 flex border-2 border-gray-100  hover:border-main-color" key={index}>
                                <div className='w-full h-full flex flex-col justify-center items-center'
                                    onMouseEnter={() => handleMouseEnter(memberName)}
                                    onMouseLeave={handleMouseLeave}>
                                    {memberName}
                                </div>
                            </div>
                        ))}
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-opacity-55 bg-black text-white text-center text-sm rounded-lg">
                                {memberInfo?.name}
                            </div>
                        )}
                    </div>
                </div>
                {chatRoomId ?
                    <div 
                    className="w-full h-3/10 flex flex-col items-center">
                    <button
                            type="button"
                            className="w-5/10 h-3/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-md hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2 active:ring-0 outline-none"
                            onClick={enterChatRoom}
                        >
                            채팅 방 입장
                        </button>
                    </div> :
                    <div
                        className="w-full h-3/10 flex flex-col items-center">
                        <button type="button" onClick={handleDisabledButton} className="w-5/10 h-3/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-gray-400 to-gray-200 rounded-md hover:ring-4 hover:ring-gray-300 active:bg-gradient-to-bl active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2 active:ring-0 outline-none cursor-not-allowed">
                            채팅 방 입장
                        </button>
                    </div>

                }
            </form>
        </div>
    )
}

export default TeamInfoModal;
