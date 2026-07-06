// src/utils/mmkv.ts
import { createMMKV, MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/**
 * MMKV instance with a persistent ID.
 */
let storage: MMKV;
let isPersistent = true;

try {
  storage = createMMKV({
    id: 'prayer-times-data-v1',
    encryptionKey: 'prayer-times-data-v1',
    mode: 'multi-process',
    readOnly: false,
  });
} catch (error) {
  isPersistent = false;
  console.log('MMKV init failed, using mock storage');

  const mockStorage: Record<string, string> = {};
  storage = {
    set: (key: string, value: string | number | boolean) => {
      mockStorage[key] = value.toString();
    },
    getString: (key: string) => mockStorage[key],
    getNumber: (key: string) => {
      const val = mockStorage[key];
      return val ? parseFloat(val) : undefined;
    },
    getBoolean: (key: string) => mockStorage[key] === 'true',
    contains: (key: string) => key in mockStorage,
    delete: (key: string) => {
      delete mockStorage[key];
    },
    clearAll: () => {
      Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    },
    getAllKeys: () => Object.keys(mockStorage),
    addOnValueChangedListener: () => ({ remove: () => {} }),
  } as any;
}

/**
 * Returns whether the current storage is persistent.
 */
export const getIsPersistent = () => isPersistent;

/**
 * Centralized Zustand storage adapter for MMKV.
 */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.remove(name);
  },
};

export { storage };
export default storage;
