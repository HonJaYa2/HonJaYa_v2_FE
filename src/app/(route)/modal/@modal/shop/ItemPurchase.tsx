'use client';

import { useState } from 'react';
import Image from 'next/image';
import PurchaseModal from './PurchaseModal';

interface Item {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface ItemPurchaseProps {
    userZem: number;
}

const items: Item[] = [
    { id: 1, name: '채팅 시간 추가', price: 200, image: '/gameItems/ChatTimeUP.png' },
    { id: 2, name: '채팅방 추가', price: 500, image: '/gameItems/ChatPlus.png' },
    { id: 3, name: '채팅 다시 요청하기', price: 3000, image: '/gameItems/ChatRequest.png' },
    { id: 4, name: '슈퍼하트', price: 1000, image: '/gameItems/SuperHeart.png' },
];

const ItemPurchase: React.FC<ItemPurchaseProps> = ({ userZem }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center justify-center bg-white p-4">
            <div>
                <h1 className="text-4xl font-bold text-center mb-8">게임 아이템 상점</h1>
                <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center border-2 border-gray-100 p-4 bg-gray-100"
                            style={{ height: '350px', width: '180px' }}
                        >
                            <div className="flex-grow flex items-center justify-center w-full">
                                <div className="bg-white border-2 border-gray-100 flex items-center justify-center" style={{ width: '150px', height: '150px' }}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        className="object-contain"
                                        width={144}
                                        height={144}
                                    />
                                </div>
                            </div>
                            <div className="mt-auto text-center">
                                <h2 className="font-bold mt-4">{item.name}</h2>
                                <div className="flex items-center justify-center mt-2">
                                    <Image src="/ZemImages/zem1.png" alt="ZEM" width={24} height={24} />
                                    <p className="text-red-400 font-bold text-lg ml-2">{item.price}</p>
                                </div>
                                <button
                                    className="font-bold bg-white px-4 py-2 mt-2"
                                    onClick={() => handleItemClick(item)}
                                >
                                    구매하기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">
                            &times;
                        </button>
                        <PurchaseModal item={selectedItem} onClose={closeModal} userZem={userZem} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemPurchase;
