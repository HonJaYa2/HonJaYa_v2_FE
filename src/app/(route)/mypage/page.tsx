"use client";

import Navigationbar from "@/app/_components/common/Navigationbar";
import { getData, putData } from "@/app/api/api";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { FormData } from "../signup/FormData";
import { useDispatch, useSelector } from "react-redux";
import { approve } from "@/state/actions";
import { RootState } from "@/state/reducers/rootReducer";
import { verifyUser } from "@/app/utils/verifyUser";
import { useRouter } from "next/navigation";

const mbtiTypes = [
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];
const religionTypes = ["기독교", "불교", "천주교", "이슬람", "기타", "무교"];
const drinkingTypes = ["알쓰", "평균", "술고래"];

const MyPage = () => {
  const dispatch = useDispatch();
  const isLogined = useSelector(
    (state: RootState) => state.loginCheck.isLogined
  );
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string>("");
  const [userInfo, setUserInfo] = useState<FormData>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUserInfo, setEditedUserInfo] = useState<FormData>({});

  useEffect(() => {
    if(!(isLogined === "Y")) {
      if (verifyUser()) {
        dispatch(approve());
      } else {
        router.push("/");
      }
    }
    getProfileImage();
    getUserInfo();
  }, [dispatch, isLogined, router]);

  const getProfileImage = async () => {
    try {
      const response = await getData(
        `/users/${localStorage.getItem("user_id")}`,
        "honjaya"
      );
      setProfileImage(response.data.profileImage);
    } catch (e) {
      console.error(e);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await getData(
        `/users/${localStorage.getItem("user_id")}/profile`,
        "honjaya"
      );
      setUserInfo(response.data);
      setEditedUserInfo(response.data);
      console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "smoke") {
      setEditedUserInfo({
        ...editedUserInfo,
        [name]: value === "예" ? true : false,
      });
    } else {
      setEditedUserInfo({
        ...editedUserInfo,
        [name]: value,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUserInfo(userInfo);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await putData(
        `/users/${localStorage.getItem("user_id")}/profile`,
        editedUserInfo,
        "honjaya"
      );
      setUserInfo(editedUserInfo);
      setIsEditing(false);
      alert("정보가 업데이트되었습니다.");
    } catch (e) {
      console.error(e);
      alert("정보 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start bg-white font-jua">
      <Navigationbar />
      <div className="w-full max-w-2xl p-6 mt-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          {profileImage && (
            <div className="relative w-48 h-48 rounded-full overflow-hidden">
              <img
                src={profileImage}
                alt="Profile Image"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold mt-4">{userInfo.name}</h1>
          <button
            type="button"
            onClick={() => router.push("/gallery")}
            className="bg-main-color text-white font-jua py-2 px-4 rounded mt-4"
          >
            대표 이미지 변경하기
          </button>
        </div>
        <form>
          <div className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700">이름:</label>
              <input
                type="text"
                name="name"
                value={editedUserInfo.name || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">생일:</label>
              <input
                type="date"
                name="birthday"
                value={editedUserInfo.birthday || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">성별:</label>
              <select
                name="gender"
                value={editedUserInfo.gender === "남성" ? "남성" : "여성"}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              >
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">키:</label>
              <input
                type="number"
                name="height"
                value={editedUserInfo.height || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">몸무게:</label>
              <input
                type="number"
                name="weight"
                value={editedUserInfo.weight || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">MBTI:</label>
              <select
                name="mbti"
                value={editedUserInfo.mbti || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              >
                {mbtiTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">종교:</label>
              <select
                name="religion"
                value={editedUserInfo.religion || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              >
                {religionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">음주량:</label>
              <select
                name="drinkAmount"
                value={editedUserInfo.drinkAmount || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              >
                {drinkingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">흡연여부:</label>
              <select
                name="smoke"
                value={editedUserInfo.smoke ? "예" : "아니오"}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              >
                <option value="예">예</option>
                <option value="아니오">아니오</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">주소:</label>
              <input
                type="text"
                name="address"
                value={editedUserInfo.address || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                readOnly={!isEditing}
              />
            </div>
            {isEditing ? (
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-main-color text-white font-jua py-2 px-4 rounded"
                >
                  완료
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white font-jua py-2 px-4 rounded"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-main-color text-white font-jua py-2 px-4 rounded"
                >
                  수정하기
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;
