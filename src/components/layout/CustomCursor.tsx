import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;
    document.body.classList.add('cursor-none');

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setActive(true);
    const up = () => setActive(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  if (!mounted || (typeof window !== 'undefined' && window.innerWidth < 1024)) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed z-[100] h-8 w-8 rounded-full border-2 border-accent/80 bg-accent/10"
      style={{ left: 0, top: 0 }}
      animate={{
        x: pos.x - 16,
        y: pos.y - 16,
        scale: active ? 0.7 : 1,
        borderRadius: active ? '12px' : '999px',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
        mass: 0.5,
      }}
    />
  );
};

export default CustomCursor;
