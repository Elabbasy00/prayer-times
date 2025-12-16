// src/utils/mmkv.ts
import { MMKV } from 'react-native-mmkv';

/**
 * Singleton MMKV instance
 * This prevents multiple instances from being created
 */
let storage: MMKV;

try {
    storage = new MMKV({
        id: 'mobile-starter-storage',
        encryptionKey: 'your-encryption-key-here', // Optional: for encrypted storage
    });
} catch (error) {
    console.warn(
        '⚠️ MMKV initialization failed. This usually happens when using Chrome Remote Debugger.',
        '\n💡 Solution: Disable remote debugging or use Flipper instead.',
        '\n📱 The app will work but without persistent storage during debugging.',
        '\nError:',
        error
    );

    // Create a mock MMKV object for development
    storage = {
        set: () => { },
        getString: () => undefined,
        getNumber: () => undefined,
        getBoolean: () => undefined,
        contains: () => false,
        delete: () => { },
        clearAll: () => { },
        getAllKeys: () => [],
    } as any;
}

export { storage };
export default storage;
