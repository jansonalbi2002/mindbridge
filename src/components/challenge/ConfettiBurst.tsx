import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  '#1E3A8A',
  '#0F766E',
  '#38BDF8',
  '#F97316',
  '#A855F7',
  '#22C55E',
  '#EF4444',
  '#FACC15',
];

const COUNT = 55;

const ConfettiBurst: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [pieces] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      x: Math.random() * 100 - 50,
      delay: Math.random() * 0.3,
      duration: 1.8 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/4"
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: p.x * 8,
            y: 400 + Math.random() * 200,
            opacity: 0,
            rotate: p.rotation + 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
          style={{
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiBurst;
