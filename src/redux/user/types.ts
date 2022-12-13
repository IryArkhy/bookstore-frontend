export type User = {
  id: string;
  email: string;
  username: string;
  name: null | string;
  surname: null | string;
  createdAt: string;
  role: 'ADMIN' | 'BASE';
};
