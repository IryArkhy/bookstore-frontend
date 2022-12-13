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
  ORDER_LIST: '/orders',
  ORDER: {
    INDEX: '/orders/:orderID',
    createPath: function createPath(id: string): string {
      return this.INDEX.replace(':orderID', id);
    },
  },
  SHOPPING_CART: '/shopping-cart',
  USER_ACCOUNT: '/profile',
};
