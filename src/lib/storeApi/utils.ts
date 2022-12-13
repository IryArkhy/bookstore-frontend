import { isAxiosError } from 'axios';
import { isServerError, isValidationError } from './store-api';

export type ErrorData = {
  message: string;
};

export const DEFAULT_ERROR = { message: "An error ocurred, couldn't make a request" };

export function handleError(error: unknown): ErrorData {
  if (isAxiosError(error)) {
    const resData = error.response?.data;
    if (isValidationError(resData)) {
      const message = resData.errors.reduce(
        (mes, { msg, param, value }) => mes.concat(`${msg}: ${param} - ${value}`),
        '',
      );
      return { message };
    }

    if (isServerError(resData)) {
      return resData;
    }
  }

  return DEFAULT_ERROR;
}
