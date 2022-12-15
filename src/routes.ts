export const ROUTES = {
  BASE: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  BOOKS_LIST: '/books',
  BOOK: {
    INDEX: '/books/:bookID/:authorID',
    createPath: function createPath(id: string, authorID: string): string {
      return this.INDEX.replace(':bookID', id).replace(':authorID', authorID);
    },
  },
  ORDER_LIST: '/orders',
  ORDER: {
    INDEX: '/orders/:orderID',
    createPath: function createPath(id: string): string {
      return this.INDEX.replace(':orderID', id);
    },
  },
  CHECKOUT: '/checkout',
  USER_ACCOUNT: '/profile',
};
