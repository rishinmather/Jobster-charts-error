import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

import { logoutUser } from "../User/userslice";
import { showLoading, hideLoading, getAlljobs } from "../AllJobs/AllJobsSlice";
import { clearValues } from "./jobSlice";

export const createJobThunk = async (job, thunkAPI) => {
  try {
    const resp = await customFetch.post("/jobs", job);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    if (error.response.status === 401) {
      thunkAPI.dispatch(logoutUser());
      return thunkAPI.rejectWithValue("unauthorized ! Logging out...");
    }
    thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
export const deletejobThunk = async (jobId, thunkAPI) => {
  console.log(jobId);
  thunkAPI.dispatch(showLoading());

  try {
    const resp = await customFetch.delete(`/jobs/${jobId}`);
    thunkAPI.dispatch(getAlljobs());
    console.log(resp);
    toast.success("job deleted");
    return resp.data.msg;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const editJobthunk = async ({ jobId, job }, thunkAPI) => {
  console.log(jobId, job);
  try {
    const resp = await customFetch.patch(`/jobs/${jobId}`, job);
    console.log(resp);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
