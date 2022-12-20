import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { getToken } from './localStorage';

const axiosInstance = axios.create({
  baseURL: 'https://bookstore-api-370618.lm.r.appspot.com/',
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};

export default axiosInstance;
