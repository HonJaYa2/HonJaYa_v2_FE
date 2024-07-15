'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ItemPurchase from '@/app/(route)/modal/@modal/shop/ItemPurchase';
import LoginModal from '@/app/(route)/modal/@modal/shop/LoginModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/reducers/rootReducer';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { approve } from '@/state/actions';

const ZemShop = () => {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [isItemShopOpen, setIsItemShopOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [userZem, setUserZem] = useState<number>(0);
    const [cookies] = useCookies(['token', 'user']);
    const searchParams = useSearchParams();

    const dispatch = useDispatch();
    const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined);
    const router = useRouter();

    const items = [
        { id: 1, price: 100, diamonds: 1, image: "/zemImages/zem1.png", zem: 10 },
        { id: 2, price: 500, diamonds: 2, image: "/zemImages/zem2.png", zem: 50 },
        { id: 3, price: 1000, diamonds: 3, image: "/zemImages/zem3.png", zem: 100 },
        { id: 4, price: 5000, diamonds: 4, image: "/zemImages/zem4.png", zem: 500 },
        { id: 5, price: 10000, diamonds: 5, image: "/zemImages/zem5.png", zem: 1000 },
        { id: 6, price: 25000, diamonds: 6, image: "/zemImages/zem6.png", zem: 2500 },
        { id: 7, price: 50000, diamonds: 7, image: "/zemImages/zem7.png", zem: 5000 },
        { id: 8, price: 100000, diamonds: 8, image: "/zemImages/zem8.png", zem: 12000, originalZem: 10000 },
    ];

    useEffect(() => {
        const fetchZem = async () => {
            const token = cookies.token;
            const user = cookies.user;
            const userId = user?.id;

            console.log('Cookies:', cookies); // 로그인 상태 및 쿠키 확인 로그
            console.log('User ID:', userId); // 사용자 ID 확인 로그

            if (token && userId) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/getZem/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.data) {
                        throw new Error('Failed to fetch user ZEM');
                    }

                    setUserZem(response.data);
                } catch (error) {
                    console.error('Error fetching user ZEM:', error);
                    setUserZem(0);
                }
            }
        };

        fetchZem();

        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === 'success') {
            alert('결제가 성공적으로 완료되었습니다!');
            fetchZem(); // 결제 후 최신 Zem 수 가져오기
        } else if (paymentStatus === 'fail') {
            alert('결제에 실패했습니다.');
        }
   // Check if user is logged in
   if (cookies.token && cookies.user) {
    dispatch(approve());  // Update login state in Redux
}
}, [cookies, searchParams, dispatch]);


    const handleItemClick = (id: number) => {
        setSelectedItem(id);
    };


    //isLogined가 제대로 작동하려면, 사용자가 로그인할 때 approve 액션을 디스패치하고, 로그아웃하거나 로그인 실패 시 deny 액션을 디스패치해야 합니다.
    const handlePaymentClick = async () => {
        if (isLogined !== "Y") {
            setIsLoginModalOpen(true);
            return;
        }

        if (selectedItem === null) {
            alert('아이템을 선택해 주세요.');
            return;
        }

        const selectedItemData = items.find(item => item.id === selectedItem);

        if (!selectedItemData) {
            alert('선택된 아이템을 찾을 수 없습니다.');
            return;
        }

        const payInfoDto = {
            price: selectedItemData.price,
            itemName: "zem_" + selectedItemData.zem,
            userId: cookies.user.id
        };

        try {
            const { data } = await axios.post('http://localhost:3000/api/pay/ready', payInfoDto);
            const redirectUrl = data.redirectUrl;
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Error during payment preparation:', error);
            alert('Payment preparation failed');
        }
    };

    const openItemShop = () => {
        setIsItemShopOpen(true);
    };

    const closeItemShop = () => {
        setIsItemShopOpen(false);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className="p-20">
            <div className="relative flex justify-center mt-8 mb-12 max-w-5xl mx-auto">
                <div
                    className="flex flex-col items-start justify-center py-12 px-12 bg-cover bg-center w-full"
                    style={{ backgroundImage: "url('/zem-banner1.jpg')", backgroundPosition: "center top 1%" }}
                >
                    <h2 className="text-sm font-semibold text-white mb-2 text-left font-jua">행운을 빕니다.</h2>
                    <h2 className="text-4xl text-white text-left font-jua">Zem을 충전하여 매칭해보세요!!</h2>
                </div>
                <div className="absolute top-0 right-0 h-full flex flex-col items-center justify-center bg-white p-4 w-1/4">
                    <Image
                        src="/zem-benner(event).jpg"
                        alt="이벤트 상품"
                        layout="fill"
                        objectFit="cover"
                    />
                    <div className="absolute bottom-2 text-center bg-black bg-opacity-50 text-white px-2 rounded">
                        <h2 className="font-bold font-jua">[월간] ZEM 20% 보너스</h2>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between bg-red-300 py-2 px-12 rounded-lg mb-4 max-w-5xl mx-auto relative">
                <h2 className="text-4xl font-semibold font-jua">보유 ZEM :</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-semibold">{userZem}</span>
                    <div className="text-pink-500" style={{ marginLeft: '-12px' }}>
                        <Image
                            src="/zemImages/ownedZem.png"
                            alt="보유 ZEM"
                            width={56}
                            height={56}
                        />
                    </div>
                    <button
                        className="bg-blue-900 text-white text-sm font-bold py-1 px-4"
                        style={{
                            animation: 'shimmer 0.7s infinite'
                        }}
                        onClick={openItemShop}
                    >
                        <span className="text-red-500 font-bold">!!</span> 아이템 샵 둘러보기
                    </button>
                    <style jsx>{`
                        @keyframes shimmer {
                            30%, 100% {
                                opacity: 1;
                            }
                            50% {
                                opacity: 0.5;
                            }
                        }
                    `}</style>
                </div>
            </div>

            <div className="max-w-screen-lg mx-auto grid grid-cols-4 gap-y-10">
                {items.map((item) => (
                    <div key={item.id} className="relative flex flex-col items-center max-w-full p-0 m-0">
                        {item.originalZem && (
                            <>
                                <div className="absolute top-[-10px] left-[1px] z-20 flex items-center">
                                    <Image
                                        src="/zemImages/bestseller.png"
                                        alt="베스트셀러 아이콘"
                                        width={70}
                                        height={70}
                                    />
                                    <div className="bg-red-500 text-white text-sm font-bold px-3 rounded ml-2" style={{ marginTop: '-30px' }}>
                                        20% BONUS
                                    </div>
                                </div>
                            </>
                        )}
                        <button
                            className={`w-52 h-52 border-2 rounded-lg ${selectedItem === item.id ? 'border-purple-500 bg-purple-200 text-purple-700' : 'border-gray-300 bg-white text-black'
                                } flex flex-col items-center justify-center relative hover:border-purple-500`}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <div className="flex justify-center items-center w-full h-full relative">
                                <Image
                                    src={item.image}
                                    alt={`diamond ${item.diamonds}`}
                                    className={`${item.id === 1 ? 'w-14 h-14' : 'w-36 h-36'} object-cover`}
                                    width={item.id === 1 ? 80 : 160}
                                    height={item.id === 1 ? 80 : 160}
                                    style={{ marginTop: item.id === 8 ? '-20px' : '0' }}
                                />
                                {item.originalZem && (
                                    <div className="absolute bottom-0 flex flex-col items-center z-20">
                                        <p className="font-bold line-through" style={{ lineHeight: '1.2' }}>{item.originalZem} ZEM</p>
                                        <p className="text-lg font-bold text-red-500" style={{ lineHeight: '1.2' }}>{item.zem} ZEM</p>
                                    </div>
                                )}
                            </div>
                            {!item.originalZem && (
                                <p className={`font-bold mt-2 ${selectedItem === item.id ? 'text-purple-700' : 'text-black'}`} style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center' }}>{item.zem} ZEM</p>
                            )}
                        </button>
                        <div className="flex items-center mt-2">
                            <Image
                                src="/zemImages/coin.png"
                                alt="원 아이콘"
                                width={24}
                                height={24}
                                className="mr-1"
                            />
                            <p className={`py-2 font-bold text-xl ${selectedItem === item.id ? 'text-purple-700' : 'text-black'}`}>{item.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <button
                    onClick={handlePaymentClick}
                    className="bg-yellow-400 text-black text-2xl font-bold py-4 px-10 rounded-lg"
                >
                    결제하기
                </button>
            </div>

            {isItemShopOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                    <div className="bg-white w-11/12 max-w-4xl p-6 mt-10 shadow-lg relative">
                        <button
                            onClick={closeItemShop}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-4xl"
                        >
                            &times;
                        </button>
                        <ItemPurchase userZem={userZem} />
                    </div>
                </div>
            )}

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </div>
    );
};

export default ZemShop;
