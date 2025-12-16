// src/hooks/useKeyboard.ts
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

interface KeyboardInfo {
    isVisible: boolean;
    height: number;
}

/**
 * Track keyboard visibility and height
 * @returns Keyboard info object
 */
export function useKeyboard(): KeyboardInfo {
    const [keyboardInfo, setKeyboardInfo] = useState<KeyboardInfo>({
        isVisible: false,
        height: 0,
    });

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            (e: KeyboardEvent) => {
                setKeyboardInfo({
                    isVisible: true,
                    height: e.endCoordinates.height,
                });
            },
        );

        const hideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardInfo({
                    isVisible: false,
                    height: 0,
                });
            },
        );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return keyboardInfo;
}

export default useKeyboard;
