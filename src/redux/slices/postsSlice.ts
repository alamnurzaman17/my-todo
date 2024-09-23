import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Definisi interface untuk struktur data Post
interface Post {
  id: number;
  title: string;
  completed: boolean;
}

// Definisi interface untuk state posts
interface PostsState {
  items: Post[];
  currentPage: number;
  itemsPerPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  nextId: number;
}

// State awal posts
const initialState: PostsState = {
  items: [],
  currentPage: 1, // Halaman default adalah halaman pertama
  itemsPerPage: 10, // 10 post per halaman
  status: 'idle',
  error: null,
  nextId: 0, // nextId akan diatur setelah data awal difetch
};

// Thunk untuk fetch data posts dari API secara asynchronous
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    // Fetch data dari endpoint API
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json() as Promise<Post[]>;
  }
);

// Slice untuk mengelola state posts
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Reducer untuk mengubah halaman saat ini
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload; 
    },
     // Reducer untuk menambah post baru
    addNewPost: (state, action: PayloadAction<Omit<Post, "id">>) => {
      const newPost = { ...action.payload, id: state.nextId };
      state.items.push(newPost);
      state.nextId += 1;
      // Urutkan daftar post berdasarkan ID secara descending (terbaru di atas)
      state.items.sort((a, b) => b.id - a.id);
    },
    // Reducer untuk menghapus post berdasarkan ID
    deletePost: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((post) => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
    // Ketika proses fetch posts sedang berlangsung
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
       // Ketika fetch posts berhasil
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded';
        state.items = action.payload.sort((a, b) => b.id - a.id); // Sort in descending order
        state.nextId = Math.max(...state.items.map(item => item.id)) + 1;  // Tentukan ID berikutnya berdasarkan ID terbesar di daftar
      })
      // Ketika fetch posts gagal
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      });
  },
});

// Export reducers yang bisa digunakan oleh komponen
export const { setCurrentPage, addNewPost, deletePost } = postsSlice.actions;
// Export reducer untuk digunakan dalam store Redux
export default postsSlice.reducer;