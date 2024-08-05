"use client";
import { useEffect, useState } from 'react';
import Step1 from '../../components/signup/signupsteps/steps/Step1';
import Step2 from '../../components/signup/signupsteps/steps/Step2';
import Step3 from '../../components/signup/signupsteps/steps/Step3';
import Step4 from '../../components/signup/signupsteps/steps/Step4';
import { FormData } from './FormData';

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";
import { useRouter } from 'next/navigation';
import Notice from './signupsteps/steps/Notice';

interface Props {
  setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const SignUpModal: React.FC<Props> = ({ setOpenSignUpModal }) => {

  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});

//   useEffect(() => {
//     console.log(localStorage.getItem('user_id'))
//     if (localStorage.getItem('user_id') !== null) {
//         router.push("/")
//     }
//   },[]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="z-20 w-full h-full flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
      {step === 1 && <Notice nextStep={nextStep}/>}
      {step === 2 && <Step1 nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />}
      {step === 3 && <Step2 nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />}
      {step === 4 && <Step3 nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />}
      {step === 5 && <Step4 prevStep={prevStep} updateFormData={updateFormData} formData={formData} setOpenSignUpModal={setOpenSignUpModal} />}
    </div>
  );
}

export default SignUpModal;
