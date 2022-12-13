export const isObject = (item: unknown): item is { [key: string]: unknown } => {
  if (item === null || typeof item !== 'object' || Array.isArray(item)) {
    return false;
  }

  return true;
};
