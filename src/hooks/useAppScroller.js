// @flow
import { useState, useLayoutEffect } from 'react';

export const useAppScroller = () => {
  const [ref, setRef] = useState(null);

  // React 17: effect cleanup is async; since we read DOM synchronously
  // for scrolling, ensure ref is set before paint. Switch to useLayoutEffect.
  // Version delta: React 16.8.6 -> 17.0.2
  useLayoutEffect(() => {
    if (!ref) setRef(document.getElementById('main'));
  });

  const scrollToTop = () => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = 0);
  };

  const scrollToBottom = () => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = elem.scrollHeight - elem.clientHeight);
  };

  const scrollTo = (pos: number) => {
    const elem = ref || document.getElementById('main');
    if (elem) return (elem.scrollTop = pos);
  };

  return { scrollToTop, scrollTo, scrollToBottom, ref };
};
