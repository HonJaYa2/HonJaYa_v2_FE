'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import PurchaseHistory from '@/app/(route)/modal/@modal/shop/PurchaseHistory'; // 추가된 import

const GuideModal = dynamic(() => import('@/app/(route)/modal/@modal/shop/ShopGuide'), { ssr: false });

const ShopNavbar = () => {
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [isPurchaseHistoryOpen, setIsPurchaseHistoryOpen] = useState(false); // 추가된 state

    const openGuideModal = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsGuideModalOpen(true);
    };

    const closeGuideModal = () => {
        setIsGuideModalOpen(false);
    };

    const openPurchaseHistory = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsPurchaseHistoryOpen(true);
    };

    const closePurchaseHistory = () => {
        setIsPurchaseHistoryOpen(false);
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full flex items-center justify-between h-20 bg-main-color overflow-hidden px-4 z-50">
                <div className='flex items-center relative'>
                    <Link href="/">
                    <div className='relative w-36 h-20 flex-shrink-0' style={{ clipPath: 'inset(0 20px 0 0)' }}>
                        <Image src='/logo.png' alt="로고" width={140} height={80} />
                    </div>
                    </Link>
                    <span className='absolute left-28 text-blue-900 font-bold text-xl'>SHOP</span>
                </div>
                <div className='flex items-center space-x-8'>
                    <a href="#" onClick={openPurchaseHistory} className='text-white font-semibold flex items-center hover:text-main-hover-color'>구매내역</a>
                    <Link href="/mypage" legacyBehavior>
                        <a className='text-white font-semibold flex items-center hover:text-main-hover-color'>My page</a>
                    </Link>
                    <a onClick={openGuideModal} className='text-blue-600 font-semibold flex items-center hover:text-blue-900 bg-gray-300 border border-gray-400 px-3 py-1 rounded-2xl cursor-pointer'>웹 샵 이용 가이드</a>
                    <Link href="/chat" legacyBehavior>
                        <a className='text-white font-semibold flex items-center justify-center hover:bg-purple-700 bg-purple-500 px-4 h-20'>
                            채팅하러가기
                        </a>
                    </Link>
                </div>
            </div>

            <GuideModal isOpen={isGuideModalOpen} onClose={closeGuideModal} />
            <PurchaseHistory isOpen={isPurchaseHistoryOpen} onClose={closePurchaseHistory} /> {/* 추가된 모달 */}
        </>
    );
}

export default ShopNavbar;
