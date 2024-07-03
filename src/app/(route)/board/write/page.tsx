"use client";

import Navigationbar from "@/app/_components/common/Navigationbar";
import { postData } from "@/app/api/api";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("RECRUITMENT");
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "모집글" ? "RECRUITMENT" : "REVIEW";
    setCategory(value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      title,
      category,
      content
    };
    try {
      const response = postData("/boards", data, "honjaya");
      alert("게시물이 등록되었습니다.")
      router.push("/board");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-white">
      <Navigationbar />
      <h1 className="text-3xl font-jua text-center mt-6 mb-6">게시물 작성하기</h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-6 font-jua">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              카테고리
            </label>
            <select
              id="category"
              value={category === "RECRUITMENT" ? "모집글" : "후기"}
              onChange={handleCategoryChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="모집글">모집글</option>
              <option value="후기">후기</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="내용을 입력하세요"
              rows={10} // 숫자로 설정
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-main-color text-white font-jua py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              제출
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;