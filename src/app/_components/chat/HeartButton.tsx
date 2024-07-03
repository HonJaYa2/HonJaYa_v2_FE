"use client";
import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

interface HeartButtonProps {
    isOwnMessage: boolean;
    onLike: () => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ isOwnMessage, onLike }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onLike}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`absolute ${isOwnMessage ? 'left-0' : 'right-0 mr-2'} mt-[-20px]`}
        >
            <FaHeart className={`${isHovered ? 'text-red-500' : 'text-gray-500'}`} />
        </button>
    );
};

export default HeartButton;
