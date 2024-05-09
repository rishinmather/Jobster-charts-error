import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

const initialFiltersState = {
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const initialState = {
  isLoading: true,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAlljobs = createAsyncThunk(
  "allJobs/getjobs",
  async (_, thunkAPI) => {
    let url = "/jobs";

    try {
      const resp = await customFetch.get(url);
      // console.log(resp);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("There was an error");
    }
  }
);

export const showStats = createAsyncThunk(
  "allJobs/showStats",
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch("/jobs/stats");
      console.log(resp.data);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const allJobsSlice = createSlice({
  name: "allJobs",
  initialState: initialState,

  reducers: {
    showLoading: (state, action) => {
      state.isLoading = true;
    },

    hideLoading: (state, action) => {
      state.isLoading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAlljobs.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAlljobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(getAlljobs.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      })
      .addCase(showStats.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(showStats.fulfilled, (state, action) => {
        state.isLoading = false;

        state.stats = action.payload.defaultStats;
        state.monthlyApplications = action.payload.monthlyApplications;
      })
      .addCase(showStats.rejected, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload);
      });
  },
});
export const { showLoading, hideLoading } = allJobsSlice.actions;
export default allJobsSlice.reducer;
