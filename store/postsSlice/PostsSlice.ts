import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
interface VideoState {
  loading: "idle" | "loading" | "succeeded" | "failed";
  videoData: any | null; // Replace 'any' with the actual type of video data
  userToken: string | null;
  error: any;
  comments: any[]; // Replace 'any' with the actual type of comments
  replies: any[]; // Replace 'any' with the actual type of replies
}

const initialState: VideoState = {
  videoData: null,
  userToken: null, // Add userToken here
  loading: "idle",
  error: null,
  comments: [],
  replies: [],
};

// Define an async action to fetch video data
export const fetchVideoData = createAsyncThunk(
  "video/fetchVideoData",
  async (videoId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`/posts/${videoId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define an async action to fetch comments
export const fetchComments = createAsyncThunk(
  "video/fetchComments",
  async (videoId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`/posts/${videoId}/comment`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define an async action to fetch replies on comments
export const fetchReplies = createAsyncThunk(
  "video/fetchReplies",
  async (videoId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`/posts/comments/${videoId}/reply`, {
        params: {
          page: 1,
          limit: 3,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a slice
const postsSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle the success and error cases for fetchVideoData
    builder.addCase(fetchVideoData.fulfilled, (state, action) => {
      state.videoData = action.payload;
      state.loading = "succeeded";
    });
    builder.addCase(fetchVideoData.pending, (state) => {
      state.loading = "loading";
    });
    builder.addCase(fetchVideoData.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = "failed";
    });

    // Handle the success and error cases for fetchComments
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
    builder.addCase(fetchComments.pending, (state) => {
      // Handle loading state if needed
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      // Handle error state if needed
    });

    // Handle the success and error cases for fetchReplies
    builder.addCase(fetchReplies.fulfilled, (state, action) => {
      state.replies = action.payload;
    });
    builder.addCase(fetchReplies.pending, (state) => {
      // Handle loading state if needed
    });
    builder.addCase(fetchReplies.rejected, (state, action) => {
      // Handle error state if needed
    });
  },
});

export default postsSlice.reducer;
