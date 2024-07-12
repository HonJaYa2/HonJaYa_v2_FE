'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/reducers/rootReducer';
import KakaoLoginButton from '../buttons/KakaoLoginButton';
import { init } from '@/state/actions';
import Link from 'next/link';
import { postData } from '@/app/api/api';

const Navigationbar = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const isLogined = useSelector((state: RootState) => state.loginCheck.isLogined);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleMenuHovering = () => {
        setMenuOpen((prevState) => !prevState);
    };

    const handleLogout = async () => {
        const response = await postData("/logout", "", "honjaya");
        console.log(response);
        if (response.status === "error") {
            alert(response.message);
            return;
        }
        dispatch(init());
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("userGender");
        localStorage.removeItem("username");
        window.location.href = "https://kauth.kakao.com/oauth/logout?client_id=bfaa02784d2e33bdd6b0083988df03c7&logout_redirect_uri=http://localhost:3000/landing";

        window.location.reload();
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
        <div className="flex w-full h-1/10 items-center justify-between text-lg bg-main-color font-jua">
            <div className='relative w-1/12 h-full'>
                <img src='/logo1.png' className="w-auto" alt="로고1" />
            </div>
            <div
                className='relative flex font-light text-white items-center justify-center w-1/12 h-full hover:underline'
                onMouseEnter={handleMenuHovering}
                onMouseLeave={handleMenuHovering}
            >
                Menu
                <div
                    className={`z-20 absolute top-full w-48 shadow transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
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
            {isLogined === "Y" ? (
                <div className='relative flex font-light text-white items-center justify-center w-1/12 h-full hover:underline'>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <KakaoLoginButton />
            )}

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
