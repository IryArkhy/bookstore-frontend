import { RootState } from '../store';

export const getCartItems = (state: RootState) => state.cart.items;
