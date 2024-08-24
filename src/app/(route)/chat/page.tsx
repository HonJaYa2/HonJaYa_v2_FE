"use client";
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatMessage from '@/app/_components/chat/chatMessage';
import ChatInput from '@/app/_components/chat/chatInput';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const socket = io('http://localhost:3000');

interface Message {
    sender_id: string;    // 서버에서 받아오는 원본 필드
    senderId?: string;    // 클라이언트에서 변환하여 사용할 필드
    message: string;
    timestamp: string;
    isOwnMessage?: boolean; // 클라이언트에서 추가할 필드
}

const ChatPage = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [cookies] = useCookies(['user']);
    const userId = cookies.user?.id || 'default-user-id';
    const userProfile = cookies.user?.profileImage || 'profile-placeholder.jpg';
    const searchParams = useSearchParams();
    const roomId = searchParams.get('roomId');
    

    const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60);
    const [TimeoutModal, setTimeoutModal] = useState(false);

    useEffect(() => {
        if (!roomId) return;

        // 채팅방에 입장했을 때 이전 메시지들을 불러옴
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/getChatMessages/${roomId}`);
                console.log('Fetched messages:', response.data);
                console.log('dfdd', userId); // userId는 잘 받아오고있음.
        
                const messagesWithOwnership: Message[] = response.data.map((msg: Message) => {
                    const isOwnMessage = msg.sender_id == userId;
                    return {
                        ...msg,
                        senderId: msg.sender_id,
                        isOwnMessage,
                    };
                });
                
        
                setMessages(messagesWithOwnership);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };
        

        fetchMessages();


        socket.emit('joinRoom', roomId);
        
        socket.on('updateTimer', (time) => {
            setTimeRemaining(time);
        });

        socket.on('receiveMessage', (data: any) => {
            console.log('Received message:', data);
            setMessages((prevMessages) => {
                console.log('Previous messages:', prevMessages);
                console.log('Current message:', data);
                
                const isDuplicate = prevMessages.some(msg => msg.id == data.id);
                if (!isDuplicate) {
                    return [...prevMessages, { ...data, isOwnMessage: data.senderId == userId }];
                }
                return prevMessages;
            });
        });

        socket.on('timerEnded', () => {
            setTimeoutModal(true);
        });

        return () => {
            socket.off('updateTimer');
            socket.off('receiveMessage');
            socket.off('timerEnded');
        };
    }, [roomId, userId]);

    const formatTime = (seconds: number) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    const handleSendMessage = (message: string) => {
        const newMessage = {
            id: uuidv4(),
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
            <div className="text-center font-bold text-xl p-2">
                {formatTime(timeRemaining)}
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => {
                    const nextMessage = messages[index + 1];
                    const showSenderName = !nextMessage || nextMessage.senderId !== msg.senderId;
                    const isOwnMessage = msg.sender_id === userId;
                    console.log(`123:  ${userId}}, Message ID: ${msg.senderId}, isOwnMessage: ${isOwnMessage}`);
                   
                    return (
                        <ChatMessage
                            key={msg.id}
                            message={msg.message}
                            senderId={msg.senderId}
                            senderName={msg.senderName}
                            senderProfile={msg.senderProfile}
                            timestamp={msg.timestamp}
                            isOwnMessage={msg.isOwnMessage}
                            showSenderName={showSenderName}
                            onDelete={() => console.log('삭제 기능 아직 구현되지 않았습니다.')} isLast={false}                        />
                    );
                })}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatPage;
