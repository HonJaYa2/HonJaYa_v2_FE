// src/app/_components/signupsteps/navigationbuttons/NavigationButtons.tsx
import React from 'react';

interface NavigationButtonsProps {
    onNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onPrevious?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disablePrevious?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onNext, onPrevious, disablePrevious }) => {
    return (
        <div className="py-2 flex flex-col items-center space-y-4">
            <button
                type="button"
                onClick={onNext}

                className="text-xl font-mono py-1 px-20 border-red-300 border-2 rounded-md shadow-sm text-white bg-main-color hover:bg-red-300 hover:ring-2 hover:ring-red-100 active:ring-0 active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2"
            >
                다음
            </button>
            <button
                type="button"
                onClick={onPrevious}
                className={`font-bold py-1 px-16 border-gray-600 rounded-md shadow-sm text-sm text-white bg-gray-500 hover:bg-gray-600 hover:ring-2 hover:ring-red-100 active:ring-0 active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2 ${disablePrevious ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={disablePrevious}
            >
                뒤로
            </button>
        </div>
    );
};

export default NavigationButtons;
