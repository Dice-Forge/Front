import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axios";

const actionGetSheets = createAsyncThunk(
  'sheet/GET_SHEETS',
  async () => {
    
    const response = await axiosInstance.get(
      'http://localhost:3000/api/binder'
    );
    return(response.data);
  }
  
);

export { actionGetSheets };
