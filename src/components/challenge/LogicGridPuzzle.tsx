import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';

const PEOPLE = ['Alex', 'Sam', 'Jordan'] as const;
const SUBJECTS = ['Math', 'Physics', 'Code'] as const;

type Person = (typeof PEOPLE)[number];
type Subject = (typeof SUBJECTS)[number];

const SOLUTION: Record<Person, Subject> = {
  Alex: 'Code',
  Sam: 'Physics',
  Jordan: 'Math',
};

const CLUES = [
  'Alex is not studying Math.',
  'Sam is studying Physics.',
  'The one studying Code is not Jordan.',
];

const LogicGridPuzzle: React.FC = () => {
  const { challenge } = useUIStore();
  const [assignments, setAssignments] = useState<Record<Person, Subject>>({
    Alex: 'Math',
    Sam: 'Math',
    Jordan: 'Math',
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const setAssignment = (person: Person, subject: Subject) => {
    setAssignments((prev) => ({ ...prev, [person]: subject }));
    setFeedback(null);
  };

  const check = () => {
    const correct =
      PEOPLE.every((p) => assignments[p] === SOLUTION[p]) &&
      [...new Set(Object.values(assignments))].length === 3;
    if (correct) {
      setFeedback('correct');
      challenge.setLogicGridSolved();
    } else {
      setFeedback('wrong');
    }
  };

  if (challenge.logicGridSolved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-4 text-center"
      >
        <span className="text-2xl">🔓</span>
        <p className="mt-2 font-medium text-emerald-700 dark:text-emerald-300">
          Logic grid solved
        </p>
        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
          All clues satisfied. You’ve unlocked the challenge.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Assign each person exactly one subject so that all clues are true.
      </p>
      <ul className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
        {CLUES.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-accent">•</span> {c}
          </li>
        ))}
      </ul>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
        {PEOPLE.map((person) => (
          <div
            key={person}
            className="flex items-center justify-between gap-4"
          >
            <span className="w-20 font-medium text-slate-700 dark:text-slate-200">
              {person}
            </span>
            <div className="flex gap-2">
              {SUBJECTS.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setAssignment(person, subj)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    assignments[person] === subj
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
                      : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={check}
        className="w-full rounded-xl bg-secondary py-2.5 text-sm font-medium text-white hover:bg-secondary/90"
      >
        Check solution
      </button>
      {feedback === 'wrong' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-rose-500"
        >
          One or more clues are violated. Re-read and try again.
        </motion.p>
      )}
    </div>
  );
};

export default LogicGridPuzzle;
