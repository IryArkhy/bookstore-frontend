import axiosInstance from '../axios';

import { Author } from './authors';
import { Genre } from './genres';

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

export type GenreOnBook = {
  genre: Genre;
};

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
  rating: number | null;
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

export const postBookComment = async (data: {
  bookID: string;
  authorID: string;
  rating: number | null;
  comment: string;
}) => {
  const { bookID, authorID, comment, rating } = data;
  return await axiosInstance.post<{ comments: BookComments[] }>(
    `api/book/comment/${bookID}/${authorID}`,
    {
      rating,
      comment,
    },
  );
};

export type BooksListItem = {
  id: string;
  title: string;
  price: number;
  author: Author;
  bookAssest: BookAsset | null;
};

export type BooksList = {
  books: BooksListItem[];
  count: number;
  limit: number;
  offset: number | null;
};

export const fetchBooks = async (data: {
  offset: number;
  limit: number;
  genres: Genre['name'][];
  year?: BookBase['year'];
}) => {
  const { offset, limit, year, genres } = data;

  const queryData: Record<string, any> = {};

  if (year) {
    queryData.year = year;
  }

  if (genres.length) {
    queryData.genre = genres.join(',');
  }

  const query = Object.entries(queryData).reduce(
    (q, [key, value]) => q.concat(`&${key}=${value}`),
    '',
  );

  return await axiosInstance.get<BooksList>(`api/book/?offset=${offset}&limit=${limit}${query}`);
};

export const searchBook = async (query: string) => {
  return await axiosInstance.get<Pick<BooksList, 'books' | 'count'>>(
    `api/book/search?query=${query}`,
  );
};
