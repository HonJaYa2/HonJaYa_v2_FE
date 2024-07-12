'use client';

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
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ item, userZem, onClose }) => {
    const handlePurchase = async () => {
        if (userZem < item.price) {
            alert('ZEM이 부족합니다.');
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            const token = localStorage.getItem('access_token');

            const response = await fetch('/api/zemshop/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    itemId: item.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Purchase failed');
            }

            const data = await response.json();
            alert('아이템 구매에 성공했습니다.');
            onClose();
        } catch (error) {
            console.error('Error purchasing item:', error);
            alert('아이템 구매에 실패했습니다.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">아이템 구매</h2>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                    <div className="ml-4">
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-red-400 font-bold">{item.price} ZEM</p>
                    </div>
                </div>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={handlePurchase}
                >
                    구매하기
                </button>
            </div>
        </div>
    );
};

export default PurchaseModal;
