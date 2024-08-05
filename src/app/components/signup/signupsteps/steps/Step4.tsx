"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import StepIndicator from "../../stepIndicator";
import NavigationButtons from '../navigationbuttons/NavigationButtons';
import { getData, postData } from '../../../../api/api';
import { FormData } from '@/app/(route)/signup/FormData';
import useCurrentLocation from '@/app/utils/hooks/getCurrentLoaction';
import { useGeolocated } from "react-geolocated";
import { GoDesktopDownload } from 'react-icons/go';
import { useDispatch } from 'react-redux';
import { setProfile } from '@/state/actions';

interface Step4Props {
    // nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<FormData>) => void;
    formData: Partial<FormData>; // FormData 인터페이스에 맞게 설정 필요
    setOpenSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Step4({ prevStep, updateFormData, formData, setOpenSignUpModal }: Step4Props) {
    const [agree, setAgree] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [here, setHere] = useState<string>("");
    const [onLoading, setOnLoading] = useState<boolean>(false);

    const { location, error, setCurrentLocation } = useCurrentLocation();
    const dispatch = useDispatch();
    const router = useRouter();
    // const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    //     useGeolocated({
    //         positionOptions: {
    //             enableHighAccuracy: false,
    //             timeout: 1000,
    //             maximumAge: 60000 // Use cached positions if they are recent
    //         },
    //         userDecisionTimeout: 3000,
    //     });


    useEffect(() => {
        const asyncronizedSetter = async () => {
            await setCurrentLocation();
        }

        // const setUserIdFirst = async () => {
        //     const userData = await getData("/users/current", "honjaya");
        //     setUserId(() => (userData.data.id))
        //     setUserName(() => (userData.data.name))
        // }
        // if (formData.gender) localStorage.setItem("userGender", formData.gender);

        asyncronizedSetter();
        // setUserIdFirst();
    }, []);

    // useEffect(() => {

    // }, [onLoading]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (agree) {
            const data = {
                birthday: formData.birthday,
                gender: formData.gender,
                height: formData.height,
                weight: formData.weight,
                mbti: formData.mbti,
                religion: formData.religion,
                drinkAmount: formData.drinkAmount,
                smoke: formData.smoke,
                address: formData.address
            }
            // const mongoData = {
            //     memberId: userId,
            //     name: userName,
            //     gender: localStorage.getItem("userGender") === "남성" ? "MALE" : "FEMALE",
            // }
            try {
                await fetch(`http://localhost:8080/user/setInfo`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId: localStorage.getItem("userId"), userData: data}),
                })
                // await postData(`/user`, mongoData, "groupChat")
                setIsModalOpen(true);
                // closeSignUpModal()

            } catch (error) {
                // console.error('Failed to register user preferences:', error);
                alert('취향 정보를 등록하는 데 실패했습니다.');
            }
        } else {
            // console.log(formData)
            alert("위치 정보 제공에 동의해주세요.");
        }
    };

    // const setPresentLocation = () => {
    //     const getLocation = () => {
    //         try {
    //             setCurrentLocation();
    //         }
    //         catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     getLocation();
    // }

    const getLocation = () => {
        setOnLoading(true);

        const kakaoLocation = getData(`/local/geo/coord2regioncode.json?x=${location.lon}&y=${location.lat}`, "kakao");
        // console.log(kakaoLocation);
        kakaoLocation.then((result) => {
            const here = result.documents[0].address_name.split(" ")[1]
            // console.log(result);
            updateFormData({ address: here });
            setHere(here);
        }).catch(error => console.log(error));
        setOnLoading(false);
    }

    const handleAgreeButton = () => {
        // setPresentLocation();
        setAgree((prev) => {
            if (prev) return false;
            if (location.lat !== 0 && location.lon !== 0) {
                return true;
            } else {
                alert("현재 위치를 먼저 불러와주세요!")
                return false;
            }
        })

        // if (location.lat === 0 && location.lon === 0) {
        //     handleAgreeButton();
        // }

        // setAgree((prev) => {
        //     if (prev) return false;

        //     const kakaoLocation = getData(`/local/geo/coord2regioncode.json?x=${location.lon}&y=${location.lat}`, "kakao");
        //     console.log(kakaoLocation);
        //     kakaoLocation.then((result) => {
        //         console.log(result);
        //         updateFormData({ address: result.documents[0].address_name.split(" ")[1] });
        //     });
        //     return true;
        // })
    }

    const backToHome = () => {
        try {
            // localStorage.setItem("user_id", userId);
            // localStorage.setItem("username", userName);
            dispatch(setProfile())
            // router.push('/landing');
            // setIsModalOpen(false)
            setOpenSignUpModal(false)
            console.log('sibal')

        } catch (e) {

            // localStorage.removeItem("user_id");
            console.log(e);
        }
    };

    return (
        <div className=" w-2/3 h-4/5 flex items-center justify-center">
            <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-white shadow-md rounded-lg border-4 border-red-300 ">
                <StepIndicator currentStep={4} />
                <form onSubmit={handleSubmit} className="w-full h-full">
                    <div className="block text-2xl text-center mb-10">위치 정보 제공</div>
                    <div className="text-center flex flex-col justify-center items-center">
                        {
                            here ? <div className={`flex justify-center mb-10 h-3/10 w-4/10 py-2 px-6  rounded-lg text-2xl `}>
                                {here}
                            </div> : <button
                                type="button"
                                onClick={getLocation}
                                className={`flex justify-center mb-10 h-2/10 w-2/10 py-2 px-6 rounded-lg text-2xl hover:border-main-color hover:border-4 outline-none`}
                            >
                                {onLoading ?
                                    <img
                                        src='https://www.svgrepo.com/show/232270/loading.svg'
                                        alt='gps_icon'
                                        className='w-full h-full'
                                    />

                                    : <img
                                        src='https://www.svgrepo.com/show/524610/gps.svg'
                                        alt='gps_icon'
                                        className='w-full h-full'
                                    />

                                }

                            </button>
                        }
                        <button
                            type="button"
                            onClick={handleAgreeButton}
                            className={`w-4/10 py-2 px-6 border-4 rounded-lg text-2xl ${agree ? 'border-red-500 bg-red-300 text-white' : 'border-red-300 bg-white text-black'}`}
                        >
                            {agree ? '동의 완료' : '위치 정보 제공에 동의'}
                        </button>
                    </div>
                    <NavigationButtons onNext={handleSubmit} onPrevious={prevStep} />
                </form>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
                        <h2 className="text-2xl text-center mb-4">회원 정보 입력이 완료되었습니다.</h2>
                        <button
                            onClick={backToHome}
                            className="text-xl font-bold py-1 px-20 border-red-300 rounded-md shadow-sm text-white bg-gradient-to-br from-red-300 via-red-200 to-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                        >
                            홈으로
                        </button>
                    </div>
                </div>

            )}
        </div>
    );
}


