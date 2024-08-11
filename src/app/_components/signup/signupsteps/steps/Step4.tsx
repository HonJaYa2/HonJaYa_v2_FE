"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import StepIndicator from "../../stepIndicator";
import NavigationButtons from '../navigationbuttons/NavigationButtons';
import { FormData } from '@/app/(route)/signup/FormData';
import useGeolocation from "react-hook-geolocation";

interface Step4Props {
    prevStep: () => void;
    updateFormData: (data: Partial<FormData>) => void;
    formData: Partial<FormData>;
    setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

const getKakaoIdFromCookie = () => {
    const userCookie = getCookie('user');
    if (userCookie) {
        try {
            const decodedCookie = decodeURIComponent(userCookie); // 쿠키 디코딩
            const user = JSON.parse(decodedCookie); // 디코딩된 쿠키를 파싱
            return user.id;  // kakao_id를 의미합니다.
        } catch (e) {
            console.error('Failed to parse user cookie:', e);
            return null;
        }
    }
    return null;
};
const getTokenFromCookie = () => getCookie('token');

export default function Step4({ prevStep, updateFormData, formData, setOpenSignUpModal }: Step4Props) {
    const [agree, setAgree] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    // Geolocation hook 사용
    const geolocation = useGeolocation();

    useEffect(() => {
        if (geolocation.latitude && geolocation.longitude) {
            const address = `${geolocation.latitude}, ${geolocation.longitude}`;
            updateFormData({ address });
        }
    }, [geolocation.latitude, geolocation.longitude]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (agree) {
            const data = {
                birthday: formData.birthday,
                gender: formData.gender,
                height: formData.height,
                weight: formData.weight,
                mbti: formData.mbti,
                religion: formData.religion,
                drinkAmount: formData.drinkAmount,
                smoke: formData.smoke,
                address: formData.address
            }

            const kakaoId = getKakaoIdFromCookie();
            const token = getTokenFromCookie();

            if (!kakaoId || !token) {
                console.error('Failed to retrieve kakaoId or token from cookies.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/user/setInfo`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, 
                    },
                    body: JSON.stringify({ kakaoId: kakaoId, userData: data }),
                });

                if (response.ok) {
                    setIsModalOpen(true);
                } else {
                    alert('취향 정보를 등록하는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('Error during preference submission:', error);
                alert('취향 정보를 등록하는 데 실패했습니다.');
            }
        } else {
            alert("위치 정보 제공에 동의해주세요.");
        }
    };

    const handleAgreeButton = () => {
        if (geolocation.latitude && geolocation.longitude) {
            setAgree(true);
        } else {
            alert("현재 위치를 불러오고 있습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    const backToHome = () => {
        try {
            setOpenSignUpModal(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="w-2/3 h-4/5 flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-white shadow-md rounded-lg border-4 border-red-300">
                <StepIndicator currentStep={4} />
                <form onSubmit={handleSubmit} className="w-full h-full">
                    <div className="block text-2xl text-center mb-10">위치 정보 제공</div>
                    <div className="text-center flex flex-col justify-center items-center">
                        {
                            formData.address ? (
                                <div className={`flex justify-center mb-10 h-3/10 w-4/10 py-2 px-6 rounded-lg text-2xl`}>
                                    {formData.address}
                                </div>
                            ) : (
                                <p>위치 정보를 불러오는 중입니다...</p>
                            )
                        }
                        <button
                            type="button"
                            onClick={handleAgreeButton}
                            className={`w-4/10 py-2 px-6 border-4 rounded-lg text-2xl ${agree ? 'border-red-500 bg-red-300 text-white' : 'border-red-300 bg-white text-black'}`}
                        >
                            {agree ? '동의 완료' : '위치 정보 제공에 동의'}
                        </button>
                    </div>
                    <NavigationButtons onNext={handleSubmit} onPrevious={prevStep} />
                </form>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
                        <h2 className="text-2xl text-center mb-4">회원 정보 입력이 완료되었습니다.</h2>
                        <button
                            onClick={backToHome}
                            className="text-xl font-bold py-1 px-20 border-red-300 rounded-md shadow-sm text-white bg-gradient-to-br from-red-300 via-red-200 to-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                        >
                            홈으로
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
