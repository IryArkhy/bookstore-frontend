import axiosInstance from '../axios';

export type Genre = {
  id: string;
  name: string;
};

export const fetchGenres = async (token?: string) => {
  return await axiosInstance.get<{ genres: Genre[] }>(
    'api/genre',
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {},
  );
};
