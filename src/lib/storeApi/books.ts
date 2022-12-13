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
