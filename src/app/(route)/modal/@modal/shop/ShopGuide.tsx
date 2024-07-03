// 웹 샵 이용 가이드 모달
'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
    const [showModal, setShowModal] = useState(false);
    const [animateModal, setAnimateModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
            setTimeout(() => setAnimateModal(true), 10); // 짧은 지연 후 애니메이션 시작
        } else {
            setAnimateModal(false);
            setTimeout(() => setShowModal(false), 300); // 300ms 동안 애니메이션 적용
        }
    }, [isOpen]);

    if (!showModal) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${animateModal ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white w-11/12 max-w-4xl p-6 mt-10 shadow-lg relative transition-transform duration-300 transform ${animateModal ? 'scale-100' : 'scale-95'} max-h-screen overflow-y-auto`}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-4xl"
                >
                    &times;
                </button>
                <h2 className="text-3xl text-center font-bold mb-4">ZEM 이용안내</h2>
                <div>
                    <p className="mt-10"><span className="text-xl font-bold">ZEM</span>이란?</p>
                    <p>ZEM은 <span className="font-bold">혼자야에서 채팅을 하기위해 필요한 화폐</span>입니다.</p>
                </div>

                <div className="bg-gray-800 p-4 mt-4 flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                        <Image src="/zemImages/zem1.png" alt="ZEM" width={64} height={64} className="object-contain" />
                    </div>
                    <div className="ml-4">
                        <p className="mb-2 font-bold text-xl text-white">ZEM</p>
                        <p className="text-white">ZEM은 혼자야 샵에서 매칭에 필요한 다양한 아이템 구매로 한발짝 더 이성에 다가갈 수 있습니다.</p>
                    </div>
                </div>
                <br />
                <div>
                    <p className="mt-4"><span className="text-xl font-bold">ZEM</span>은 어떻게 얻나요?</p>
                    <div className="bg-gray-100 p-4 mt-4 text-center">
                        <p>혼자야SHOP에서 원하는 ZEM 선택 후 결제하기</p>
                        <div className="flex justify-center mt-4">
                            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center">
                                결제
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="mt-10"><span className="text-xl font-bold">ZEM</span>으로 무엇을 할 수 있나요?</p>
                    <div className="bg-gray-100 p-4 mt-4">
                        <div className="grid grid-cols-2 gap-0">
                            <div className="flex justify-center items-center w-full h-64">
                                <div className="relative w-11/12 h-full"> {/* w-11/12로 좌우 여백 설정 */}
                                    <Image
                                        src="/zemImages/샵이용가이드(1).jpg.png"
                                        alt="좌측 이미지"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center items-center w-full h-64"> {/* w-11/12로 좌우 여백 설정 */}
                                <div className="relative w-11/12 h-full">
                                    <Image
                                        src="/zemImages/샵이용가이드(2).png"
                                        alt="우측 이미지"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-center mt-4">혼자야 샵에서 다양한 상품을 ZEM으로 구매할 수 있습니다.</p>
                    </div>
                </div>
                <br />
                <div>
                    <p className="mt-4"><span className="text-xl font-bold">슈퍼하트</span>의 환산비율은 어떻게 되나요?</p>
                    <div className="bg-gray-100 p-4 mt-4 flex items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                            <Image src="/gameItems/SuperHeart.png" alt="ZEM" width={64} height={64} className="object-contain" />
                        </div>
                        <div className="ml-4">
                            <p className="mb-2 font-bold">슈퍼하트</p>
                            <p className="">
                                원하는 이성에게 줄 수 있는 선물로 현금으로 환산됩니다.
                                <span className="text-xs font-bold">(1슈퍼하트 당 4000원)</span>
                            </p>
                            <p className="">
                                슈퍼하트를 받은 분은 수수료
                                <span className="line-through text-red-500"> 60%</span>
                                를 뗀
                                <span className="text-blue-500"> 40%</span>
                                값을 받습니다.
                            </p>
                        </div>
                    </div>
                </div>


                <div className="text-center text-xs mt-10">
                    <p>혼자야 웹 페이지를 통해 혼자야 샵에 입장하여 이용할 수 있습니다.</p>
                    <p>매월 이벤트 상품이 갱신됩니다.</p>
                    <p>다양한 아이템을 구매해 멋진 이성을 만나실 수 있습니다.</p>
                </div>
            </div>
        </div>
    );
};

export default GuideModal;
