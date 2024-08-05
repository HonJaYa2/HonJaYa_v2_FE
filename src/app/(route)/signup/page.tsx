// "use client";
// import { useEffect, useState } from 'react';
// import Step1 from '../../components/signup/signupsteps/steps/Step1';
// import Step2 from '../../components/signup/signupsteps/steps/Step2';
// import Step3 from '../../components/signup/signupsteps/steps/Step3';
// import Step4 from '../../components/signup/signupsteps/steps/Step4';
// import { FormData } from '../signup/FormData';

// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/state/reducers/rootReducer";
// import { useRouter } from 'next/navigation';

// interface Props {
//   closeSignUpModal: () => void;
// }

// const SignupPage = (closeSignUpModal : Props) => {

//   const router = useRouter();

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState<FormData>({});

//   useEffect(() => {
//     if (localStorage.getItem('user_id') !== null) {
//         router.push("/")
//     }
//   },[]);

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   const updateFormData = (newData: Partial<FormData>) => {
//     setFormData((prev) => ({ ...prev, ...newData }));
//   };



//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
//       {step === 1 && <Step1 nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />}
//       {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />}
//       {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />}
//       {step === 4 && <Step4 prevStep={prevStep} updateFormData={updateFormData} formData={formData} closeSignUpModal={() => closeSignUpModal}/>}
//     </div>
//   );
// }

// export default SignupPage;
