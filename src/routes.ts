export const ROUTES = {
  BASE: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  BOOKS_LIST: '/books',
  BOOK: {
    INDEX: '/books/:bookID',
    createPath: function createPath(id: string): string {
      return this.INDEX.replace(':bookID', id);
    },
  },
  USER_ACCOUNT: '/profile',
};
