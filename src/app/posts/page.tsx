"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  addNewPost,
  deletePost,
  setCurrentPage,
} from "../../redux/slices/postsSlice";
import { AppDispatch, RootState } from "../../redux/store";

export default function Posts() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch<AppDispatch>(); // Inisialisasi dispatch untuk mengirim action Redux
  const { items, currentPage, itemsPerPage, status, error } = useSelector(
    (state: RootState) => state.posts // Mengambil state dari Redux store
  );

  // Mengambil posts saat komponen pertama kali di-render
  useEffect(() => {
    dispatch(fetchPosts()); // Dispatch action untuk fetch posts
  }, [dispatch]);

  // Fungsi untuk menangani submit form penambahan post baru
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(addNewPost({ title, completed: false })); // Dispatch action untuk menambah post baru
    setTitle("");
  };

  // Fungsi untuk menghapus post berdasarkan id
  const handleRemovePost = (postId: number) => {
    dispatch(deletePost(postId)); // Dispatch action untuk menghapus post
  };

  // Fungsi untuk mengubah halaman pada pagination
  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage)); // Dispatch action untuk mengubah halaman
  };

  // Menghitung total halaman berdasarkan jumlah items dan items per page
  const totalPages = Math.ceil(items.length / itemsPerPage);
  // Mengambil index awal dan akhir posts yang akan ditampilkan di halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Menyaring posts yang akan ditampilkan berdasarkan halaman
  const currentPosts = items.slice(startIndex, endIndex);

  // Menampilkan status loading jika data sedang di-fetch
  if (status === "loading") return <div>Loading...</div>;
  // Menampilkan error jika fetch gagal
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
      <ul>
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <li
              key={post.id}
              className="flex justify-between items-center gap-2 mb-4 md:mb-6 lg:mb-8"
            >
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium max-w-full">
                {post.id}. {post.title}
              </p>
              <button
                onClick={() => handleRemovePost(post.id)}
                className="text-red-500 border border-red-500 rounded px-2 hover:bg-red-500 hover:text-white md:px-4 lg:px-6"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-center">No posts</p>
        )}
      </ul>
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {/* Tambahkan wrapper untuk membuat tombol bisa digulir jika terlalu banyak */}
        <div className="overflow-x-auto flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              {index + 1}
            </button>
          ))}
        </div>

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
