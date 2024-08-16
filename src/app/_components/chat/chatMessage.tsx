"use client";
import React, { useEffect, useState } from 'react';
import Avatar from './avatar';
import HeartButton from './HeartButton';
import { FaHeart } from 'react-icons/fa';

interface ChatMessageProps {
    message: string;
    isOwnMessage: boolean;
    timestamp: string;
    senderId: string;
    senderName: string;
    senderProfile: string;
    showSenderName: boolean; // 추가된 속성
    isLast: boolean;
    onDelete: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, senderId, senderName, senderProfile, isOwnMessage, timestamp, showSenderName, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleLikeClick = () => {
        setIsLiked(!isLiked);
    };

    return (
        <div
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!isOwnMessage && <Avatar senderProfile={senderProfile}/>}
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div className={`relative p-2 m-2 ${isOwnMessage ? 'rounded-bl-xl rounded-tl-xl rounded-br-xl' : 'rounded-tr-xl rounded-br-xl rounded-bl-xl'} ${isOwnMessage ? 'bg-green-400 text-black' : 'bg-gray-200'}`} style={{ whiteSpace: 'pre-wrap' }}>
                    {message}
                    {isHovered && (
                        <>
                            <button onClick={onDelete} className="absolute top-0 right-0">🗑️</button>
                            <HeartButton isOwnMessage={isOwnMessage} onLike={handleLikeClick} />
                        </>
                    )}
                </div>

                {showSenderName && (
                    <>
                        <span className="text-xs text-gray-500"><b>{senderName}</b></span>
                        <span className="text-xs text-gray-500 mt-1">{new Date(timestamp).toLocaleTimeString()}</span>
                    </>
                )}
                {isLiked && (
                    <FaHeart className="text-red-500 mt-1" />
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
