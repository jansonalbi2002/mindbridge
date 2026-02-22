import { motion } from 'framer-motion';

const CallToAction: React.FC = () => {
  return (
    <section
      id="call-to-action"
      className="scroll-snap-start py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-10 text-center shadow-xl md:p-14"
        >
          <h2 className="font-heading text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">
            Ready to build your intelligence?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
            Join learners in 40+ countries. Start with a free trial—no credit card
            required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-primary px-8 py-4 text-base font-medium text-white shadow-lg hover:bg-primary/90"
            >
              Start free trial
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border-2 border-slate-300 bg-white/80 px-6 py-3 text-base font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100"
            >
              Talk to sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
