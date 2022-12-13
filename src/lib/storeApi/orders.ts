import axiosInstance from '../axios';
import { BookBase } from './books';

export enum OrderStatus {
  processing = 'PROCESSING',
  confirmed = 'CONFIRMED',
  inProgress = 'IN_PROGRESS',
  canceled = 'CANCELED',
  done = 'DONE',
}

export type UserOrderBase = {
  id: string;
  createdAt: string;
  userID: string;
  status: OrderStatus;
  totalPrice: number;
};

export type UserProfileOrderItem = {
  id: string;
  orderID: string;
  amount: 5;
  bookId: string;
  totalPrice: 170;
};

export type UserProfileOrder = UserOrderBase & {
  items: UserProfileOrderItem[];
};

export const fetchUserOrders = async () => {
  return await axiosInstance.get<{ orders: UserProfileOrder[] }>('/api/order');
};

export type OrderInfoItem = UserProfileOrderItem & {
  amount: number;
  totalPrice: number;
  book: BookBase;
};

export type OrderInfo = UserOrderBase & {
  items: OrderInfoItem[];
};

export const fetchOrderByID = async (id: string) => {
  return await axiosInstance.get<{ order: OrderInfo }>(`/api/order/${id}`);
};
