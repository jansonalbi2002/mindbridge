import { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgressBar from './components/layout/ScrollProgressBar';
import CustomCursor from './components/layout/CustomCursor';
import BackgroundParticles from './components/layout/BackgroundParticles';
import ContactFab from './components/common/ContactFab';
import Landing from './routes/Landing';
import { useUIStore } from './store/useUIStore';

const MindLab = lazy(() => import('./components/mindlab/MindLab'));

function App() {
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem('mindbridge-theme-v2') as 'light' | 'dark' | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      setTheme('dark');
    }
  }, [setTheme]);

  useEffect(() => {
    const unsub = useUIStore.subscribe((state) => {
      localStorage.setItem('mindbridge-theme-v2', state.theme);
    });
    return unsub;
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-text dark:bg-slate-950 dark:text-slate-100">
      <BackgroundParticles />
      <ScrollProgressBar />
      <CustomCursor />
      <Navbar />
      <main className="relative pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Landing />
          </motion.div>
        </AnimatePresence>

        <div className="scroll-mt-24">
          <Suspense
            fallback={
              <div className="flex justify-center py-16 text-slate-500 dark:text-slate-400">
                Loading Mind Lab…
              </div>
            }
          >
            <MindLab />
          </Suspense>
        </div>
      </main>
      <Footer />
      <ContactFab />
    </div>
  );
}

export default App;
