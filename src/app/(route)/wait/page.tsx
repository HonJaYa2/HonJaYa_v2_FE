'use client'

import MatchingButton from "@/app/_components/buttons/MatchingButton";
import FilterModal from "@/app/_components/common/FilterModal";
import Navigationbar from "@/app/_components/common/Navigationbar";
import ToggleSwitch from "@/app/_components/buttons/ToggleSwitch";
import Image from "next/image";
import TeamChatButtons from "@/app/_components/buttons/TeamChatButtons";
import { useDispatch, useSelector } from "react-redux";
import { approve } from "@/state/actions";
import { RootState } from "@/state/reducers/rootReducer";
import { verifyUser, getUserId } from "@/app/utils/verifyUser";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getData } from "@/app/api/api";
import GroupChatContainer from "@/app/_components/wait/team/GroupChatContainer";
import SingleChatContainer from "@/app/_components/wait/single/SingleChatContainer";
import MatchedUserModal from "@/app/_components/wait/MatchedUserModal";

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
    const [groupObjects, setGroupObjects] = useState<any[]>([]);
    const [partnerObjects, setPartnerObjects] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [objectsPerPage, setObjectsPerPage] = useState<number>(8);
    const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
    const [openTeamCreateModal, setOpenTeamCreateModal] = useState<boolean>(false);
    const [openTeamJoinModal, setOpenTeamJoinModal] = useState<boolean>(false);
    const [openGroupChatCreateModal, setOpenGroupChatCreateModal] = useState<boolean>(false);
    const [openAcceptMemberModal, setOpenAcceptMemberModal] = useState<boolean>(false);
    const [openTeamInfoModal, setOpenTeamInfoModal] = useState<boolean>(false);
    const [onGroup, setOnGroup] = useState<boolean>(false);
    const [groupChatServerId, setGroupChatServerId] = useState<string>("");
    const [isLeader, setIsLeader] = useState<boolean>(false);
    const [idealData, setIdealData] = useState<idealType>();

    const dispatch = useDispatch();
    const isTeam = useSelector((state: RootState) => state.modeCheck.isTeam);
    const isMatchingModalOpened = useSelector((state: RootState) => state.matchingStatusModal.isOpened);
    const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined);
    const matchingModalOpen = useSelector((state: RootState) => state.matchingStatusModal.isOpened);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = () => {
            const isVerified = verifyUser();
            console.log('Is user verified?', isVerified);
            if (!isVerified) {
                console.log('User is not logged in. Redirecting to login page.');
                router.push("/");
            } else {
                if (!(isLogined === "Y")) {
                    dispatch(approve());
                    console.log('User is approved and logged in.');
                } else {
                    console.log('User is already logged in.');
                }
            }
        };

        checkLoginStatus();

        const updateObjectsPerPage = () => {
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

        updateObjectsPerPage();
        window.addEventListener("resize", updateObjectsPerPage);
        return () => window.removeEventListener("resize", updateObjectsPerPage);
    }, [isLogined, dispatch, router, isTeam]);

    useEffect(() => {
        const getGroupChatServerUser = async () => {
            try {
                const userId = getUserId();
                if (!userId) {
                    throw new Error('User ID is null');
                }
                const response = await getData(`/user/${userId}`, "groupChat");
                setGroupChatServerId(response.id);
                localStorage.setItem('mongoId', response.id);
                setIsLeader(response.leader);
                setOnGroup(response.party);
            } catch (error) {
                console.log(error);
            }
        }
        getGroupChatServerUser();
    }, [openTeamCreateModal, openTeamJoinModal]);

    useEffect(() => {
        const getPartnerObjects = async () => {
            try {
                const userId = getUserId();
                if (!userId) {
                    throw new Error('User ID is null');
                }
                const response = await getData(`/chat/rooms/${userId}`, "honjaya");
                console.log(response);
                const objects = response;
                setPartnerObjects(objects);
            } catch (e) {
                console.log(e);
            }
        };

        const getGroupObjects = async () => {
            try {
                const response: any = await getData(`/chat_room`, "groupChat");
                console.log(response);
                const objects = response;
                setGroupObjects(objects.filter((object: any) => {
                    return object.gender !== (localStorage.getItem("userGender") === "남성" ? "MALE" : "FEMALE");
                }));
            } catch (e) {
                console.log(e);
            }
        };

        if (isTeam) {
            getGroupObjects();
        } else {
            getPartnerObjects();
        }
    }, [isMatchingModalOpened, isTeam]);

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
        setOpenFilterModal(!openFilterModal);
    };

    // 임시 채팅 버튼 핸들러
    const handleChatButtonClick = () => {
        // 채팅 페이지로 이동
        router.push('/chat');
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-between bg-white">
            <Navigationbar />
            {matchingModalOpen && <MatchedUserModal idealData={idealData as idealType} />}
            <div style={{ height: "90%" }} className="w-full overflow-y-auto bg-balloons">
                <div className="w-full h-auto min-h-4"></div>
                <div className="w-full h-1/10 text-3xl font-jua flex items-end justify-around box-border pt-2 px-10">
                    {isTeam ? <div className="flex items-end w-3/10 h-full text-4xl">채팅방</div> : <div className="flex w-3/10 items-end h-full text-4xl">매칭된 상대</div>}
                    <div className="w-3/10 h-full flex justify-center items-center">
                        <Image src="https://www.svgrepo.com/show/436843/person-fill.svg" width={20} height={20} alt="single" />
                        <ToggleSwitch />
                        <Image src="https://www.svgrepo.com/show/436838/person-3-fill.svg" width={20} height={20} alt="team" />
                    </div>
                    <div className="w-3/10 h-full flex justify-end">
                        {!isTeam ? (
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
                                <Image
                                    src="https://www.svgrepo.com/show/449376/handshake.svg"
                                    alt="onGroup"
                                    className="w-8/10 h-full"
                                />
                                {onGroup ?
                                    <div className="w-full flex flex-col items-center justify-center">
                                        <div className="w-full h-1/2 bg-green-600 border-2 border-black shadow-neutral-400 rounded-full"></div>
                                    </div> :
                                    <div className="w-full flex flex-col items-center justify-center">
                                        <div className="w-full h-1/2 bg-gray-400 border-2 border-black shadow-neutral-400 rounded-full">
                                        </div>
                                    </div>}
                            </div>
                        )}
                    </div>
                </div>
                {isTeam ? onGroup ? (
                    <GroupChatContainer
                        objects={groupObjects}
                        prevSlide={prevSlide}
                        nextSlide={nextSlide}
                        currentPage={currentPage}
                        objectsPerPage={objectsPerPage}
                    />
                ) : <div className="w-full h-3/10"></div> : (
                    <SingleChatContainer
                        objects={partnerObjects}
                        prevSlide={prevSlide}
                        nextSlide={nextSlide}
                        currentPage={currentPage}
                        objectsPerPage={objectsPerPage}
                    />
                )}
                <div className="w-full h-2/10">
                    {isTeam ?
                        <TeamChatButtons
                            openTeamCreateModal={openTeamCreateModal}
                            setOpenTeamCreateModal={() => setOpenTeamCreateModal(prev => !prev)}
                            openTeamJoinModal={openTeamJoinModal}
                            setOpenTeamJoinModal={() => setOpenTeamJoinModal(prev => !prev)}
                            openGroupChatCreateModal={openGroupChatCreateModal}
                            setOpenGroupChatCreateModal={() => setOpenGroupChatCreateModal(prev => !prev)}
                            openAcceptMemberModal={openAcceptMemberModal}
                            setOpenAcceptMemberModal={() => setOpenAcceptMemberModal(prev => !prev)}
                            openTeamInfoModal={openTeamInfoModal}
                            setOpenTeamInfoModal={() => setOpenTeamInfoModal(prev => !prev)}
                        /> : <MatchingButton />}
                </div>
            </div>
            <button
                onClick={handleChatButtonClick}
                className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full"
            >
                채팅 시작
            </button>
        </div>
    );
};

export default WaitingRoom;
