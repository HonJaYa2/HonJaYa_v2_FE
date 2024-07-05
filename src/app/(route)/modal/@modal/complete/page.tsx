"use client";

import { useRouter } from 'next/navigation';

const CompleteModal = () => {
    const router = useRouter();

    const goToSurvey = () => {
        router.push('/survey');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4 text-center">회원 정보 입력이 완료되었습니다.</h2>
            <button
                onClick={goToSurvey}
                className="text-xl font-bold py-1 px-20 border-red-300 rounded-md shadow-sm text-white bg-gradient-to-br from-red-300 via-red-200 to-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
            >
                홈으로
            </button>
        </div>
    );
};

export default CompleteModal;
