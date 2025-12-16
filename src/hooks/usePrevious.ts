// src/hooks/usePrevious.ts
import { useEffect, useRef } from 'react';

/**
 * Track previous value of a variable
 * @param value - Value to track
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export default usePrevious;
