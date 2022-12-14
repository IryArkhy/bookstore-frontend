import axiosInstance from '../axios';
import { Author } from './authors';

export type BookBase = {
  id: string;
  title: string;
  asset: string; // url
  authorID: string;
  author: Author;
  description: string;
  price: number;
  year: number;
};

export type GenreOnBook = {};

export type BookAsset = {
  id: string;

  bookID: string;
  assetID: string;
  publicID: string;
  width: number;
  height: number;
  url: string;
  secureUrl: string;
};

export type BookComments = {
  id: string;
  createdAt: string;
  rating?: number;
  comment: string;
  user: {
    id: string;
    username: string;
  };
};

export type BookDetails = BookBase & {
  genres: GenreOnBook[];
  bookComments: BookComments[];
  bookAssest: BookAsset;
};

export const fetchBookByID = async (id: string, authorID: string) => {
  return await axiosInstance.get<{ book: BookDetails }>(`api/book/${id}/${authorID}`);
};
