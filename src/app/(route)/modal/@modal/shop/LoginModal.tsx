import Link from 'next/link';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다.</h2>
                <p className="mb-4">아이템을 구매하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-500 text-white text-lg font-bold py-2 px-4 rounded-lg mr-2"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <Link href="http://localhost:8080/api/oauth2/authorization/kakao">
                        <button className="bg-blue-500 text-white text-lg font-bold py-2 px-4 rounded-lg">
                            로그인하러 가기
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
