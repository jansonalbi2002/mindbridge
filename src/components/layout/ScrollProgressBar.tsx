import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
    };
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
        style={{ transformOrigin: '0% 50%' }}
        animate={{ scaleX: progress }}
        transition={{ type: 'spring', stiffness: 120, damping: 24 }}
      />
    </div>
  );
};

export default ScrollProgressBar;
