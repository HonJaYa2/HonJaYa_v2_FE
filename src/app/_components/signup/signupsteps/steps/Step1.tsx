import { useState, useEffect } from "react";
import StepIndicator from '../../stepIndicator';
import NavigationButtons from '../navigationbuttons/NavigationButtons';

interface Step1Props {
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: { birthday: string }) => void;
    formData: any;
}

const Step1: React.FC<Step1Props> = ({ nextStep, prevStep, updateFormData, formData }) => {
    const [birthday, setBirthday] = useState(formData.birthday || "");

    useEffect(() => {
        setBirthday(formData.birthday || "");
    }, [formData.birthday]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!birthday) {
            alert("생일을 입력해주세요.");
            return;
        }
        updateFormData({ birthday });
        nextStep();
    };

    return (
        <div className=" w-2/3 h-4/5 flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-white shadow-md rounded-lg border-4 border-red-300 ">
                <StepIndicator currentStep={1} />
                <form onSubmit={handleSubmit} className="space-y-6">
                    <label htmlFor="birthday" className="block text-4xl text-center mb-40">생일은 언제인가요?</label>
                    <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        required
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="text-center text-xl w-full border-b-2 border-black focus:outline-none focus:border-red-400"
                    />
                    <NavigationButtons onNext={handleSubmit} onPrevious={prevStep} />
                </form>
            </div>
        </div>
    );
}

export default Step1;