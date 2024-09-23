import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = [
    {id: 1, title: 'Yo Te Amo', completed: 'false'},
];

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<any>) => {
            const {id, title, completed} = action.payload;
            state.push({id, title, completed});
        },
        deletePost: (state, action: PayloadAction<any>) => {
            const postId = action.payload;
            return state.filter((post: any) => post.id !== postId);
        },
    },
});

export const { addPost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;