// "use client";

// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from "react";
// import StepIndicator from "../../_components/stepIndicator";
// import NavigationButtons from './navigationbuttons/NavigationButtons';
// import { getData, postData } from '../../api/api';
// import { FormData } from '@/app/(route)/signup/FormData';
// import useCurrentLocation from '@/app/utils/hooks/getCurrentLoaction';

// interface Step4Props {
//     nextStep: () => void;
//     prevStep: () => void;
//     updateFormData: (data: Partial<FormData>) => void;
//     formData: Partial<FormData>; // FormData 인터페이스에 맞게 설정 필요
// }

// export default function Step4({ nextStep, prevStep, updateFormData, formData }: Step4Props) {
//     const [agree, setAgree] = useState<boolean>(false);
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [userId, setUserId] = useState<string>("");
//     const [userName, setUserName] = useState<string>("");
//     const { location, error, setCurrentLocation } = useCurrentLocation();
//     const router = useRouter();

//     useEffect(() => {
//         const asyncronizedSetter = async () => {
//             await setCurrentLocation();
//         }

//         const setUserIdFirst = async () => {
//             const userData = await getData("/users/current", "honjaya");
//             setUserId(() => (userData.data.id))
//             setUserName(() => (userData.data.name))
//         }
//         if (formData.gender) localStorage.setItem("userGender", formData.gender);

