import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { handleError, ErrorData } from '../../lib/storeApi/utils';
import { User } from './types';

export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: ErrorData }
>('user/login', async (data, thunkApi) => {
  try {
    const tokenResponse = await axiosInstance.post<{ token: string }>('/signin', {
      email: data.email,
      password: data.password,
    });

    const userResponse = await axiosInstance.get<{ user: User }>('api/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.token}`,
      },
    });

    return { token: tokenResponse.data.token, user: userResponse.data.user };
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const signUp = createAsyncThunk<
  { token: string; user: User },
  { email: string; username: string; password: string },
  { rejectValue: ErrorData }
>('user/signUp', async (data, thunkApi) => {
  try {
    const tokenResponse = await axiosInstance.post<{ token: string }>('/user', {
      email: data.email,
      username: data.username,
      password: data.password,
    });

    const userResponse = await axiosInstance.get<{ user: User }>('api/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.token}`,
      },
    });

    return { token: tokenResponse.data.token, user: userResponse.data.user };
  } catch (error) {
    const errorPayload = handleError(error);
    return thunkApi.rejectWithValue(errorPayload);
  }
});

export const fetchUser = createAsyncThunk<User, any, { rejectValue: ErrorData }>(
  'user/fetch',
  async (_, thunkApi) => {
    try {
      const res = await axiosInstance.get<{ user: User }>('api/user');
      return res.data.user;
    } catch (error) {
      const errorPayload = handleError(error);
      return thunkApi.rejectWithValue(errorPayload);
    }
  },
);
