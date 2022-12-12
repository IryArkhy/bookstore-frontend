export const ROUTES = {
  BASE: '/',
  LOGIN: '/login',
  BOOKS_LIST: '/books',
  BOOK: {
    INDEX: '/books/:bookID',
    createPath: function createPath(id: string): string {
      return this.INDEX.replace(':bookID', id);
    },
  },
  USER_ACCOUNT: '/profile',
};
