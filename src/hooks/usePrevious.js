// @flow
import { useRef, useEffect } from 'react';

function usePrevious<T>(value: T): ?T {
  const ref = useRef();
  // React 17: effect cleanup timing is async; here we only assign,
  // but ensure effect runs after value changes (add dependency).
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
