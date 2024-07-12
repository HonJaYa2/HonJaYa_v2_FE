'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import KakaoLoginButton from '../buttons/KakaoLoginButton';
import Link from 'next/link';

interface NavigationbarProps {
    alwaysVisible?: boolean;
}

const Navigationbar: React.FC<NavigationbarProps> = ({ alwaysVisible }) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [navbarHover, setNavbarHover] = useState<boolean>(false);
    const [isLogined, setIsLogined] = useState<boolean>(false);
    const [cookies] = useCookies(['token', 'user']);
    const router = useRouter();

    useEffect(() => {
        console.log('Cookies:', cookies);
        setIsLogined(!!cookies.token);
    }, [cookies]);

    const handleMenuHovering = () => {
        setMenuOpen((prevState) => !prevState);
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (!isLogined) {
            setPopupVisible(true);
        } else {
            router.push(href);
        }
    };

    return (
        <div
            className={`px-32 fixed top-0 left-0 w-full h-16 flex items-center justify-between text-lg bg-main-color transition-opacity duration-300 z-50 ${
                alwaysVisible || navbarHover ? 'opacity-100' : 'opacity-20'
            }`}
            onMouseEnter={() => setNavbarHover(true)}
            onMouseLeave={() => setNavbarHover(false)}
        >
            <div className='relative w-2/12 h-full'>
                <img src='/logo.png' className="w-auto h-full" style={{ clipPath: 'inset(0 10px 0 0)' }} alt="로고" />
            </div>
            <div
                className='relative flex font-light text-white items-center justify-center w-1/12 h-full hover:underline'
                onMouseEnter={handleMenuHovering}
                onMouseLeave={handleMenuHovering}
            >
                Menu
                <div
                    className={`z-20 absolute top-full w-48 shadow transition-all duration-300 ${
                        menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                >
                    <ul className='list-none flex-col text-center justify-center items-center m-0 p-0 text-white'>
                        <li className='px-4 py-2 bg-main-color bg-opacity-70 cursor-pointer outline-none hover:bg-opacity-60 hover:text-xl'>
                            <Link href="/landing">Home</Link>
                        </li>
                        <li className='px-4 py-2 bg-main-color bg-opacity-70 cursor-pointer outline-none hover:bg-opacity-60 hover:text-xl'>
                            <a href="/wait" onClick={(e) => handleLinkClick(e, "/wait")}>Chat</a>
                        </li>
                        <li className='px-4 py-2 bg-main-color bg-opacity-70 cursor-pointer outline-none hover:bg-opacity-60 hover:text-xl'>
                            <a href="/shop" onClick={(e) => handleLinkClick(e, "/shop")}>Shop</a>
                        </li>
                        <li className='px-4 py-2 bg-main-color bg-opacity-70 cursor-pointer outline-none hover:bg-opacity-60 hover:text-xl'>
                            <a href="/board" onClick={(e) => handleLinkClick(e, "/board")}>Board</a>
                        </li>
                        <li className='px-4 py-2 bg-main-color bg-opacity-70 cursor-pointer outline-none hover:bg-opacity-60 hover:text-xl'>
                            <a href="/mypage" onClick={(e) => handleLinkClick(e, "/mypage")}>My Page</a>
                        </li>
                    </ul>
                </div>
            </div>
            <KakaoLoginButton />
            {popupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black bg-opacity-50 absolute inset-0"></div>
                    <div className="bg-white p-4 rounded shadow-lg z-10 flex flex-col items-center text-center">
                        <p>로그인이 필요합니다.</p>
                        <button
                            onClick={() => setPopupVisible(false)}
                            className="bg-main-color text-white px-4 py-2 rounded mt-2"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navigationbar;
