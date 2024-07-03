'use client'

import { getData, postData, putData } from "@/app/api/api";
import React, { startTransition, useEffect, useState } from "react";
import ReactSlider from "react-slider";

interface Props {
    setFilterOpen: () => void;
}

const Religions = ["불교", "기독교", "천주교", "원불교"];
const MbtiTypes = ['INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const drinkingAmount = ["알쓰", "평균", "술고래"];
const smokeOrNot = ['흡연', '비흡연'];

export const ReligionSelector = ({ open, setOpen, selectedReligion, setSelectedReligion }: { open: boolean; setOpen: () => void; selectedReligion: string, setSelectedReligion: (religion: string) => void }) => {
    return (
        <div className="w-4/5 z-30 mb-4" >
            <button
                className="text-base w-full h-10 bg-main-color rounded-lg"
                onClick={() => setOpen()}
            >
                {selectedReligion}
            </button>
            {open && (
                <ul className="z-50 w-full h-28 bg-white animate-fade-in-down" style={{overflow: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    {Religions.map((religion, index) => (
                        <li
                        className={`text-base w-full h-10 flex justify-center items-center hover:bg-red-100 ${religion === selectedReligion ? "bg-red-200" : "bg-white"}`}
                        key={index}
                            onClick={() => {
                                setSelectedReligion(religion);
                                setOpen();
                            }}
                        >
                            {religion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export const MbtiSelector = ({ open, setOpen, selectedMbti, setSelectedMbti }: { open: boolean; setOpen: () => void; selectedMbti: string; setSelectedMbti: (mbti: string) => void }) => {
    return (
        <div className="w-4/5 z-30 mb-4">
            <button
                className="text-base w-full h-10 bg-main-color rounded-lg"
                onClick={() => setOpen()}
            >
                {selectedMbti}
            </button>
            {open && (
                <ul className="z-40 w-full h-28 overflow-y-scroll bg-white animate-fade-in-down">
                    {MbtiTypes.map((mbti, index) => (
                        <li
                            className={`text-base w-full h-10 flex justify-center items-center hover:bg-red-100 ${mbti === selectedMbti ? "bg-red-200" : "bg-white"}`}
                            key={index}
                            onClick={() => {
                                setSelectedMbti(mbti);
                                setOpen();
                            }}
                        >
                            {mbti}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const FilterModal = ({ setFilterOpen }: Props) => {
    const [idealExist, setIdealExist] = useState<boolean>()
    const [age, setAge] = useState<[number, number]>([20, 80]);
    const [height, setHeight] = useState<[number, number]>([100, 250]);
    const [weight, setWeight] = useState<[number, number]>([30, 150]);
    const [selectedDrinkAmount, setSelectedDrinkAmount] = useState<string>("");
    const [openReligionSelector, setOpenReligionSelector] = useState<boolean>(false);
    const [openMbtiSelector, setOpenMbtiSelector] = useState<boolean>(false);
    const [selectedReligion, setSelectedReligion] = useState<string>("불교");
    const [selectedMbti, setSelectedMbti] = useState<string>("INFJ");
    const [smoke, setSmoke] = useState<boolean>();

    const setReligionSelectorOpen = () => {
        setOpenReligionSelector((prev) => !prev);
    }

    const setMbtiSelectorOpen = () => {
        setOpenMbtiSelector((prev) => !prev);
    }

    useEffect(()=> {
        const getIdealType = async () => {
            try {
                const response = await getData(`/users/${localStorage.getItem('user_id')}/ideal`, "honjaya");
                console.log(response);
                if(response) {
                    setIdealExist(true);
                    setAge([response.data.minAge, response.data.maxAge]);
                    setHeight([response.data.minHeight, response.data.maxHeight]);
                    setWeight([response.data.minWeight, response.data.maxWeight]);
                    setSelectedDrinkAmount(response.data.drinkAmount);
                    setSelectedReligion(response.data.religion);
                    setSelectedMbti(response.data.mbti);
                    setSmoke(response.data.smoke);
                }
            } catch (e) {
                console.log(e);
                setIdealExist(false);
            }
        }
        getIdealType();
    },[])

    const handleIdealTypeSubmit = async () =>{
        const idealType = {
            maxAge: age[1],
            minAge: age[0],
            maxHeight: height[1],
            minHeight: height[0],
            maxWeight: weight[1],
            minWeight: weight[0],
            mbti: selectedMbti,
            religion: selectedReligion,
            drinkAmount: selectedDrinkAmount,
            smoke: smoke
        }
        try {
            if(idealExist) {
                await putData(`/users/${localStorage.getItem("user_id")}/ideal`, idealType, "honjaya");
            } else {
                await postData(`/users/${localStorage.getItem("user_id")}/ideal`, idealType, "honjaya");
            }
            setFilterOpen();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="animate-fade-in-down-left z-20 bg-white w-full h-96 max-h-screen flex flex-col items-center justify-start border-main-color border-4 rounded-lg p-4 overflow-y-auto">
            <div className="w-4/5 mb-4">
                <div className="text-center text-lg">나이</div>
                <ReactSlider
                    className="bg-white"
                    thumbClassName="h-6 w-6 bg-main-color rounded-full cursor-pointer outline-none border-red-500 border-2"
                    renderTrack={(props, state) => {
                        const trackColors = ['bg-white', 'bg-main-color bg-opacity-80', 'bg-white'];
                        return (
                            <div
                                {...props}
                                className={`h-4 my-1 rounded-full ${trackColors[state.index]} border-2 border-main-color`}
                            />
                        );
                    }}
                    value={age}
                    onChange={(val) => setAge(val as [number, number])}
                    min={20}
                    max={80}
                    pearling
                    minDistance={5}
                />
                <div className="flex justify-center mt-6">
                    <div className="text-sm mt-2">{age[0]}세 ~ {age[1]}세</div>
                </div>
            </div>

            <div className="flex flex-col justify-center jui w-4/5 mb-4">
                <div className="text-center text-lg">키</div>
                <ReactSlider
                    className="bg-white flex"
                    thumbClassName="h-6 w-6 bg-main-color rounded-full cursor-pointer outline-none border-red-500 border-2"
                    renderTrack={(props, state) => {
                        const trackColors = ['bg-white', 'bg-main-color bg-opacity-80', 'bg-white'];
                        return (
                            <div
                                {...props}
                                className={`h-4 my-1 rounded-full ${trackColors[state.index]} border-2 border-main-color`}
                            />
                        );
                    }}
                    value={height}
                    onChange={(val) => setHeight(val as [number, number])}
                    min={100}
                    max={250}
                    pearling
                    minDistance={5}
                />
                <div className="flex justify-center mt-6">
                    <div className="text-sm mt-2">{height[0]}CM ~ {height[1]}CM</div>
                </div>
            </div>

            <div className="w-4/5 mb-4">
                <div className="text-center text-lg">체중</div>
                <ReactSlider
                    className="bg-white"
                    thumbClassName="h-6 w-6 bg-main-color rounded-full cursor-pointer outline-none border-red-500 border-2"
                    renderTrack={(props, state) => {
                        const trackColors = ['bg-white', 'bg-main-color bg-opacity-80', 'bg-white'];
                        return (
                            <div
                                {...props}
                                className={`h-4 my-1 rounded-full ${trackColors[state.index]} border-2 border-main-color`}
                            />
                        );
                    }}
                    value={weight}
                    onChange={(val) => setWeight(val as [number, number])}
                    min={30}
                    max={150}
                    pearling
                    minDistance={5}
                />
                <div className="flex justify-center mt-6">
                    <div className="text-sm mt-2">{weight[0]}KG ~ {weight[1]}KG</div>
                </div>
            </div>

            <div className="w-4/5 mb-4 text-center">
                <div className="text-lg">주량</div>
                <div className="grid grid-cols-3 gap-2">
                    {drinkingAmount.map((drinking) => (
                        <button
                            key={drinking}
                            type="button"
                            onClick={() => setSelectedDrinkAmount(drinking)}
                            className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${selectedDrinkAmount === drinking ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                        >
                            {drinking}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-4/5 mb-4 text-center">
                <div className="text-lg">흡연</div>
                <div className="grid grid-cols-2 gap-2">
                    {smokeOrNot.map((smokeBool) => (
                        <button
                            key={smokeBool}
                            type="button"
                            onClick={() => setSmoke(smokeBool === "흡연")}
                            className={`py-1 px-2 border-2 border-red-300 rounded-2xl text-sm ${smoke === (smokeBool === "흡연") ? 'bg-red-300 text-white' : 'bg-white text-black'}`}
                        >
                            {smokeBool}
                        </button>
                    ))}
                </div>
            </div>

            <ReligionSelector
                open={openReligionSelector}
                setOpen={setReligionSelectorOpen}
                selectedReligion={selectedReligion}
                setSelectedReligion={setSelectedReligion}
            />

            <MbtiSelector
                open={openMbtiSelector}
                setOpen={setMbtiSelectorOpen}
                selectedMbti={selectedMbti}
                setSelectedMbti={setSelectedMbti}
            />

            <div className="flex justify-around w-4/5 mt-5">
                <button onClick={handleIdealTypeSubmit} className="w-3/10 text-sm font-bold border-red-300 rounded-md shadow-sm bg-gradient-to-br from-red-300 via-red-200 to-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">적용</button>
                <button onClick={setFilterOpen} className="w-3/10 text-sm border-gray-600 rounded-md shadow-sm bg-gradient-to-br from-gray-500 via-gray-300 to-white hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-gray-200">취소</button>
            </div>
        </div>
    );
}

export default FilterModal;
