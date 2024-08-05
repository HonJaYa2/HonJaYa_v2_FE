'use client'

import MatchingButton from "@/app/components/buttons/MatchingButton";
import FilterModal from "@/app/components/common/FilterModal";
import Navigationbar from "@/app/components/common/Navigationbar";

import ToggleSwitch from "@/app/components/buttons/ToggleSwitch";
import Image from "next/image";
import TeamChatButtons from "@/app/components/buttons/TeamChatButtons";
//이미지 배열((매칭됨 && 시간 유효한 유저)들의 이미지 정보 배열)은 추후 fetching
//얘를 
import { useDispatch, useSelector } from "react-redux";
import { approve, exitGroup, joinGroup } from "@/state/actions";
import { RootState } from "@/state/reducers/rootReducer";
import { verifyUser } from "@/app/utils/verifyUser";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getData } from "@/app/api/api";
import GroupChatContainer from "@/app/components/wait/team/GroupChatContainer";
import SingleChatContainer from "@/app/components/wait/single/SingleChatContainer";
import MatchedUserModal from "@/app/components/wait/MatchedUserModal";

export type idealType = {
    maxAge: number,
    minAge: number,
    maxHeight: number,
    minHeight: number,
    maxWeight: number,
    minWeight: number,
    mbti: string,
    religion: string,
    drinkAmount: string,
    smoke: boolean
}

