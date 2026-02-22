import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

const ENCODED = 'WKLQN RXWVLGH WKH ERA';
const EXPECTED = 'THINK OUTSIDE THE BOX';

const normalize = (s: string) =>
  s
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');

const CipherPuzzle: React.FC = () => {
  const { challenge } = useUIStore();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hintShown, setHintShown] = useState(false);

  const check = () => {
    if (normalize(input) === normalize(EXPECTED)) {
      setFeedback('correct');
      challenge.setCipherSolved();
    } else {
      setFeedback('wrong');
    }
  };

  if (challenge.cipherSolved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-4 text-center"
      >
        <span className="text-2xl">🔓</span>
        <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-300">
          Cipher solved
        </p>
        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
          You decoded the message. Now solve the logic grid below.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Decode this message. The cipher is a <strong>Caesar shift</strong>.
      </p>
      <div className="rounded-xl bg-slate-900/60 p-4 font-mono text-lg tracking-widest text-slate-200">
        {ENCODED}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="Your decoded phrase…"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={check}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Check
        </button>
      </div>
      {feedback === 'wrong' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-rose-500"
        >
          Not quite. Try a different shift value.
        </motion.p>
      )}
      <button
        type="button"
        onClick={() => setHintShown(true)}
        className="text-xs text-slate-500 underline hover:text-accent"
      >
        {hintShown ? 'Hint: shift each letter by 3 (A→D, B→E, …)' : 'Show hint'}
      </button>
    </div>
  );
};

export default CipherPuzzle;
