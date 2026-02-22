import { motion } from 'framer-motion';
import SectionShell from '../common/SectionShell';

const subjects = [
  { name: 'Mathematics', color: 'from-primary to-primary/80', icon: '∑' },
  { name: 'Physics', color: 'from-secondary to-secondary/80', icon: 'Φ' },
  { name: 'Computer Science', color: 'from-accent to-accent/80', icon: '{}' },
  { name: 'Economics', color: 'from-amber-600 to-amber-500', icon: '↔' },
  { name: 'Biology', color: 'from-emerald-600 to-emerald-500', icon: '◆' },
  { name: 'Chemistry', color: 'from-violet-600 to-violet-500', icon: '⚗' },
];

const Subjects: React.FC = () => {
  return (
    <SectionShell
      id="subjects"
      eyebrow="Subjects Offered"
      title="Rigorous content across disciplines"
      description="Each subject is designed with mastery in mind—concepts, practice, and real-world application."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subj, i) => (
          <motion.div
            key={subj.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass-card flex cursor-pointer items-center gap-4 rounded-2xl p-5 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${subj.color} text-2xl font-bold text-white shadow-md`}
            >
              {subj.icon}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-slate-900 dark:text-white">
                {subj.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expert-led • AI tutor • Mind Lab
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
};

export default Subjects;
