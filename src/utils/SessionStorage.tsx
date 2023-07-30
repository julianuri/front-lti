export const getFromSessionStorage = (
  key: string,
  defaultValue: unknown,
): any => {
  if (!key || typeof window === 'undefined') {
    return defaultValue;
  }
  return sessionStorage.getItem(key);
};

export const saveInSessionStorage = (
  ...arr: Array<{ key: string; value: any }>
): void => {
  for (const e of arr) {
    sessionStorage.setItem(e.key, e.value);
  }
};
