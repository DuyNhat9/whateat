import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    userName: null,
    token: null,
    userId: null,
  },
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.userInfo.userName = action.payload.userName;
      state.userInfo.token = action.payload.token;
      state.userInfo.userId = action.payload.userId;
    },
  },
});

const { loginSuccess } = auth.actions;

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const res = await axios.post(
      `${process.env.REACT_APP_ASP_API_KEY}/api/auth/login`,
      {
        email,
        password,
      }
    );
    dispatch(loginSuccess(res.data));
  };

export default auth.reducer;
