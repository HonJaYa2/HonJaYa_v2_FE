import { useState } from "react";
import Image from "next/image";

interface NoticeProps {
    nextStep: () => void;
}

const Notice: React.FC<NoticeProps> = ({ nextStep }) => {

    const handleNext = (event: React.MouseEvent) => {
        event.preventDefault();
        nextStep();
    };

    return (
        <div className="w-2/3 h-4/5 flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-white shadow-md rounded-lg border-4 border-red-300">
                <div className="w-full h-1/10">
                    <div className="relative w-2/10 h-full">
                        <Image
                            src="/logo1.png"
                            layout="fill"
                            alt="logo"
                            objectFit="cover"
                            className="border-main-color border-2 rounded-sm"
                        />
                    </div>
                </div>
                <div className="w-7/10 h-3/10">
                    <p className="w-9/10 h-3/10 text-right">약 3분 소요</p>
                    <p className="h-3/10 text-center text-4xl font-mono font-bold text-main-color">혼자야에서 원하는 매칭에 <br /> 성공 하시길 바랍니다.</p>
                </div>
                <div className="w-1/4 h-2/5">
                    <div className="relative w-full h-full">
                        <Image
                            src="/heartCharacter.png"
                            layout="fill"
                            alt="logo"
                            objectFit="cover"
                            className="border-main-color rounded-sm"
                        />
                    </div>
                </div>
                <div className="w-7/10 h-1/5 flex flex-col justify-center items-center">
                    <button
                        className="w-2/5 h-2/5 text-white font-mono text-lg bg-main-color rounded-md outline-none hover:ring-2 hover:ring-red-100 active:ring-0 active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2"
                        onClick={handleNext}
                    >
                        내 정보 입력하러 가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notice;
