// "use client"

// import ChatWindow from '@/app/_components/chat/chatWindow';
// import { FC, useEffect } from 'react';

// import { useSelector } from "react-redux";
// import { RootState } from "@/state/reducers/rootReducer";

// import { useRouter } from 'next/router';  // next/router를 가져옵니다.


// const router = useRouter();
// const { roomId } = router.query; // router.query에서 roomId를 가져옵니다.

// interface ChatPageProps {
//     params: string
// }
// const ChatPage: FC<ChatPageProps> = ({ params }) => {
//     const isTeam = useSelector((state: RootState) => state.modeCheck.isTeam)

//     const roomId  = params;
//     return (
//         <div className="flex flex-col h-screen">
//             <ChatWindow roomId={roomId as string} isTeam={isTeam} />
//         </div>
//     );
// };

// export default ChatPage;

"use client";

import ChatWindow from '@/app/_components/chat/chatWindow';
import { FC } from 'react';
import { usePathname } from 'next/navigation'; 
import { useSelector } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";

const ChatPage: FC = () => {
    const isTeam = useSelector((state: RootState) => state.modeCheck.isTeam);
  
    
    const pathname = usePathname(); // 현재 경로를 가져옵니다.
    const roomId = pathname.split('/').pop();
    
    if (!roomId) {
        return <div>Loading...</div>; // roomId가 아직 로드되지 않은 경우 로딩 상태를 표시합니다.
    }

    return (
        <div className="flex flex-col h-screen">
            <ChatWindow roomId={roomId} isGroupChat={isTeam} /> {/* roomId를 string으로 강제 변환 */}
        </div>
    );
};

export default ChatPage;


