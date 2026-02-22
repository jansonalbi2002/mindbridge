import { motion } from 'framer-motion';
import SectionShell from '../common/SectionShell';

const steps = [
  {
    title: 'Choose your path',
    description:
      'Pick a subject and set your goals. Our system adapts to your level and pace.',
    icon: '1',
  },
  {
    title: 'Learn with AI support',
    description:
      'Get instant explanations, hints, and practice problems from the MindBridge Tutor.',
    icon: '2',
  },
  {
    title: 'Apply in Mind Lab',
    description:
      'Reinforce concepts with 3D puzzles and micro-games that build intuition.',
    icon: '3',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How MindBridge Works"
      title="Three steps to deeper understanding"
      description="Structured learning, intelligent support, and hands-on practice—all in one place."
    >
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary dark:bg-accent/20 dark:text-accent">
              {step.icon}
            </div>
            <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
};

export default HowItWorks;
