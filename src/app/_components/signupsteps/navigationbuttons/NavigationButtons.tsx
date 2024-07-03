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
                className="text-xl font-bold py-1 px-20 border-red-300 rounded-md shadow-sm text-white bg-pink-400 hover:bg-pink-300 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-pink-500"
            >
                다음
            </button>
            <button
                type="button"
                onClick={onPrevious}
                className={`font-bold py-1 px-16 border-gray-600 rounded-md shadow-sm text-sm text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-200 ${disablePrevious ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={disablePrevious}
            >
                뒤로
            </button>
        </div>
    );
};

export default NavigationButtons;
