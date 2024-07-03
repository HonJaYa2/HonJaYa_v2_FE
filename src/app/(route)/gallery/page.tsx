'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { getData, postData, deleteData } from '@/app/api/api';
import { useRouter } from 'next/navigation';
import Navigationbar from '@/app/_components/common/Navigationbar';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

interface ProfileImageDto {
  id: number;
  imageUrl: string;
  primary: boolean;
  kakaoImage: boolean;
}

const GalleryPage = () => {
  const [profileImages, setProfileImages] = useState<ProfileImageDto[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("")
  const router = useRouter();


  useEffect(() => {
    const id = localStorage.getItem('user_id')
    if (id) {
      fetchProfileImages();
      setUserId(id);
    }
  }, []);

  const fetchProfileImages = async () => {
    try {
      const response = await getData(`/users/${userId}/profile-images`, 'honjaya');
      setProfileImages(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append('multipartFiles', e.target.files[i]);
      }

      try {
        const header = {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        }
        const response = await fetch(`http://localhost:8080/api/users/${userId}/profile-images`, {
          method: 'POST',
          body: formData,
          headers: header,
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchProfileImages(); // 업로드 후 갤러리 갱신
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const toggleImageSelection = (imageId: number) => {
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = new Set(prevSelectedImages);
      if (newSelectedImages.has(imageId)) {
        newSelectedImages.delete(imageId);
      } else {
        newSelectedImages.add(imageId);
      }
      return newSelectedImages;
    });
  };

  const handleSetPrimaryImage = async () => {
    if (selectedImages.size !== 1) {
      alert("대표 이미지는 하나의 이미지만 설정할 수 있습니다.");
      return;
    }
    const primaryImageId = Array.from(selectedImages)[0];
    try {
      await postData(`/users/${userId}/profile-images/${primaryImageId}`, {}, 'honjaya');
      alert("대표 이미지가 설정되었습니다.");
      fetchProfileImages();
      setSelectedImages(new Set());
      setIsEditing(false);
    } catch (error) {
      console.error('Error setting primary image:', error);
    }
  };

  const handleDeleteImages = async () => {
    if (selectedImages.size === 0) {
      alert("삭제할 이미지를 선택하세요.");
      return;
    }
    const deleteDto = {
      profileImagesIds: Array.from(selectedImages),
    };
    const response = await deleteData(`/users/${userId}/profile-images`, deleteDto, 'honjaya');
    if (response.status === "error") {
      alert(response.message);
      return;
    }
    alert("선택한 이미지가 삭제되었습니다.");
    fetchProfileImages();
    setSelectedImages(new Set());
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-white font-jua">
      <Navigationbar />
      <div className="w-full max-w-2xl p-6 mt-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">프로필 이미지 갤러리</h1>
        <div className='mb-6'>
          {isEditing ? (
            <div className="mt-6 flex justify-evenly">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white font-jua py-2 px-4 rounded"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSetPrimaryImage}
                className="bg-main-color text-white font-jua py-2 px-4 rounded"
              >
                대표 이미지 설정하기
              </button>
              <button
                type="button"
                onClick={handleDeleteImages}
                className="bg-red-500 text-white font-jua py-2 px-4 rounded"
              >
                삭제하기
              </button>
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-main-color text-white font-jua py-2 px-4 rounded"
              >
                편집하기
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FaCamera size={48} color="gray" />
          </div>
          {profileImages.map((image) => (
            <div
              key={image.id}
              className={`relative w-48 h-48 rounded-lg cursor-pointer ${selectedImages.has(image.id) ? 'border-4 border-blue-500' : ''}`}
              onClick={() => isEditing && toggleImageSelection(image.id)}
            >
              <img
                src={image.imageUrl}
                alt={`Profile Image ${image.id}`}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              {image.primary && (
                <div className="absolute top-2 left-2 bg-main-color text-white px-2 py-1 rounded z-10">
                  대표 이미지
                </div>
              )}
              {image.kakaoImage && (
                <div className="absolute bottom-2 right-2 bg-yellow-300 text-black px-2 py-1 rounded z-10">
                  카카오 이미지
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="bg-main-color text-white font-jua py-2 px-4 rounded mt-6"
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default GalleryPage;