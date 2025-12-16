// src/utils/storage.ts
import mmkvStorage from './mmkv';

/**
 * Type-safe storage utility wrapper for MMKV
 * Provides convenient methods for storing different data types
 */
export class Storage {
    /**
     * Store a string value
     */
    static setString(key: string, value: string): void {
        mmkvStorage.set(key, value);
    }

    /**
     * Get a string value
     */
    static getString(key: string): string | undefined {
        return mmkvStorage.getString(key);
    }

    /**
     * Store a number value
     */
    static setNumber(key: string, value: number): void {
        mmkvStorage.set(key, value);
    }

    /**
     * Get a number value
     */
    static getNumber(key: string): number | undefined {
        return mmkvStorage.getNumber(key);
    }

    /**
     * Store a boolean value
     */
    static setBoolean(key: string, value: boolean): void {
        mmkvStorage.set(key, value);
    }

    /**
     * Get a boolean value
     */
    static getBoolean(key: string): boolean | undefined {
        return mmkvStorage.getBoolean(key);
    }

    /**
     * Store an object (serialized as JSON)
     */
    static setObject<T>(key: string, value: T): void {
        mmkvStorage.set(key, JSON.stringify(value));
    }

    /**
     * Get an object (deserialized from JSON)
     */
    static getObject<T>(key: string): T | undefined {
        const jsonString = mmkvStorage.getString(key);
        if (jsonString) {
            try {
                return JSON.parse(jsonString) as T;
            } catch (error) {
                console.error(`Error parsing JSON for key "${key}":`, error);
                return undefined;
            }
        }
        return undefined;
    }

    /**
     * Delete a value
     */
    static delete(key: string): void {
        mmkvStorage.delete(key);
    }

    /**
     * Check if a key exists
     */
    static contains(key: string): boolean {
        return mmkvStorage.contains(key);
    }

    /**
     * Get all keys
     */
    static getAllKeys(): string[] {
        return mmkvStorage.getAllKeys();
    }

    /**
     * Clear all data
     */
    static clearAll(): void {
        mmkvStorage.clearAll();
    }

    /**
     * Clear specific keys
     */
    static clearKeys(keys: string[]): void {
        keys.forEach(key => mmkvStorage.delete(key));
    }
}

export default Storage;
