"use client";

import Link from "next/link";

const EnterMainButton = () => {
    return (
            <div className="flex w-4/5 h-4/5">
                <Link
                    href={"/wait"}
                    className="z-10 w-full h-full flex justify-center items-center rounded-sm text-base p-1 bg-gradient-to-r from-white to-red-200  text-red-400 hover:text-white">
                        채팅 하러 가기
                </Link>
            </div>
    )
}
export default EnterMainButton;
