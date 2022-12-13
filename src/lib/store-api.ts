import { isObject } from './type-guards';

export type ValidationErrorItem = {
  location: 'string';
  msg: string;
  param: string;
  value: string;
};
export type ValidationError = {
  errors: ValidationErrorItem[];
};

export type ServerError = {
  message: string;
};

export const isValidationErrorItem = (item: unknown): item is ValidationError => {
  const keys = ['location', 'msg', 'param', 'value'];
  if (isObject(item) && keys.every((key) => key in item)) {
    return true;
  }
  return false;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  if (
    isObject(error) &&
    'errors' in error &&
    error.errors !== undefined &&
    Array.isArray(error.errors) &&
    isValidationErrorItem(error.errors[0])
  ) {
    return true;
  }
  return false;
};

export const isServerError = (error: unknown): error is ServerError => {
  if (error instanceof Error && error.message !== undefined) {
    return true;
  }

  return false;
};
