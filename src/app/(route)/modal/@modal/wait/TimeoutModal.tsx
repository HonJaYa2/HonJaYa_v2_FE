import React from 'react';

interface TimeoutModalProps {
    onClose: () => void;
    onConfirm: () => void;
    itemCount: number;
}

const TimeoutModal: React.FC<TimeoutModalProps> = ({ onClose, onConfirm, itemCount }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">채팅 시간 만료</h2>
                <p className="mb-4">아이템을 사용하여 해당 유저를 다시 만나시겠습니까?</p>
                <p className="mb-4">보유한 아이템 수: {itemCount}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        아니오
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        예
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeoutModal;
