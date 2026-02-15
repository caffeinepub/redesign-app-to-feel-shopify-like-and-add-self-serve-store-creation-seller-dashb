import { useState, useEffect } from 'react';

/**
 * Hook that tracks elapsed time for a loading state and exposes a boolean
 * after a configurable delay to show fallback UI without affecting fast loads.
 */
export function useDelayedLoadingFallback(isLoading: boolean, delayMs: number = 12000) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowFallback(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        setShowFallback(true);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isLoading, delayMs]);

  return showFallback;
}
