'use client';

import { useState } from 'react';
import Image from 'next/image';
import PurchaseModal from '@/app/(route)/modal/@modal/shop/PurchaseModal';

interface Item {
    id: number;
    name: string;
    price: number;
    endpoint: string;
    image: string;
}

interface ItemPurchaseProps {
    userZem: number;
}

const items: Item[] = [
    { id: 1, name: '채팅 시간 추가', price: 200, endpoint: '/get/LongSword', image: '/gameItems/ChatTimeUP.png' },
    { id: 2, name: '채팅방 추가', price: 500, endpoint: '/get/Bow', image: '/gameItems/ChatPlus.png' },
    { id: 3, name: '채팅 다시 요청하기', price: 3000, endpoint: '/get/Hammer', image: '/gameItems/ChatRequest.png' },
    { id: 4, name: '슈퍼하트', price: 1000, endpoint: '/get/Blade', image: '/gameItems/SuperHeart.png' },
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

    const getImageSizeClasses = (id: number) => {
        switch (id) {
            case 1:
                return 'w-20 h-20'; // ID가 1일 때 크기 감소
            case 2:
                return 'w-36 h-36'; // ID가 2일 때 크기 증가
            default:
                return 'w-28 h-28'; // 기본 크기
        }
    };

    return (
        <div className="flex items-center justify-center bg-white p-4">
            <div>
                <h1 className="text-4xl font-bold text-center mb-8">게임 아이템 상점</h1>
                <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto"> {/* 가로 길이 더 줄이기, 열 수를 4개로 설정 */}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center border-2 border-gray-100 p-4 bg-gray-100" // 카드 테두리 회색, 배경 회색
                            style={{ height: '350px', width: '180px' }} // 고정된 높이와 더 좁은 너비 설정
                        >
                            <div className="flex-grow flex items-center justify-center w-full">
                                <div className="bg-white border-2 border-gray-100 flex items-center justify-center" style={{ width: '150px', height: '150px' }}> {/* 흰색 배경과 회색 테두리 추가, 고정된 크기 설정 */}
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        className={`object-contain ${getImageSizeClasses(item.id)}`}
                                        width={144} // 기본 너비
                                        height={144} // 기본 높이
                                    />
                                </div>
                            </div>
                            <div className="mt-auto text-center">
                                <h2 className="font-bold mt-4">{item.name}</h2>
                                <div className="flex items-center justify-center mt-2">
                                    <Image src="/ZemImages/zem1.png" alt="ZEM" width={24} height={24} /> {/* ZEM 이미지 추가 */}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> {/* 모달 외부 스크롤 추가 */}
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto"> {/* 모달 내부 스크롤 추가 */}
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">
                            &times;
                        </button>
                        <div className="max-h-full">
                            <PurchaseModal item={selectedItem} onClose={closeModal} userZem={userZem} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemPurchase;
