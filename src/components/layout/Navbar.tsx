import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const sections = [
  { id: 'hero', label: 'Overview' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'ai-tutor', label: 'AI Tutor' },
  { id: 'mind-lab', label: 'Mind Lab' },
  { id: 'testimonials', label: 'Stories' },
  { id: 'secret-challenge', label: 'Challenge' },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme, navShrunk, setNavShrunk } = useUIStore();
  const direction = useScrollDirection();
  const [scrollPast, setScrollPast] = useState(false);

  useEffect(() => {
    const handler = () => {
      setNavShrunk(window.scrollY > 32);
      setScrollPast(window.scrollY > 120);
    };
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [setNavShrunk]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hideNav = scrollPast && direction === 'down';

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: hideNav ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50"
    >
      <motion.nav
        animate={{
          paddingTop: navShrunk ? 8 : 16,
          paddingBottom: navShrunk ? 8 : 16,
        }}
        className="mx-auto flex max-w-6xl items-center justify-between px-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-bold shadow-lg">
            MB
          </div>
          <div>
            <div className="font-heading text-lg font-semibold tracking-tight">
              MindBridge
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Build Intelligence. Bridge Potential.
            </div>
          </div>
        </div>

        <div className="hidden gap-6 text-sm md:flex">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleNavClick(s.id)}
              className="relative py-1 text-slate-600 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('call-to-action')}
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-primary/90 active:scale-95 transition-transform md:inline-flex"
          >
            Start free trial
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          >
            {theme === 'light' ? '☾' : '☼'}
          </button>
        </div>
      </motion.nav>
    </motion.header>
  );
};

export default Navbar;
