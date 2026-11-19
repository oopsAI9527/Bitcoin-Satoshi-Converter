import {useState} from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return readLocalStorage(key, initialValue);
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      globalThis.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

export function readLocalStorage<T>(key: string, initialValue: T): T {
  try {
    const item = globalThis.localStorage.getItem(key);
    return item ? JSON.parse(item) as T : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}
