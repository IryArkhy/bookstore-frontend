import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { BookBase } from '../../lib/storeApi/books';

export type CartItem = Pick<BookBase, 'author' | 'asset' | 'id' | 'price' | 'title'> & {
  amount: number;
};

type CartState = {
  items: {
    [id: string]: CartItem;
  };
};

const initialState: CartState = {
  items: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }: PayloadAction<Omit<CartItem, 'amount'>>) => {
      state.items = { ...state.items, [payload.id]: { ...payload, amount: 1 } };
    },

    addOneMoreItem: (state, { payload }: PayloadAction<{ bookId: BookBase['id'] }>) => {
      /**
    *    state.items = state.items.map((item) =>
        item.id === payload.bookId ? { ...item, amount: item.amount + 1 } : item,
      );
    */
      const itemToModify = { ...state.items[payload.bookId] };

      state.items[payload.bookId] = { ...itemToModify, amount: itemToModify.amount + 1 };
    },

    decreaseByOneItem: (state, { payload }: PayloadAction<{ bookId: BookBase['id'] }>) => {
      //   state.items = state.items.reduce((arr, item) => {
      //     if (item.id === payload.bookId && item.amount > 1) {
      //       arr.push({ ...item, amount: item.amount - 1 });
      //     } else {
      //       arr.push(item);
      //     }

      //     return arr;
      //   }, [] as CartItem[]);

      const itemToModify = { ...state.items[payload.bookId] };

      if (itemToModify.amount === 1) {
        delete state.items[payload.bookId];
      } else {
        state.items[payload.bookId] = { ...itemToModify, amount: itemToModify.amount - 1 };
      }
    },

    removeFromCart: (state, { payload }: PayloadAction<{ bookId: BookBase['id'] }>) => {
      //   state.items = [...state.items].filter((item) => item.id !== payload.bookId);

      delete state.items[payload.bookId];
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, addOneMoreItem, decreaseByOneItem, removeFromCart, clearCart } =
  cartSlice.actions;

export const cartReducer = cartSlice.reducer;
