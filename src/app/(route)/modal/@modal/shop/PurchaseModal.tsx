'use client';

import { useState } from 'react';
import { postData } from '@/app/api/api';

interface Item {
    id: number;
    name: string;
    price: number;
    endpoint: string;
    image: string;
}

interface PurchaseModalProps {
    item: Item;
    onClose: () => void;
    userZem: number;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ item, onClose, userZem }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isZemInsufficient, setIsZemInsufficient] = useState<boolean>(false);

    const handlePurchase = async () => {
        if (userZem < item.price) {
            setIsZemInsufficient(true);
            return;
        }
        setLoading(true);
        try {
            await postData(item.endpoint, item.id, "honjaya")
            alert('구매가 완료되었습니다!');
            onClose();
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseInsufficientModal = () => {
        setIsZemInsufficient(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white w-11/12 max-w-md p-6 mt-10 shadow-lg relative transition-transform duration-300 transform overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-4xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
                <p>이 아이템을 구매하시겠습니까?</p>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                <div className="flex justify-end mt-8">
                    <button
                        className="bg-gray-300 text-black py-2 px-4 rounded mr-4"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePurchase}
                        disabled={loading}
                    >
                        {loading ? '구매 중...' : '구매'}
                    </button>
                </div>
            </div>

            {isZemInsufficient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                    <div className="bg-white w-11/12 max-w-md p-6 mt-10 shadow-lg relative transition-transform duration-300 transform overflow-hidden">
                        <button
                            onClick={handleCloseInsufficientModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-4xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">ZEM이 부족합니다</h2>
                        <p>ZEM이 부족하여 구매하실 수 없습니다. 부족한 금액을 충전 후 구매하실 수 있습니다.</p>
                        <div className="flex justify-end mt-8">
                            <button
                                className="bg-gray-300 text-black py-2 px-4 rounded mr-4"
                                onClick={handleCloseInsufficientModal}
                            >
                                확인
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={onClose}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseModal;
