import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  nickname : "알랑가몰랑가",
  token: null,
  refreshToken: null,
  userId : "",
  alertAmount : -2,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Login: (state, action) => {
      state.isLogin = true; // 로그인
      state.token = action.payload.token; // 이거 유효성 체크 조금이라도 넣어봅시다.
      state.refreshToken = action.payload.refreshToken; 
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      window.sessionStorage.setItem("token", action.payload.token);
      window.sessionStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    Setting: (state, action) => {
      state.token = action.payload.token; // 이거 유효성 체크 조금이라도 넣어봅시다.
      state.refreshToken = action.payload.refreshToken; 
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      window.sessionStorage.setItem("token", action.payload.token);
      window.sessionStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    Logout: (state) => {
      state.isLogin = false; // 로그아웃
      state.token = "";
      state.refreshToken = "";
      state.userId = "";
      state.nickname = "알랑가몰랑가";
      state.alertAmount = -2;
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("refreshToken");
    },
    SetAlertAmount: (state, action) => {
      state.alertAmount = action.payload.alertAmount
    }
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
