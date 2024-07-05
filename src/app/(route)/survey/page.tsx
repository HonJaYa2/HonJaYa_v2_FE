// src/app/(route)/survey/page.tsx
"use client";
import { useState } from 'react';


const preferences = ['운동 중독', '일중독', '연상 킬러', '연하 킬러', '친구같은 연애', '진지한 연애', '게임', '독서', '여행'];

const SurveyPage = () => {
    const [selectedPreference, setSelectedPreference] = useState<string | null>(null);

    const handleSelect = (preference: string) => {
        setSelectedPreference(preference);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-xl p-12 bg-white shadow-md rounded-lg border-4 border-red-300">
                <h1 className="block text-4xl text-center mb-10">저는...</h1>
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {preferences.map((preference) => (
                        <button
                            key={preference}
                            type="button"
                            onClick={() => handleSelect(preference)}
                            className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${selectedPreference === preference ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                        >
                            {preference}
                        </button>
                    ))}
                </div>
                <h1 className="block text-4xl text-center mb-10">당신은...</h1>
            </div>
        </div>
    );
};

export default SurveyPage;
