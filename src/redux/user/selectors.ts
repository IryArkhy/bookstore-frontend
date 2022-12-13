import { RootState } from '../store';

export const getUser = (store: RootState) => store.user.data;
export const getToken = (store: RootState) => store.user.token;
