import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface JourneyState {
     loading: "idle" | "loading" | "succeeded" | "failed";
     featuredDrills: any[] | null;
     paceDrills: any | null;
     badges: any[] | null
     logs: any[] | null
     error: any;
}

const initialState: JourneyState = {
     featuredDrills: [],
     paceDrills: [],
     loading: "idle",
     badges: [],
     logs: [],
     error: null,
}

export const fetchJournies = createAsyncThunk(
     "journey/fetchJournies",
     async (videoId, { rejectWithValue }) => {
       try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/journies`);
         return response.data;
       } catch (error: any) {
         return rejectWithValue(error.response.data);
       }
     }
   );

const journeySlice = createSlice({
     name: "journey",
     initialState,
     reducers: {},
     extraReducers: (builder) => {
          builder.addCase(fetchJournies.pending, (state, action) => {
               state.loading = "loading";
          });
          builder.addCase(fetchJournies.fulfilled, (state, action) => {
               state.featuredDrills = action.payload;
               state.loading = "succeeded";
          });
          builder.addCase(fetchJournies.rejected, (state, action) => {
               state.error = action.payload;
               state.loading = "failed";
          })
     }
})

export default journeySlice.reducer