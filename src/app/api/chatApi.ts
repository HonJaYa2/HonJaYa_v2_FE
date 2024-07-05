// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

//단체 채팅방 목록 조회
// export const fetchChatRooms = async () => {
//     try {
//         const response = await fetch(`http://localhost:8081/chat_room`);
//         if (!response.ok) {
//             throw new Error('Error fetching chat rooms');
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching chat rooms:', error);
//         throw error;
//     }
// };

// // 채팅방 생성 
// export const createChatRoom = (chatRoom: {chatName: string }) => {
//             fetch(`http://localhost:8081/chat_room`, {
//             method: "POST",
//             body: JSON.stringify(chatRoom),
//             headers: {
//                 "Content-Type": "application/json; charset=utf-8"
//             }
//         });
// };
