import axiosInstance from '../axios';

export type Genre = {
  id: string;
  name: string;
};

export const fetchGenres = async () => {
  return await axiosInstance.get<{ genres: Genre[] }>('api/genre');
};
