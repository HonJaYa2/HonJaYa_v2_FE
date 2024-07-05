'use client'

import { useEffect, useState } from "react";
import CustomNumberInput from "../../customNum";
import Image from "next/image";
import { getData, postData } from "@/app/api/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/reducers/rootReducer";
import { joinGroup } from "@/state/actions";

type Props = {
  setOpenTeamCreateModal: () => void;
}

const TeamCreateModal = ({ setOpenTeamCreateModal }: Props) => {
  const [title, setTitle] = useState<string>("")
  const [numOfMembers, setNumoOfMembers] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [groupChatServerId, setGroupChatServerId] = useState<string>("");
  // const onGroup = useSelector((state:RootState) => state.onGroup.onGroup)
  const dispatch = useDispatch()

  useEffect(() => {
    const getGroupChatServerUser = async () => {
      try {
        const response = await getData(`/user/${localStorage.getItem('user_id')}`, "groupChat")
        console.log(response);
        setGroupChatServerId(response.id)
      } catch (error) {
        console.log(error);
      }
    }
    getGroupChatServerUser();
  }, []);

  const exitModal = () => {
    setOpenTeamCreateModal();
  }

  const handleClick = async () => {
    const groupData = {
      title: title,
      content: description,
      gender: (localStorage.getItem("userGender")),
      status: "모집중",
      members: [groupChatServerId, ],
      // profileImages: ["방장프로필url", ]
    }

    try {
      await postData("/group", groupData, "groupChat");
      // dispatch(joinGroup())
      setOpenTeamCreateModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="z-20 w-screen h-screen flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
      <form className='z-30 absolute bg-white w-4/10 h-7/10 border-main-color border-4 rounded-lg flex-col justify-around'>
      <div className="w-full h-1/10 pr-4 flex flex-col items-end justify-end box-border p-1">
          <button
            type="button"
            className="w-1/10 h-6/10 text-white outline-none rounded-sm bg-main-color hover:ring-2 hover:ring-red-100 active:mt-1 active:border-none active:ring-0"
            onClick={exitModal}>
            <div className="w-full h-full flex-col flex items-center justify-center text-center outline-none active:border-l-gray-500 active:border-t-gray-500 active:border-b-white active:border-r-white active:border-2">
              X
            </div>
          </button>
        </div>
        <div className="w-full h-9/10 flex-col flex items-center justify-around">
          <input
            type="text"
            placeholder="Team Name"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" w-1/2 h-1/10 border-main-color border-b-2 text-center outline-none  "
          ></input>
          {/* <div className="w-1/2 h-2/10 flex justify-center items-center">
            <input
              type="number"
              id="numofmembers"
              name="numofmembers"
              min={1}
              max={3}
              value={numOfMembers}
              onChange={(e: any) => setNumoOfMembers(Number(e.target.value))}
              className="outline-none w-full h-full text-center"
            >
            </input><span>명</span>
          </div> */}
          <textarea
            placeholder=" Introduce Your Team...."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" w-8/10 h-5/10 box-border p-2 border-main-color border-2 flex flex-col justify-center items-center rounded-xl outline-none resize-none"
          ></textarea>
          <button type="button" onClick={handleClick} className="w-5/10 h-1/10 font-jua text-lg text-white shadow-sm bg-gradient-to-r from-main-color to-orange-300 rounded-md hover:ring-4 hover:ring-red-100 active:bg-gradient-to-bl">제출하기</button>
        </div>
      </form>
    </div>
  )
}

export default TeamCreateModal
