import { RootState } from '../redux/store';

export const getToken = () => {
  const store = localStorage.getItem('persist:root');

  if (store) {
    const { user } = JSON.parse(store) as { user: string };
    const parsedUser = JSON.parse(user) as RootState['user'];

    return parsedUser.token;
  }

  return null;
};
