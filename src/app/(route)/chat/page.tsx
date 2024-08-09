"use client";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatMessage from '@/app/_components/chat/chatMessage';
import ChatInput from '@/app/_components/chat/chatInput';

const socket = io('http://localhost:3000'); 

const ChatPage = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [userId] = useState<string>('user-id-placeholder');
    const [userProfile] = useState<string>('profile-placeholder.jpg');

    useEffect(() => {
        console.log('Registering socket event listener');

        // 이전에 등록된 리스너 제거
        socket.off('receive_message');

        // 새로운 리스너 등록
        socket.on('receive_message', (data: any) => {
            console.log('Received message:', data);
            
            // 메시지가 현재 사용자가 보낸 것이 아닌 경우에만 상태 업데이트
            if (data.senderId !== userId) {
                setMessages((prevMessages) => {
                    console.log('Updating messages state:', [...prevMessages, data]);
                    return [...prevMessages, data];
                });
            }
        });

        return () => {
            console.log('Cleaning up event listeners');
            socket.off('receive_message');
        };
    }, []); // 의존성 배열을 빈 배열로 유지하여 초기 마운트 시에만 실행되도록 합니다.

    const handleSendMessage = (message: string) => {
        const timestamp = new Date().toISOString();
        const newMessage = {
            message,
            sender: 'You',
            senderId: userId,
            senderProfile: userProfile,
            timestamp,
            isOwnMessage: true,
        };

        console.log('Sending message:', newMessage);

        // 메시지를 서버에 전송하고 상태에 추가합니다.
        socket.emit('send_message', newMessage);
        setMessages((prevMessages) => {
            console.log('Updating messages state after send:', [...prevMessages, newMessage]);
            return [...prevMessages, newMessage];
        });
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg.message}
                        sender={msg.sender}
                        senderId={msg.senderId}
                        senderProfile={msg.senderProfile}
                        timestamp={msg.timestamp}
                        isOwnMessage={msg.senderId === userId}
                        isLast={index === messages.length - 1}
                        onDelete={() => console.log('삭제 기능 아직 구현되지 않았습니다.')}
                    />
                ))}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatPage;
