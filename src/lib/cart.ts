import {
  CartItem,
  addOneMoreItem,
  addToCart,
  clearCart,
  decreaseByOneItem,
  removeFromCart,
} from '../redux/cart/cartSlice';
import { getCartItems } from '../redux/cart/selectors';
import { useDispatch, useSelector } from '../redux/hooks';

export const calculateTotalPrice = (items: CartItem[]) =>
  items.reduce((acc, { price, amount }) => {
    acc += price * amount;
    return acc;
  }, 0);

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(getCartItems);

  const addBookToCart = (book: Omit<CartItem, 'amount'>) => {
    const { id, title, author, asset, price } = book;
    dispatch(addToCart({ id, title, author, asset, price }));
  };

  const addOneMoreBookToCart = (bookID: CartItem['id']) => {
    dispatch(addOneMoreItem({ bookId: bookID }));
  };

  const decreaseBookAmount = (bookID: CartItem['id']) => {
    dispatch(decreaseByOneItem({ bookId: bookID }));
  };

  const removeBookFromCart = (bookID: CartItem['id']) => {
    dispatch(removeFromCart({ bookId: bookID }));
  };

  const clear = () => {
    dispatch(clearCart);
  };

  const cartItemsCount = Object.keys(cartItems).length;

  return {
    cartItems,
    cartItemsCount,
    cartActions: {
      addBookToCart,
      addOneMoreBookToCart,
      decreaseByOneItem,
      removeBookFromCart,
      decreaseBookAmount,
      clearCart,
      clear,
    },
  };
};
