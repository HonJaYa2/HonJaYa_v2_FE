// 'use client'
// import { createChatRoom } from "@/app/api/chatApi"
// import React, { useState } from "react";
// import Image from "next/image";

// type Props = {
//     setOpenGroupChatCreateModal: () => void;
//     fetchChatRooms: () => void;
// }

// const GroupChatCreateModal = ({ setOpenGroupChatCreateModal, fetchChatRooms }: Props) => {
//     const [chatRoomTitle, setChatRoomTitle] = useState("");

//     const handleSubmit = (event: React.FormEvent) => {
//         event.preventDefault();
//         try {
//             const newChatRoom = { chatName: chatRoomTitle };
//             createChatRoom(newChatRoom).then(() => {
//                 fetchChatRooms(); // 새로운 채팅방 추가 후 목록 새로고침
//                 setOpenGroupChatCreateModal(); // 모달 창 닫기
//             });
//         } catch (error) {
//             console.error('Error creating chat room:', error);
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
//             <div className="bg-white p-6 shadow-lg z-60 border-main-color border-4 rounded-lg relative">
//                 <button
//                     type="button"
//                     onClick={setOpenGroupChatCreateModal}
//                     className="absolute top-2 right-2 flex items-center justify-center"
//                 >
//                     <Image 
//                         src={'https://www.svgrepo.com/show/499053/cancel.svg'} 
//                         width={24} 
//                         height={24} 
//                         alt="cancel" 
//                     />
//                 </button>
//                 <h2 className="text-center text-2xl mb-4 font-jua">채팅방 생성</h2>
                
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         placeholder="채팅방 제목"
//                         value={chatRoomTitle}
//                         onChange={(e) => setChatRoomTitle(e.target.value)}
//                         className="w-full p-2 mb-4 border-b focus:border-red-300 focus:outline-none"
//                         required
//                     />
//                     <button
//                         type="submit"
//                         className="w-full p-2 bg-red-300 text-white rounded hover:bg-red-400"
//                     >
//                         생성
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default GroupChatCreateModal;
