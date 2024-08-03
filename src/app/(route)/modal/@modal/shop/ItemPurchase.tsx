'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface Item {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface ItemPurchaseProps {
    userZem: number;
    onZemUpdate: (newZem: number) => void;
    inventory: Record<number, number>;
    onInventoryUpdate: (itemId: number, newQuantity: number) => void;
}

const items: Item[] = [
    { id: 1, name: '채팅 시간 추가', price: 200, image: '/gameItems/ChatTimeUP.png' },
    { id: 2, name: '매칭 1회권 추가', price: 500, image: '/gameItems/ChatPlus.png' },
    { id: 3, name: '채팅 다시 요청하기', price: 3000, image: '/gameItems/ChatRequest.png' },
    { id: 4, name: '슈퍼하트', price: 1000, image: '/gameItems/SuperHeart.png' },
];

const ItemPurchase: React.FC<ItemPurchaseProps> = ({ userZem, onZemUpdate, inventory, onInventoryUpdate }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cookies] = useCookies(['token', 'user']);

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

    const handlePurchase = async () => {
        if (!selectedItem) return;
    
        const kakaoId = cookies.user.id; // userId 대신 kakaoId 사용
    
        try {
            const response = await axios.post('http://localhost:3000/api/buyItem', {
                kakaoId, // userId 대신 kakaoId 사용
                itemId: selectedItem.id,
            });
    
            if (response.data.success) {
                alert('아이템 구매가 완료되었습니다!');
                const newZem = userZem - selectedItem.price;
                onZemUpdate(newZem);
    
                const newQuantity = (inventory[selectedItem.id] || 0) + 1;
                onInventoryUpdate(selectedItem.id, newQuantity);
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Error purchasing item:', error);
            alert('아이템 구매에 실패했습니다.');
        }
    
        closeModal();
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
                                        className={`object-contain ${getImageSizeClasses(item.id)}`}
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
                                <p>보유 수량: {inventory[item.id] || 0}</p>
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
                        <div className="max-h-full">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
                                <div className="flex justify-center mb-4">
                                    <Image
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        className="object-contain"
                                        width={144}
                                        height={144}
                                    />
                                </div>
                                <p className="text-lg">가격: {selectedItem.price} ZEM</p>
                                <button
                                    className="bg-blue-500 text-white font-bold py-2 px-4 mt-4 rounded"
                                    onClick={handlePurchase}
                                >
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemPurchase;