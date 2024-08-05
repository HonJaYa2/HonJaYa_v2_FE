'use client'

import { RootState } from "@/state/reducers/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { setTeamMode, setSingleMode } from "@/state/actions";

const ToggleSwitch = ({}) => {
    const isTeam = useSelector((state: RootState) => state.modeCheck.isTeam)
    const dispatch = useDispatch();

    const handleSwitch = () => {
        if(isTeam) {
            dispatch(setSingleMode())
        } else dispatch(setTeamMode())
    }

    return (
        <div
            className={`mx-2 relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out cursor-pointer ${isTeam ? 'bg-main-color' : 'bg-main-color'}`}
            onClick={handleSwitch}
        >
            <span className={`transform transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full ${isTeam ? 'translate-x-6' : 'translate-x-1'}`} />
        </div>
    );
};

export default ToggleSwitch;
