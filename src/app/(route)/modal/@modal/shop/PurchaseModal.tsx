import React from 'react';

interface Item {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface PurchaseModalProps {
    item: Item;
    userZem: number;
    onClose: () => void;
    onPurchase: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ item, userZem, onClose, onPurchase }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">아이템 구매</h2>
            <p>아이템: {item.name}</p>
            <p>가격: {item.price} ZEM</p>
            <p>보유 ZEM: {userZem}</p>
            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                onClick={onPurchase}
                disabled={userZem < item.price}
            >
                구매하기
            </button>
            {userZem < item.price && (
                <p className="text-red-500 mt-2">보유한 ZEM이 부족합니다.</p>
            )}
            <button
                className="bg-gray-500 text-white px-4 py-2 mt-4 rounded"
                onClick={onClose}
            >
                취소
            </button>
        </div>
    );
};

export default PurchaseModal;
