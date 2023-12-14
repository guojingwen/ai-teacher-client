import { RootState } from '.';
import { ResUserInfo, ResUserNotLogin } from '../api/apiType';
import { createSlice } from '@reduxjs/toolkit';

const defaultData: ResUserInfo | ResUserNotLogin = { isLogin: false };

const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: defaultData,
  },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = defaultData;
    },
  },
});
export default userSlice.reducer;

export const getUserState = (state: RootState) => state.user.value;

export const { login, logout } = userSlice.actions;
