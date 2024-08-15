'use client';

import { setMatchingModalOpen } from "@/state/actions";
import { useDispatch } from "react-redux";
import { filterDataType } from "@/app/(route)/wait/page";
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface MatchingButtonProps {
    filterData?: filterDataType;
}

const MatchingButton = ({ filterData }: MatchingButtonProps) => { 
    const dispatch = useDispatch();
    const [cookies] = useCookies(['user']);
    console.log("Received filterData:", filterData);

    const setWaitingState = async (isWaiting: boolean) => {
        try {
            await axios.post('/api/setWaitingState', { 
                kakaoId: cookies.user.id, 
                isWaiting 
            });
        } catch (error) {
            console.error('Failed to set waiting state:', error);
        }
    };

    const handleClick = async () => {
        if (filterData) {
            await setWaitingState(true); // 매칭 대기 상태로 전환
            dispatch(setMatchingModalOpen());
        } else {
            alert("필터를 먼저 설정하세요.");
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <button
                className="w-2/10 h-1/2 font-jua text-2xl text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-md hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl"
                onClick={handleClick}
            >
                매칭 시작
            </button>
        </div>
    );
};

export default MatchingButton;
