import { isAxiosError } from 'axios';
import { isServerError, isValidationError } from '../lib/store-api';

export type ThunkRejectedValue = {
  message: string;
};

export const DEFAULT_ERROR = { message: "An error ocurred, couldn't make a request" };

export function handleError(error: unknown): ThunkRejectedValue {
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
