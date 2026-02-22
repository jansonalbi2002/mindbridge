import { useEffect, useState } from 'react';

export const useScrollDirection = () => {
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    let lastY = window.scrollY;
    const handler = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 4) return;
      setDirection(y > lastY ? 'down' : 'up');
      lastY = y;
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return direction;
};
