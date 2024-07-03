import React, { useState, useEffect } from 'react';

interface ScheduleModalProps {
    onClose: () => void;
    onSave: (date: string, time: string, title: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    useEffect(() => {
        if (title.trim() !== '') {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    }, [title]);

    const handleSave = () => {
        if (title && date && time) {
            onSave(date, time, title);
            setTitle('');
            setDate('');
            setTime('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white p-6 rounded-lg w-100">
                <h2 className="text-2xl font-bold mb-4">일정 등록</h2>
                <div className="mb-4">
                    <label className="block text-lg mb-2">일정을 입력해 주세요.</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-1 border"
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <label className="block text-lg mr-2">날짜</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-2 border rounded-lg mr-2"
                    />
                    <label className="block text-lg mr-2">시간</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="p-2 border rounded-lg"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!isButtonEnabled}
                        className={`px-4 py-2 rounded-lg ${isButtonEnabled ? 'bg-red-200 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    >
                        등록
                    </button>
                    <button onClick={onClose} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg">
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
