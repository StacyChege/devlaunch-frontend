import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
// Everytime the track hook values change, React runs a cleanup function to clear the previous timer and set a new one. This ensures that the debounced value is only updated after the specified delay has passed without any changes to the input value.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}