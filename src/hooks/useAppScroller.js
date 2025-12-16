// @flow
import { useState, useEffect } from 'react';

export const useAppScroller = () => {
  const [ref, setRef] = useState(null);

  // React 17: avoid running on every render; set once after mount
  useEffect(() => {
    if (!ref) setRef(document.getElementById('main'));
  }, [ref]);

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
