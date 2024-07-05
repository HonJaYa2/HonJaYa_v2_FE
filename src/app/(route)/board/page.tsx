"use client";

import Navigationbar from "@/app/_components/common/Navigationbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getData } from "@/app/api/api";
import { Suspense } from 'react';

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

const BoardInner: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [category, setCategory] = useState<string | null>(null);

  const fetchPosts = async (page: number, category: string | null) => {
    try {
      const endpoint = category ? `/boards?page=${page}&size=10&category=${category}` : `/boards?page=${page}&size=10`;
      const data: Page<Post> = await getData(endpoint, "honjaya");
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    setCategory(categoryParam);
    fetchPosts(page, categoryParam);
  }, [page, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleCategoryChange = (category: string) => {
    const queryParams = category ? `?category=${category}` : '';
    router.push(`/board${queryParams}`);
  };

  const handleRowClick = (postId: number) => {
    router.push(`/board/post/${postId}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`py-2 px-4 rounded ${i === page ? 'bg-main-color text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-white">
      <Navigationbar />
      <h1 className="text-3xl font-jua text-center mt-6 mb-6">게시판</h1>
      <p className="font-jua text-gray-400 mb-6">게시판에서 여러명이서 같이 채팅을 매칭할 친구들을 구해보거나 매칭 성공 후기를 남겨보세요!</p>
      <div className="w-full max-w-6xl flex justify-between mb-4 font-jua">
        <div>
          <select
            value={category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">전체</option>
            <option value="RECRUITMENT">모집글</option>
            <option value="REVIEW">후기</option>
          </select>
        </div>
        <button
          onClick={() => router.push('/board/write')}
          className="bg-main-color text-white font-jua py-2 px-4 rounded"
        >
          게시물 등록하기
        </button>
      </div>
      <div className="w-full max-w-6xl bg-white rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 text-white font-jua bg-main-color border-b border-gray-300">#</th>
              <th className="py-2 px-4 text-white font-jua bg-main-color border-b border-gray-300">제목</th>
              <th className="py-2 px-4 text-white font-jua bg-main-color border-b border-gray-300">글쓴이</th>
              <th className="py-2 px-4 text-white font-jua bg-main-color border-b border-gray-300">분류</th>
              <th className="py-2 px-4 text-white font-jua bg-main-color border-b border-gray-300">작성일자</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} onClick={() => handleRowClick(post.id)} className="cursor-pointer hover:bg-gray-100">
                <td className="py-2 px-4 border-b font-jua text-center border-gray-300">{post.id}</td>
                <td className="py-2 px-4 border-b font-jua text-center border-gray-300">{post.title}</td>
                <td className="py-2 px-4 border-b font-jua text-center border-gray-300">{post.author}</td>
                <td className="py-2 px-4 border-b font-jua text-center border-gray-300">{post.category === "RECRUITMENT" ? "모집글" : "후기"}</td>
                <td className="py-2 px-4 border-b font-jua text-center border-gray-300">{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-4 font-jua">
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="bg-gray-300 text-gray-700 py-2 px-4 mr-2 rounded disabled:opacity-50"
          >
            이전
          </button>
          <div className="flex space-x-2">
            {renderPageNumbers()}
          </div>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="bg-gray-300 text-gray-700 py-2 px-4 ml-2 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

const BoardPage: React.FC = () => {
 
  return (
   <Suspense>
    <BoardInner/>
   </Suspense>
  );
};

export default BoardPage;