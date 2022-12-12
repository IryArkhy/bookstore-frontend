import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from './types';

type UserSliceState = {
  data: null | User;
  token: null | string;
};

const initialState: UserSliceState = {
  token: null,
  data: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
