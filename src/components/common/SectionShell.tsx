import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionShellProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionShell: React.FC<SectionShellProps> = ({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section
      id={id}
      className={`scroll-snap-start py-20 md:py-28 ${className}`}
      ref={ref}
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-accent/20 dark:text-accent">
              {eyebrow}
            </div>
          )}
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-slate-600 dark:text-slate-300">{description}</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default SectionShell;
