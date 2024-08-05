'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getData, putData } from "@/app/api/api";
import { useDispatch } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";
import { exitGroup, joinGroup } from "@/state/actions";

type Props = {
    setOpenAcceptMemberModal: () => void;
}
    type memberInfo = {
        name: string;
        gender: string;
    }

const AcceptMemberModal = ({ setOpenAcceptMemberModal }: Props) => {
    const [title, setTitle] = useState<string>("")
    const [numOfMembers, setNumoOfMembers] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const [myId, setMyId] = useState<string>("");
    const [applyerList, setApplyerList] = useState<string[]>([]);
    const [applyerNameList, setApplyerNameList] = useState<string[]>([]);
    const [isLeader, setIsLeader] = useState<boolean>(false);
    const [groupMembers, setGroupMembers] = useState<string[]>([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [memberInfo, setMemberInfo] = useState<memberInfo>()
    // const onGroup = useSelector((state: RootState) => state.onGroup.onGroup)
    const dispatch = useDispatch()
    const timerRef = useRef<any>();

    useEffect(() => {
        const getGroupChatServerUser = async () => {
            try {
                const response = await getData(`/user/${localStorage.getItem('user_id')}`, "groupChat");
                const applyersInfo = response.applicants
                if (applyersInfo) {
                    applyersInfo.map(async (applyer: string,) => {
                        const applyerInfo = await getData(`/user/get/${applyer}`, "groupChat")
                        setApplyerNameList((prev) => [...prev, applyerInfo.name])
                    })
                }
                setIsLeader(response.leader);
                setApplyerList(response.applicants);
                setMyId(response.id);
                // if (response.isParty) {
                //     dispatch(joinGroup())
                // } else {
                //     dispatch(exitGroup())
                // }
            } catch (error) {
                console.log(error);
            }
        }
        getGroupChatServerUser();
    }, []);

    useEffect(() => {
        const getGroupMembers = async () => {
            try {
                const response = await getData(`/group/user/${myId}`, "groupChat");
                console.log(response)
                response.members.map(async (member: string) => {
                    const memberInfo = await getData(`/user/get/${member}`, "groupChat")
                    if (member !== myId) {
                        setGroupMembers((prev) => [...prev, memberInfo.name])
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        getGroupMembers();
    }, [applyerList])

    const exitModal = () => {
        setOpenAcceptMemberModal();
    }

    const releaseMember = (member: string) => {

    }

    const handleSelectedApplyer = async (selectedApplyer: string) => {
        try {
            const Data = {
                leaderUserId: myId,
                invitedUserId: selectedApplyer,
            }
            await putData('/group', Data, "groupChat");

            setApplyerList(prev => prev.filter(applyer => applyer !== selectedApplyer));
        } catch (e) {
            console.log(e);
        }
    }

    const handleMouseEnter = async (member: string) => {
        try {
            const response = await getData(`/user/get/${member}`, "groupChat")
            setMemberInfo({ name: response.name, gender: response.gender })
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
                        className="w-1/10 h-6/10 text-white outline-none rounded-sm bg-main-color hover:ring-2 hover:ring-red-100 active:mt-1 active:ring-0"
                        onClick={exitModal}>
                        <div className="w-full h-full flex-col flex items-center justify-center text-center outline-none active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2">
                            X
                        </div>
                    </button>
                </div>
                <div className='w-full h-9/10 flex-col flex justify-around items-center'>
                    <div className='w-8/10 h-8/10 border-2 border-main-color  overflow-auto rounded-md'>
                        {groupMembers?.map((member, index) => (
                            <div className="w-full h-1/10 flex border-2 bg-red-100 border-red-100 hover:border-main-color hover:border-2 rounded-sm " key={index}>
                            <div
                                    className='w-8/10 h-full text-black flex flex-col justify-center items-center'
                                    onMouseEnter={() => handleMouseEnter(member)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {member}
                                    {/* {showTooltip && (
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-center text-sm rounded-lg">
                                            {memberInfo?.name}
                                        </div>
                                    )} */}
                                </div>
                                <button
                                    type='button'
                                    onClick={() => (releaseMember(member))}
                                    className='w-2/10 h-full text-base border-main-color bg-main-color hover:ring hover:ring-red-100 active:ring-0 outline-none active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2'
                                >
                                    방출
                                </button>
                            </div>
                        ))}
                        {applyerList?.map((applyer, index) => (
                            <div className="w-full h-1/10 flex border-2 border-red-100 hover:border-main-color hover:border-2 rounded-sm " key={index}>
                                <div className='w-full h-full flex'>
                                    <div
                                        className='w-8/10 h-full text-black flex flex-col justify-center items-center'
                                        onMouseEnter={() => handleMouseEnter(applyer)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {applyerNameList[index]}
                                        {/* {showTooltip && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-center text-sm rounded-lg">
                                                {memberInfo?.name}
                                            </div>
                                        )} */}
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => handleSelectedApplyer(applyer)}
                                        className='w-2/10 h-full text-base border-main-color bg-main-color text-center'
                                    >
                                        accept
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>


            </form>
        </div>
    )
}

export default AcceptMemberModal;