const WaitingRoom = () => {
    const [groupObjects, setGroupObjects] = useState("");
    const [partnerObjects, setPartnerObjects] = useState("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [objectsPerPage, setObjectsPerPage] = useState<number>(8);
    const [openFilterModal, setOpenFilterModal] = useState<boolean>(false)
    const [openTeamCreateModal, setOpenTeamCreateModal] = useState<boolean>(false)
    const [openTeamJoinModal, setOpenTeamJoinModal] = useState<boolean>(false)
    const [openGroupChatCreateModal, setOpenGroupChatCreateModal] = useState<boolean>(false)
    const [openAcceptMemberModal, setOpenAcceptMemberModal] = useState<boolean>(false)
    const [openTeamInfoModal, setOpenTeamInfoModal] = useState<boolean>(false)
    const [onGroup, setOnGroup] = useState<boolean>(false);
    const [groupChatServerId, setGroupChatServerId] = useState<string>("");
    const [isLeader, setIsLeader] = useState<boolean>(false);
    const [idealData, setIdealData] = useState<idealType>();

    const dispatch = useDispatch();
    const isTeam = useSelector((state: RootState) => state.modeCheck.isTeam)
    const isMatchingModalOpened = useSelector((state: RootState) => state.matchingStatusModal.isOpened)
    const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined)
    const matchingModalOpen = useSelector((state: RootState) => state.matchingStatusModal.isOpened)

    // const onGroup = useSelector((state: RootState) => state.onGroup.onGroup)
    const router = useRouter();

    useEffect(() => {
        if (!(isLogined === "Y")) {
            if (verifyUser()) {
                dispatch(approve());
            } else {
                router.push("/")
            }
        }
        if (typeof window !== 'undefined') {
            //창 크기에 따라 동적으로 렌더링할 이미지 수 변경(반응형으로 구현)  
            //BlockPerPage로 바꿔서 팀 대기창에서도 재사용 가능하게 바꾸자. 
            //1)1대1 대기 페이지=>블록에 이미지 넣기(이미지 정보 fetch)
            //2)다대다 페이지 => 지금 속한 팀 정보 fetch해서 데이터 렌더링 (팀 채팅은 24시간 연장 x or 팀 대기 창에서 팀 선택하면 팀 별 대기창을 따로?(1대1 대기 페이지 처럼))
            const updateobjectsPerPage = () => {
                if (!isTeam) {
                    setObjectsPerPage(1);
                } else if (window.matchMedia("(min-width: 1024px)").matches) {
                    setObjectsPerPage(8);
                } else if (window.matchMedia("(min-width: 370px)").matches) {
                    setObjectsPerPage(6);
                } else {
                    setObjectsPerPage(4);
                }
            };

            updateobjectsPerPage();
            window.addEventListener("resize", updateobjectsPerPage);
            return () => window.removeEventListener("resize", updateobjectsPerPage);
        }
    }, [isTeam]);

    useEffect(() => {
        const getGroupChatServerUser = async () => {
            try {
                const response = await getData(`/user/${localStorage.getItem('user_id')}`, "groupChat")
                setGroupChatServerId(response.id)
                localStorage.setItem('mongoId', response.id);
                setIsLeader(response.leader);
                setOnGroup(response.party);

                // if(response.isParty) {
                //     dispatch(joinGroup())
                // } else {
                //     dispatch(exitGroup())
                // }
            } catch (error) {
                console.log(error);
            }
        }
        getGroupChatServerUser();
    }, [openTeamCreateModal, openTeamJoinModal]);

    useEffect(() => {
        const getPartnerObjects = async () => {
            try {
                const response = await getData(`/chat/rooms/${localStorage.getItem("user_id")}`, "honjaya");
                console.log(response);
                const objects = response;
                setPartnerObjects(() => (objects))
            } catch (e) {
                console.log(e);
            }
        }

        const getGroupObjects = async () => {
            try {
                const response:any = await getData(`/chat_room`, "groupChat");
                console.log(response);
                const objects = response;
                setGroupObjects(() => (objects.filter((object: any) => {
                    if (object.gender !== (localStorage.getItem("userGender") === "남성"? "MALE" : "FEMALE")) {
                        return true;
                    }
                })))
            } catch (e) {
                console.log(e);
            }
        }

        if (isTeam) {
            getGroupObjects();
        } else {
            getPartnerObjects();
        }
    }, [isMatchingModalOpened, isTeam])

    // useEffect(() => {
    //     const getObjects = async () => {
    //         try {
    //             const response = await getData("/group/list", "groupChat")
    //             console.log(response);
    //             const object=response;
    //             setObjects(() => (object));
    //         } catch (e) {

    //         }
    //     }
    // })
    // useEffect(() => {
    //     if (prevState.current === true && isMatchingModalOpened === false) {
    //         console.log("Matching success and re-rendering proceed")
    //     }
    //     prevState.current = isMatchingModalOpened;
    // }, [isMatchingModalOpened])


    const nextSlide = () => {
        if ((currentPage + 1) * objectsPerPage < (isTeam ? groupObjects.length : partnerObjects.length)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevSlide = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const setFilterOpen = () => {
        const newState = !openFilterModal;
        setOpenFilterModal(newState);
    }

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-between bg-white">
            <Navigationbar />
            {matchingModalOpen && <MatchedUserModal idealData={idealData as idealType}/>}
            <div style={{ height: "90%" }} className="w-full overflow-y-auto bg-balloons">
                <div className="w-full h-auto min-h-4"></div>
                <div className="w-full h-1/10 text-3xl font-jua flex items-end justify-around box-border pt-2 px-10">
                    {isTeam ? <div className="flex items-end w-3/10 h-full text-4xl">채팅방</div> : <div className="flex w-3/10 items-end h-full text-4xl">매칭된 상대</div>}
                    <div className="w-3/10 h-full flex justify-center items-center">
                        <img src="https://www.svgrepo.com/show/436843/person-fill.svg" width={20} height={20} alt="single" />
                        <ToggleSwitch />
                        <img src="https://www.svgrepo.com/show/436838/person-3-fill.svg" width={20} height={20} alt="team" />
                    </div>
                    <div className="w-3/10 h-full flex justify-end">
                        {
                            !isTeam ? (
                                <>
                                    <button
                                        onClick={setFilterOpen}
                                        className={`${openFilterModal ? 'hidden' : ''} bg-filter w-12 h-full rounded-md bg-cover bg-center`}>
                                    </button>
                                    {openFilterModal && (
                                        <FilterModal setIdealData={setIdealData} setFilterOpen={setFilterOpen} />
                                    )}
                                </>
                            ) : (
                                <div className="text-sm flex mr-14">
                                    <img
                                        src="https://www.svgrepo.com/show/449376/handshake.svg"
                                        alt="onGroup"
                                        className="w-8/10 h-full"
                                    />
                                    {onGroup ?
                                        <div className="w-full flex flex-col items-center justify-center ">
                                            <div className="w-full h-1/2 bg-green-600 border-2 border-black shadow-neutral-400 rounded-full"></div>
                                        </div> :
                                        <div className="w-full flex flex-col items-center justify-center ">
                                            <div className="w-full h-1/2 bg-gray-400 border-2 border-black shadow-neutral-400 rounded-full">
                                            </div>
                                        </div>}
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    isTeam ? onGroup ?
                        <GroupChatContainer
                            objects={groupObjects}
                            prevSlide={prevSlide}
                            nextSlide={nextSlide}
                            currentPage={currentPage}
                            objectsPerPage={objectsPerPage}
                        /> : <div className="w-full h-3/10"></div> :
                        <SingleChatContainer
                            objects={partnerObjects}
                            prevSlide={prevSlide}
                            nextSlide={nextSlide}
                            currentPage={currentPage}
                            objectsPerPage={objectsPerPage}
                        />
                }

                <div className="w-full h-2/10">
                    {isTeam ?
                        <TeamChatButtons
                            openTeamCreateModal={openTeamCreateModal}
                            setOpenTeamCreateModal={() => { setOpenTeamCreateModal((prev) => (!prev)) }}
                            openTeamJoinModal={openTeamJoinModal}
                            setOpenTeamJoinModal={() => { setOpenTeamJoinModal((prev) => (!prev)) }}
                            openGroupChatCreateModal={openGroupChatCreateModal}
                            setOpenGroupChatCreateModal={() => { setOpenGroupChatCreateModal((prev) => (!prev)) }}
                            openAcceptMemberModal={openAcceptMemberModal}
                            setOpenAcceptMemberModal={() => { setOpenAcceptMemberModal((prev) => (!prev)) }}
                            openTeamInfoModal={openTeamInfoModal}
                            setOpenTeamInfoModal={() => { setOpenTeamInfoModal((prev) => (!prev)) }}
                        /> : <MatchingButton />}
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom;


