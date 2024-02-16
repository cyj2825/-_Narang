import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://react-http2-9845e-default-rtdb.asia-southeast1.firebasedatabase.app/"; //바꿀 예정

export const loadTrip = createAsyncThunk(
  "get/loadTrip",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// 현재는 겟으로 어떤 정보가 들어올지 확실치 않음. 전체 데이터를 다 가져오는 것이 아닌 pagination이 섞여 들어와야 할 것.