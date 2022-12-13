import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { RootState } from '../redux/store';

const axiosInstance = axios.create({
  baseURL: 'https://bookstore-api-370618.lm.r.appspot.com/',
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const store = localStorage.getItem('persist:root') as string | null;

    if (store) {
      const parsedStore = JSON.parse(store) as RootState;

      if (parsedStore.user.token && config.headers) {
        config.headers['Authorization'] = `Bearer ${parsedStore.user.token}`;
      }
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
