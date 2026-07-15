import { useState, useEffect } from 'react';

// Delays updating the returned value until the user stops typing.
// Used on the template search input to avoid firing an API call on
// every single keystroke
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancels the previous timer if the user types again before delay ends
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}