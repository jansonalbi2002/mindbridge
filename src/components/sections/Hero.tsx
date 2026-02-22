import { Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import HeroCube from './HeroCube';

const Hero: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 40, damping: 20 });
  const rotateX = useTransform(smoothY, [-40, 40], [8, -8]);
  const rotateY = useTransform(smoothX, [-40, 40], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX / 5);
    y.set(offsetY / 5);
  };

  return (
    <section
      id="hero"
      className="scroll-snap-start bg-gradient-to-b from-slate-50 via-background to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-28 md:flex-row md:pt-32">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-lg ring-1 ring-primary/10 dark:bg-slate-900/60 dark:ring-slate-700">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Global AI-first learning platform
            </div>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.1rem]">
              Build Intelligence.
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Bridge Potential.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300">
              MindBridge combines expert-led courses, adaptive AI tutors, and
              interactive simulations into one cohesive platform. Designed for
              ambitious learners and teams, everywhere.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary/90"
              >
                <span className="relative z-10">Explore subjects</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  document.getElementById('ai-tutor')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 shadow-sm hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              >
                Try AI tutor demo
              </motion.button>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  ★
                </span>
                <div>
                  <div className="font-medium text-slate-700 dark:text-slate-200">
                    4.9 / 5 learner rating
                  </div>
                  <div>Trusted by teams in 40+ countries</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative flex flex-1 items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            className="glass-card relative h-[280px] w-full max-w-md overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
            <div className="relative z-10 flex h-full flex-col justify-between p-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Mind Lab Preview
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  3D Rubik&apos;s Cube • Logic pulses • Real-time feedback
                </div>
              </div>
              <div className="min-h-[160px] w-full">
                <Suspense
                  fallback={
                    <div className="flex h-[160px] items-center justify-center rounded-xl bg-slate-900/80">
                      <span className="text-xs text-slate-500">Loading 3D…</span>
                    </div>
                  }
                >
                  <HeroCube />
                </Suspense>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Tap any face for a challenge</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400">
                  Adaptive difficulty
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
