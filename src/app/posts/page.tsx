"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  addNewPost,
  deletePostAsync,
  setCurrentPage,
} from "../../redux/slices/postsSlice";
import { AppDispatch, RootState } from "../../redux/store";

export default function Posts() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: posts,
    currentPage,
    totalItems,
    itemsPerPage,
    status,
    error,
  } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(currentPage));
  }, [dispatch, currentPage]);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate the new ID by finding the max existing ID and incrementing it
    const maxId =
      posts.length > 0 ? Math.max(...posts.map((post) => post.id)) : 0;
    const newPost = { id: maxId + 1, title, completed: false };

    dispatch(addNewPost(newPost));
    setTitle("");
  };

  const handleRemovePost = async (postId: number) => {
    dispatch(deletePostAsync(postId)); // This will now only affect local state
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-4">
      <form
        onSubmit={handleAddPost}
        className="flex gap-2 justify-between mb-4 md:mb-6 lg:mb-8"
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded p-2 mr-2 md:p-4"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button
          type="submit"
          className="border border-gray-300 rounded p-2 hover:bg-gray-300 md:p-4"
        >
          Add New Todo
        </button>
      </form>
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 lg:mb-8 text-center">
        My Todo List
      </h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="flex justify-between items-center gap-2 mb-4 md:mb-6 lg:mb-8"
          >
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium max-w-full mx-2">
              {post.id}
            </p>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium max-w-full">
              {post.title}
            </p>
            <button
              onClick={() => handleRemovePost(post.id)}
              className="text-red-500 border border-red-500 rounded px-2 hover:bg-red-500 hover:text-white md:px-4 lg:px-6"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-center">No posts</p>
      )}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
