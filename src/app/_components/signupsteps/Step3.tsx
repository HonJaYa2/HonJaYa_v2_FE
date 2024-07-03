import { useState, useEffect } from 'react';
import CustomNumberInput from '../customNum';
import StepIndicator from '../stepIndicator';
import NavigationButtons from './navigationbuttons/NavigationButtons';

const mbtiTypes = ['INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const religionTypes = ['기독교', '불교', '천주교', '이슬람', '기타', '무교'];
const drinkingTypes = ['알쓰', '평균', '술고래'];
const smokeOrNot = ['흡연', '비흡연'];

interface FormData {
    height?: number;
    weight?: number;
    mbti?: string;
    religion?: string;
    drinkAmount?: string;
}

interface Step3Props {
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<FormData>) => void;
    formData: any;
}

const Step3: React.FC<Step3Props> = ({ nextStep, prevStep, updateFormData, formData }) => {
    const [showAllMbti, setShowAllMbti] = useState(false);
    const [selectedMbti, setSelectedMbti] = useState<string | undefined>(formData.mbti || undefined);
    const [selectedReligion, setSelectedReligion] = useState<string | undefined>(formData.religion || undefined);
    const [selectedDrinking, setSelectedDrinking] = useState<string | undefined>(formData.drinkAmount || undefined);
    const [height, setHeight] = useState<number>(formData.height || 170);
    const [weight, setWeight] = useState<number>(formData.weight || 70);
    const [smoke, setSmoke] = useState<boolean>(formData.smoke || null);

    useEffect(() => {
        setSelectedMbti(formData.mbti || undefined);
        setSelectedReligion(formData.religion || undefined);
        setSelectedDrinking(formData.drinkAmount || undefined);
        setHeight(formData.height || 170);
        setWeight(formData.weight || 70);
    }, [formData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data: FormData = {
            height,
            weight,
            mbti: selectedMbti,
            religion: selectedReligion,
            drinkAmount: selectedDrinking,
        };
        updateFormData(data);
        nextStep();
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-xl p-12 bg-white shadow-md rounded-lg border-4 border-red-300">
                <StepIndicator currentStep={3} />
                <form onSubmit={handleSubmit} className="space-y-6">
                    <label htmlFor="additional-info" className="block text-4xl text-center mb-10">추가 정보</label>
                    <div className="text-center">
                        <label htmlFor="physical-specs" className="block text-2xl mb-2">신체 스펙</label>
                        <div className="flex justify-center items-center space-x-8">
                            <div className="flex flex-col items-center">
                                <CustomNumberInput
                                    id="height"
                                    name="height"
                                    initialValue={175}
                                    unit="cm"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <CustomNumberInput
                                    id="weight"
                                    name="weight"
                                    initialValue={80}
                                    unit="kg"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <label htmlFor="mbti" className="mt-10 mb-4 block text-2xl">MBTI</label>
                        <div className="grid grid-cols-4 gap-2">
                            {mbtiTypes.slice(0, showAllMbti ? mbtiTypes.length : 4).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedMbti(type)}
                                    className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${selectedMbti === type ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center mt-2">
                            <button
                                type="button"
                                onClick={() => setShowAllMbti(!showAllMbti)}
                                className="text-sm text-gray-500 focus:outline-none"
                            >
                                {showAllMbti ? '닫기[x]' : '...'}
                            </button>
                        </div>
                    </div>
                    <div className="text-center">
                        <label htmlFor="religion" className="block text-2xl mb-4">종교</label>
                        <div className="grid grid-cols-3 gap-2">
                            {religionTypes.map((religion) => (
                                <button
                                    key={religion}
                                    type="button"
                                    onClick={() => setSelectedReligion(religion)}
                                    className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${selectedReligion === religion ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                                >
                                    {religion}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-center">
                        <label htmlFor="drinkingAmount" className="block text-2xl mb-4">주량</label>
                        <div className="grid grid-cols-3 gap-2">
                            {drinkingTypes.map((drinking) => (
                                <button
                                    key={drinking}
                                    type="button"
                                    onClick={() => setSelectedDrinking(drinking)}
                                    className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${selectedDrinking === drinking ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                                >
                                    {drinking}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-center">
                        <label htmlFor="smoke" className="block text-2xl mb-4">흡연</label>
                        <div className="grid grid-cols-2 gap-2">
                            {smokeOrNot.map((smokeBool) => (
                                <button
                                    key={smokeBool}
                                    type="button"
                                    onClick={() => {setSmoke(()=>{return smokeBool === "흡연"? true : false})}}
                                    className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${smoke === (smokeBool === "흡연"? true : false) ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                                >
                                    {smokeBool}
                                </button>
                            ))}
                        </div>
                    </div>
                    <NavigationButtons onNext={handleSubmit} onPrevious={prevStep} />
                </form>
            </div>
        </div>
    );
}

export default Step3;
