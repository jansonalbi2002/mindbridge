import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Round = {
  a: number;
  b: number;
  op: '+' | '-' | '×';
  answer: number;
};

const makeRound = (): Round => {
  const ops: Round['op'][] = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  let answer = 0;

  switch (op) {
    case '+':
      answer = a + b;
      break;
    case '-':
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      break;
    case '×':
      answer = a * b;
      break;
  }

  return { a, b, op, answer };
};

const QuickMathGame: React.FC = () => {
  const [round, setRound] = useState<Round>(() => makeRound());
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setBest((b) => Math.max(b, score));
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, running, score]);

  const submit = () => {
    if (!running || !input.trim()) return;
    const val = Number(input.trim());
    const correct = val === round.answer;
    setFeedback(correct ? 'correct' : 'incorrect');

    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = correct ? 'triangle' : 'square';
      osc.frequency.value = correct ? 720 : 280;
      gain.gain.value = 0.12;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }

    if (correct) {
      setScore((s) => s + 10);
      setRound(makeRound());
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
    setInput('');
  };

  const restart = () => {
    setScore(0);
    setTimeLeft(45);
    setRunning(true);
    setRound(makeRound());
    setInput('');
    setFeedback(null);
  };

  return (
    <div className="glass-card flex h-full min-h-[280px] flex-col rounded-3xl p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold uppercase tracking-[0.18em]">
          Speed Lab
        </span>
        <span>Score: {score} • Best: {best}</span>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span>Time left</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-secondary via-accent to-primary"
              animate={{ width: `${(timeLeft / 45) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${round.a}-${round.b}-${round.op}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-5 text-center font-heading text-3xl font-semibold text-slate-900 dark:text-white"
            >
              {round.a} {round.op} {round.b} = ?
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={input}
              disabled={!running}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              placeholder="Type your answer…"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!running}
              className="rounded-2xl bg-secondary px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-secondary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Check
            </button>
          </div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-xs ${
                feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {feedback === 'correct'
                ? 'Nice. Neural pathway reinforced.'
                : 'Off by a bit. Recalibrate and go again.'}
            </motion.div>
          )}
        </div>

        {!running && (
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Session complete. Your processing tempo is improving.
            </span>
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-accent px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/10 dark:border-accent/80 dark:text-accent/80"
            >
              Replay session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickMathGame;
