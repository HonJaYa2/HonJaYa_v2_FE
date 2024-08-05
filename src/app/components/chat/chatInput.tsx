import React, { useState } from 'react';
import EmojiPicker from './emojipicker';
import ScheduleModal from '@/app/(route)/modal/@modal/chat/ScheduleModal';
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';
import { RootState } from '@/state/reducers/rootReducer';
interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const router = useRouter()
    const isTeam = useSelector((state: RootState) => state.modeCheck.isTeam)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
            setShowEmojiPicker(false);
        }
    };

    const handleSelectEmoji = (emoji: string) => {
        setMessage((prev) => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleScheduleSave = (date: string, time: string, title: string) => {
        const calendarIcon = "📅";
        const formattedMessage = `일정이 공유되었어요.\n----------\n${calendarIcon} ${date} ${time}\n제목: ${title}\n----------`;
        onSendMessage(formattedMessage);
        setShowScheduleModal(false);
    };

    // 채팅방 나가기
    const handleExit = () => {
        router.push('/wait');
    };


    return (
        <div className="relative">
            {showEmojiPicker && (
                <div className="absolute bottom-16 left-0">
                    <EmojiPicker onSelectEmoji={handleSelectEmoji} />
                </div>
            )}
            {showScheduleModal && (
                <ScheduleModal onClose={() => setShowScheduleModal(false)} onSave={handleScheduleSave} />
            )}
            <form onSubmit={handleSubmit} className="flex p-2 border-t border-gray-300">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="mr-2 text-2xl"
                >
                    😀
                </button>
                <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="mr-2 text-2xl"
                >
                    📅
                </button>
                <button
                    type="button"
                    onClick={handleExit}
                    className="mr-2 px-2 bg-red-300 text-white rounded-lg"
                >
                    나가기
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-lg"
                    placeholder="메시지를 입력하세요..."
                />
                <button type="submit" className="ml-2 px-4 py-2 bg-red-300 text-white rounded-lg">
                    전송
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
