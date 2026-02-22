import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionShell from '../common/SectionShell';

const testimonials = [
  {
    quote:
      'MindBridge turned linear algebra from a chore into something I actually look forward to. The AI tutor never judges, and the cube challenges lock in the intuition.',
    author: 'Alex Chen',
    role: 'CS undergrad, Stanford',
    avatar: 'AC',
  },
  {
    quote:
      'Our team uses MindBridge for upskilling. The combination of structure and flexibility is exactly what we needed at scale.',
    author: 'Maria Santos',
    role: 'L&D Lead, Tech Corp',
    avatar: 'MS',
  },
  {
    quote:
      'Finally, a platform that feels built for serious learners—not just content consumption. The Mind Lab is genius.',
    author: 'James Okonkwo',
    role: 'Self-directed learner',
    avatar: 'JO',
  },
];

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  return (
    <SectionShell
      id="testimonials"
      eyebrow="Testimonials"
      title="What learners say about MindBridge"
      description="From students to L&D teams—see how MindBridge is changing the way people learn."
    >
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 shadow-xl md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote className="text-lg text-slate-700 dark:text-slate-200 md:text-xl">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-heading font-semibold text-primary dark:bg-accent/20 dark:text-accent">
                {current.avatar}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {current.author}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {current.role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? 'w-8 bg-primary dark:bg-accent'
                  : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

export default Testimonials;
