import { motion } from 'framer-motion';

const NUM_PARTICLES = 28;

const BackgroundParticles: React.FC = () => {
  const particles = Array.from({ length: NUM_PARTICLES }, (_, i) => i);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%)]">
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
        <defs>
          <linearGradient id="grid" x1="0" x2="100%" y1="0" y2="100%">
            <stop stopColor="#1E3A8A" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <pattern
          id="smallGrid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="url(#grid)"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
      </svg>
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-accent/30 blur-[2px]"
          style={{
            left: `${(i * 7 + 3) % 100}%`,
            top: `${(i * 11 + 5) % 100}%`,
          }}
          animate={{
            y: [0, -30, 15, -15, 0],
            opacity: [0, 1, 0.6, 1, 0],
          }}
          transition={{
            duration: 20 + (i % 12),
            repeat: Infinity,
            delay: (i % 5) * 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;
