import { getData, postData, putData } from '@/app/api/api'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

type Props = {
  setOpenTeamJoinModal: () => void;
}

type groupObjectType = {
  id: string;
  title: string;
  content: string;
  gender: string;
  status: string;
  members: string[];
  profileImages: string[]
}

//

const TeamJoinModal = ({ setOpenTeamJoinModal }: Props) => {
  const [groupObjects, setGroupObjects] = useState<groupObjectType[]>([]);
  const [mongoDBuserId, setMongoDBUserId] = useState<string>("");

  // useEffect(() => {

  //   const getUserData = async () => {
  //     try {
  //       const userData = await getData(`/users/${localStorage.getItem('user_id')}/profile`, 'honjaya')
  //       console.log(userData.data.name)
  //       console.log(userData.data.gender)
  //       setCurrentUser(() => [userData.data.name, userData.data.gender]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   const getGroupChatServerUser = async () => {
  //     try {
  //       const response = await getData(`/user/${localStorage.getItem('user_id')}`, "groupChat")
  //       console.log(response.json());
  //       setExistUser(true) 
  //     } catch (error) {
  //       setExistUser(false);
  //       console.log(error);
  //     }
  //   }

  //   getUserData();
  //   getGroupChatServerUser();

  // }, [])

  useEffect(() => {

    const getMongoDBdata = async () => {
      try {
        const userData = await getData(`/user/${localStorage.getItem('user_id')}`, "groupChat");
        setMongoDBUserId(userData.id);
      } catch (error) {
        console.log(error);
      }
    }

    const getGroupObjects = async () => {
      try {
        const response = await getData(`/group/list`, "groupChat");
        console.log(response);
        const objects = response;
        setGroupObjects(() => (objects.filter((object: any) => {
          if (object.gender === localStorage.getItem("userGender")) {
            return true;
          }
        })))
      } catch (e) {
        console.log(e);
      }
    }

    getMongoDBdata();
    getGroupObjects();
  }, [])

  // useEffect(() => {
  //   if (!existUser && (currentUser[0] !== "") && (currentUser[1] !== "")) {
  //     console.log(currentUser)
  //     const data = {
  //       memberId: localStorage.getItem('user_id'),
  //       name: currentUser[0],
  //       gender: (currentUser[1] === "남성" ? "MALE" : "FEMALE"),
  //     }

  //     console.log(data)

  //     const postGroupChatServerUser = async () => {
  //       try {
  //         await postData(`/user`, data, "groupChat")
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     postGroupChatServerUser();
  //   }

  // }, [existUser])


  const exitModal = () => {
    setOpenTeamJoinModal();
  }

  const handleSelectGroup = (objectLeaderId: string) => {
    if (mongoDBuserId !== objectLeaderId) {
      const apply = async () => {
        try {
          const Data = {
            leaderUserId: objectLeaderId,
            invitedUserId: mongoDBuserId,
          }

          await putData('/user/apply', Data, "groupChat");
          setOpenTeamJoinModal();
        } catch (e) {
          console.log(e)
        }
      }
      apply();
    }
  }

  return (
    <div className="z-20 w-screen h-screen flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
      <form className='z-30 absolute flex-col flex justify-around items-center bg-white w-4/10 h-7/10 border-main-color border-4 rounded-lg'>
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
        <div className='w-full h-9/10 flex-col flex justify-around items-center'>
          <div className='w-8/10 h-7/10 border-2 border-main-color overflow-auto'>
            {groupObjects.map((object, index) => (
              <div className="w-full h-1/10 flex border-2 hover:border-main-color hover:border-2" key={index}>
                <div className='w-9/10 h-full flex'>
                  {object.title}
                </div>
                <button
                  type='button'
                  onClick={() => handleSelectGroup(object.members[0])}
                  className='w-1/10 h-full text-lg border-main-color bg-main-color'
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  )
}

export default TeamJoinModal