//         asyncronizedSetter();
//         setUserIdFirst();
//     }, []);

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         if (agree) {
//             const data = {
//                 birthday: formData.birthday,
//                 gender: formData.gender,
//                 height: formData.height,
//                 weight: formData.weight,
//                 mbti: formData.mbti,
//                 religion: formData.religion,
//                 drinkAmount: formData.drinkAmount,
//                 smoke: formData.smoke,
//                 address: formData.address
//             }
//             const mongoData = {
//                     memberId: userId,
//                     name: userName,
//                     gender: localStorage.getItem("userGender") === "남성"? "MALE" : "FEMALE",
//             }
//             try {
//                 await postData(`/users/${userId}/profile`, data, "honjaya")
//                 await postData(`/user`, mongoData, "groupChat")
//                 setIsModalOpen(true);
//             } catch (error) {
//                 console.error('Failed to register user preferences:', error);
//                 alert('취향 정보를 등록하는 데 실패했습니다.');
//             }
//         } else {
//             console.log(formData)
//             alert("위치 정보 제공에 동의해주세요.");
//         }
//     };

//     const setPresentLocation = () => {
//         const getLocation = () => {
//             try {
//                 setCurrentLocation();
//             }
//             catch (error) {
//                 console.log(error)
//             }
//         }
//         getLocation();
//     }

//     const handleAgreeButton = () => {
//         setPresentLocation();

//         if (location.lat === 0 && location.lon === 0) {
//             handleAgreeButton();
//         }

//         setAgree((prev) => {
//             if (prev) return false;

//             const kakaoLocation = getData(`/local/geo/coord2regioncode.json?x=${location.lon}&y=${location.lat}`, "kakao");
//             console.log(kakaoLocation);
//             kakaoLocation.then((result) => {
//                 console.log(result);
//                 updateFormData({ address: result.documents[0].address_name.split(" ")[1] });
//             });
//             return true;
//         })
//     }

//     const handleGoToSurvey = () => {
//         try {
//             localStorage.setItem("user_id", userId);
//             router.push('/landing');
//         } catch (e) {
//             localStorage.removeItem("user_id");
//             console.log(e);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="w-full max-w-xl p-12 bg-white shadow-md rounded-lg border-4 border-red-300">
//                 <StepIndicator currentStep={4} />
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <label className="block text-4xl text-center mb-40">위치 정보 제공</label>
//                     <div className="text-center">
//                         <button
//                             type="button"
//                             onClick={handleAgreeButton}
//                             className={`py-2 px-6 border-4 rounded-lg text-2xl ${agree ? 'border-red-500 bg-red-300 text-white' : 'border-red-300 bg-white text-black'}`}
//                         >
//                             {agree ? '동의 완료' : '위치 정보 제공에 동의'}
//                         </button>
//                     </div>
//                     <NavigationButtons onNext={handleSubmit} onPrevious={prevStep} />
//                 </form>
//             </div>
//             {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
//                         <h2 className="text-2xl text-center mb-4">회원 정보 입력이 완료되었습니다.</h2>
//                         <button
//                             onClick={handleGoToSurvey}
//                             className="text-xl font-bold py-1 px-20 border-red-300 rounded-md shadow-sm text-white bg-gradient-to-br from-red-300 via-red-200 to-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
//                         >
//                             취향 조사하러가기
//                         </button>
//                     </div>
//                 </div>

//             )}
//         </div>
//     );
// }