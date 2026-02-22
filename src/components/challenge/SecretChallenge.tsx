import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionShell from '../common/SectionShell';
import CipherPuzzle from './CipherPuzzle';
import LogicGridPuzzle from './LogicGridPuzzle';
import ConfettiBurst from './ConfettiBurst';
import { useUIStore } from '../../store/useUIStore';

const SecretChallenge: React.FC = () => {
  const { challenge } = useUIStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    if (challenge.cipherSolved && challenge.logicGridSolved && !challenge.unlocked) {
      challenge.setUnlocked();
      setShowConfetti(true);
      setJustUnlocked(true);
    }
  }, [challenge.cipherSolved, challenge.logicGridSolved, challenge.unlocked, challenge.setUnlocked]);

  return (
    <SectionShell
      id="secret-challenge"
      eyebrow="Secret Challenge"
      title="Decode the message. Solve the grid."
      description="Two puzzles. One unlock. No hints beyond what you see—until you ask for one."
    >
      <div className="relative">
        {showConfetti && (
          <ConfettiBurst onComplete={() => setShowConfetti(false)} />
        )}

        {challenge.unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/20 via-primary/10 to-secondary/20 p-6 text-center shadow-xl"
          >
            <span className="text-4xl">🏆</span>
            <h3 className="mt-2 font-heading text-xl font-semibold text-slate-900 dark:text-white">
              You think outside the box.
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              You decoded the cipher and solved the logic grid. That’s the kind of
              mind we build for at MindBridge.
            </p>
            {justUnlocked && (
              <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                Unlock saved. Refresh the page to try again from the start.
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                challenge.resetChallenge();
                setJustUnlocked(false);
              }}
              className="mt-4 rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Reset challenge
            </button>
          </motion.div>
        )}

        {!challenge.unlocked && (
          <div className="grid gap-10 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  Part 1 — Cipher
                </h3>
              </div>
              <CipherPuzzle />
            </div>
            <div className="glass-card rounded-2xl p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">⊞</span>
                <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                  Part 2 — Logic grid
                </h3>
              </div>
              <LogicGridPuzzle />
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
};

export default SecretChallenge;
