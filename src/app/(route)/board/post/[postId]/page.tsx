"use client";

import Navigationbar from "@/app/_components/common/Navigationbar";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteData, getData, postData, putData } from "@/app/api/api";

interface Post {
  id: number;
  title: string;
  author: string;
  authorId: number;
  category: string;
  date: string;
  content: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  authorId: number;
  date: string;
  parentId: number | null;
}

const PostPage: React.FC = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newReply, setNewReply] = useState<string>("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] =
    useState<string>("");
  const router = useRouter();

  const fetchPost = async (id: number) => {
    try {
      const response = await getData(`/boards/${id}`, "honjaya");
      const data = response.data;
      setPost(data);
      console.log(data.author);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const fetchComments = async (id: number) => {
    try {
      const response = await getData(`/boards/${id}/comments`, "honjaya");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleNewCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleNewReplyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReply(e.target.value);
  };

  const handleNewCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await postData(
        `/boards/${postId}/comments`,
        { content: newComment, parentId: null },
        "honjaya"
      );
      setNewComment("");
      fetchComments(Number(postId));
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleNewReplySubmit = async (
    e: FormEvent<HTMLFormElement>,
    parentId: number
  ) => {
    e.preventDefault();
    try {
      await postData(
        `/boards/${postId}/comments`,
        { content: newReply, parentId },
        "honjaya"
      );
      setNewReply("");
      setReplyToCommentId(null);
      fetchComments(Number(postId));
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteData(`/comments/${commentId}`, "", "honjaya");
      fetchComments(Number(postId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditingCommentContent(e.target.value);
  };

  const handleEditCommentSubmit = async (
    commentId: number,
    parentId: number | null
  ) => {
    try {
      await putData(
        `/comments/${commentId}`,
        { content: editingCommentContent, parentId },
        "honjaya"
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
      fetchComments(Number(postId));
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteData(`/boards/${postId}`, "", "honjaya");
      alert("게시물이 삭제되었습니다.");
      router.push("/board");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost(Number(postId));
      fetchComments(Number(postId));
    }
  }, [postId]);

  const renderComments = (parentId: number | null = null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className="mt-4 mb-4 p-4 border rounded shadow">
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editingCommentContent}
                onChange={handleEditCommentChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              ></textarea>
              <button
                onClick={() =>
                  handleEditCommentSubmit(comment.id, comment.parentId)
                }
                className="bg-green-500 text-white text-sm py-1 px-2 rounded mt-2"
              >
                완료
              </button>
            </div>
          ) : (
            <div>
              <div className="text-gray-700 mb-2">{comment.content}</div>
              <div className="text-gray-600 text-sm">
                <span className="mr-4">글쓴이: {comment.author}</span>
                <span>작성일자: {comment.date}</span>
              </div>
              {Number(localStorage.getItem("user_id")) === comment.authorId ? (
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingCommentContent(comment.content);
                    }}
                    className="bg-blue-500 text-white text-sm py-1 px-2 rounded mt-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 text-white text-sm py-1 px-2 rounded mt-2"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setReplyToCommentId(comment.id)}
                    className="bg-gray-500 text-white text-sm py-1 px-2 rounded mt-2 ml-2"
                  >
                    답글
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyToCommentId(comment.id)}
                  className="bg-gray-500 text-white text-sm py-1 px-2 rounded mt-2 ml-2"
                >
                  답글
                </button>
              )}
              {replyToCommentId === comment.id && (
                <form
                  onSubmit={(e) => handleNewReplySubmit(e, comment.id)}
                  className="mt-2"
                >
                  <textarea
                    value={newReply}
                    onChange={handleNewReplyChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="답글을 입력하세요"
                    rows={3}
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-main-color text-white font-jua py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                  >
                    답글 작성
                  </button>
                </form>
              )}
              {renderComments(comment.id)}
            </div>
          )}
        </div>
      ));
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center bg-white">
      <Navigationbar />
      <div className="w-full max-w-6xl bg-white rounded-lg shadow p-6 mt-6 font-jua">
        <h1 className="text-3xl font-jua mb-6">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          <span className="mr-4">글쓴이: {post.author}</span>
          <span className="mr-4">
            분류: {post.category === "RECRUITMENT" ? "모집글" : "후기"}
          </span>
          <span>작성일자: {post.date}</span>
        </div>
        <div className="text-gray-700 mb-6">{post.content}</div>
        {Number(localStorage.getItem("user_id")) === post.authorId ? (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => router.push(`/board/edit/${postId}`)}
              className="bg-blue-500 text-white font-jua py-2 px-4 rounded"
            >
              수정하기
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white font-jua py-2 px-4 rounded"
            >
              삭제하기
            </button>
            <button
              onClick={() => router.back()}
              className="bg-main-color text-white font-jua py-2 px-4 rounded"
            >
              뒤로가기
            </button>
          </div>
        ) : (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => router.back()}
              className="bg-main-color text-white font-jua py-2 px-4 rounded"
            >
              뒤로가기
            </button>
          </div>
        )}
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-jua mb-4">댓글</h2>
          {renderComments()}
        </div>
        <form
          onSubmit={handleNewCommentSubmit}
          className="w-full max-w-6xl mt-6"
        >
          <textarea
            value={newComment}
            onChange={handleNewCommentChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="댓글을 입력하세요"
            rows={3}
          ></textarea>
          <button
            type="submit"
            className="bg-main-color text-white font-jua py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            댓글 작성
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
