import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id: number;
  title: string;
  completed: boolean;
}

interface PostsState {
  items: Post[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 10,
  status: 'idle',
  error: null
};

// Fetch posts dari API
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page: number) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    return { data, totalCount: parseInt(response.headers.get('x-total-count') || '0', 10) };
  }
);

// Menambahkan post baru
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (newPost: Omit<Post, "id">) => {
    // Disini kita simulasikan penambahan data tanpa mengubah data asli API
    return { id: Math.random(), ...newPost }; // Simulasi ID dengan angka acak
  }
);

// Menghapus post
export const deletePostAsync = createAsyncThunk(
  "posts/deletePostAsync",
  async (id: number) => {
    // Disini kita simulasikan penghapusan data tanpa mengubah data asli API
    return id;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<{ data: Post[], totalCount: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.totalItems = action.payload.totalCount;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(addNewPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items.unshift(action.payload); // Tambahkan item baru di depan daftar
        state.totalItems += 1; // Tingkatkan total item
      })
      .addCase(deletePostAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
        state.totalItems -= 1; // Kurangi total item
      });
  },
});

export const { setCurrentPage } = postsSlice.actions;
export default postsSlice.reducer;
