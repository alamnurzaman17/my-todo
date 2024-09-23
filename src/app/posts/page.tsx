"use client";

import { useSelector, useDispatch } from "react-redux";
import { addPost, deletePost } from "@/redux/slices/postsSlice";
import { useState } from "react";
import React from "react";

const Posts = () => {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.posts);

  const handleAddPost = (e: any) => {
    e.preventDefault();
    if (!title) {
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title,
    };

    dispatch(addPost(newPost));

    setTitle("");
  };

  const handleRemovePost = (postId: any) => {
    dispatch(deletePost(postId));
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-4">
      <form className="flex gap-2 justify-between mb-4 md:mb-6 lg:mb-8">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded p-2 mr-2 md:p-4"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button
          onClick={handleAddPost}
          className="border border-gray-300 rounded p-2 hover:bg-gray-300 md:p-4"
        >
          Add New Todo{" "}
        </button>
      </form>
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 lg:mb-8 text-center">
        My Todo List
      </h1>
      {posts ? (
        posts.map((post: any) => (
          <div
            key={post.id}
            className="flex justify-between items-center gap-2 mb-4 md:mb-6 lg:mb-8"
          >
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
    </div>
  );
};

export default Posts;
