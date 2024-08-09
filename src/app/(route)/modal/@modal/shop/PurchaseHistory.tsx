'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface PurchaseHistoryItem {
    id: number;
    item_id: number;
    quantity: number;
    purchase_date: string;
}

interface ShopItem {
    id: number;
    name: string;
    image: string;
}

interface PurchaseHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ isOpen, onClose }) => {
    const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
    const [items, setItems] = useState<ShopItem[]>([]);
    const [cookies] = useCookies(['user']);

    useEffect(() => {
        if (isOpen) {
            const fetchPurchaseHistory = async () => {
                const kakaoId = cookies.user?.id || ''; // 변경된 부분
                if (!kakaoId) {
                    console.error('User ID is undefined');
                    return;
                }
                try {
                    const response = await axios.get(`/api/getPurchaseHistory/${kakaoId}`);
                    setPurchaseHistory(response.data);
                } catch (error) {
                    console.error('Error fetching purchase history:', error);
                }
            };

            const fetchItems = async () => {
                try {
                    const response = await axios.get('/api/items');
                    setItems(response.data);
                } catch (error) {
                    console.error('Error fetching items:', error);
                }
            };

            fetchPurchaseHistory();
            fetchItems();
        }
    }, [isOpen, cookies.user?.id]);

    const getItemName = (itemId: number) => {
        const item = items.find(item => item.id === itemId);
        return item ? item.name : 'Unknown Item';
    };

    const getItemImage = (itemId: number) => {
        const item = items.find(item => item.id === itemId);
        return item ? item.image : '';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-11/12 max-w-4xl h-[80vh] p-6 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                <h1 className="text-4xl font-bold mb-4">구매 내역</h1>
                <div className="h-[65vh] overflow-y-auto">
                    {purchaseHistory.map(purchase => (
                        <div key={purchase.id} className="border p-4 flex items-center">
                            <img src={getItemImage(purchase.item_id)} alt={getItemName(purchase.item_id)} className="w-16 h-16 mr-4" />
                            <div>
                                <h2 className="font-bold">{getItemName(purchase.item_id)}</h2>
                                <p>수량: {purchase.quantity}</p>
                                <p>구매 날짜: {new Date(purchase.purchase_date).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistory;
