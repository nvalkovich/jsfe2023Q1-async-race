export const getLocalStorage = (key: string): string | null => localStorage.getItem(key);

export const parseLocalStorage = <T>(key: string): T | null => {
  const value = getLocalStorage(key);
  if (value === null) return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

export const setLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(
    key,
    value,
  );
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(
    key,
  );
};

export const stringifyLocalStorage = <T>(key: string, value: T): void => {
  const string = JSON.stringify(value);
  setLocalStorage(key, string);
};
