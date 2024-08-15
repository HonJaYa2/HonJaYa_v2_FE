'use client'; // 클라이언트 전용 컴포넌트임을 명시

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatMessage from '@/app/_components/chat/chatMessage';
import ChatInput from '@/app/_components/chat/chatInput';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'next/navigation';

const socket = io('http://localhost:3000');

const ChatPage = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [cookies] = useCookies(['user']);
    const userId = cookies.user?.id || 'default-user-id';
    const userProfile = cookies.user?.profileImage || 'profile-placeholder.jpg';

    const searchParams = useSearchParams();
    const roomId = searchParams.get('roomId'); // URL에서 roomId를 가져옵니다.

    useEffect(() => {
        if (!roomId) return;

        socket.emit('joinRoom', roomId);

        socket.on('receiveMessage', (data: any) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [roomId]);

    const handleSendMessage = (message: string) => {
        const newMessage = {
            roomId,
            senderId: userId,
            senderProfile: userProfile,
            message,
            timestamp: new Date().toISOString(),
        };

        socket.emit('sendMessage', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        message={msg.message}
                        sender={msg.senderId}
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
