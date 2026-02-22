import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionShell from '../common/SectionShell';

type Message = {
  id: number;
  from: 'user' | 'tutor';
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    from: 'user',
    text: "I'm stuck on eigenvalues. Can you explain them intuitively?",
  },
  {
    id: 2,
    from: 'tutor',
    text:
      'Think of a matrix as a transformation of space. An eigenvector is a direction that does not rotate under that transformation; an eigenvalue tells you how strongly it gets stretched or squished.',
  },
];

const AiTutorSection: React.FC = () => {
  const [subject, setSubject] = useState('Linear Algebra');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMsg: Message = { id: nextId, from: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const tutorMsg: Message = {
        id: nextId + 1,
        from: 'tutor',
        text:
          "I'm a mock AI tutor. In production, this response would be generated using your knowledge graph, models, and learner profile.",
      };
      setMessages((m) => [...m, tutorMsg]);
      setTyping(false);
    }, 1100);
  };

  return (
    <SectionShell
      id="ai-tutor"
      eyebrow="AI Tutor"
      title="A tutor that never gets tired of your questions."
      description="MindBridge Tutor compresses years of tutoring experience into a personalized, always-on learning companion."
    >
      <div className="grid gap-8 md:grid-cols-[3fr,2fr]">
        <div className="glass-card rounded-3xl p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>MindBridge Tutor • Live</span>
            </div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-accent/50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              <option>Linear Algebra</option>
              <option>Probability</option>
              <option>Algorithms</option>
              <option>Physics</option>
            </select>
          </div>
          <div className="flex h-72 flex-col justify-between rounded-2xl bg-slate-50/80 p-3 dark:bg-slate-900/70">
            <div className="space-y-2 overflow-y-auto pr-1 text-sm">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      m.from === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-50'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:75ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Ask a ${subject.toLowerCase()} question…`}
                className="flex-1 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-800 shadow-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={send}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white shadow-md hover:bg-secondary/90"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Every interaction is grounded in a structured understanding of your
            goals, misconceptions, and prior knowledge. MindBridge Tutor transforms
            passive watching into active, conversational learning.
          </p>
          <ul className="space-y-2">
            <li>• Adaptive hinting calibrated to your confidence</li>
            <li>• In-context visualizations for abstract topics</li>
            <li>• Session summaries you can revisit anytime</li>
            <li>• Fine-grained analytics for teams and cohorts</li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
};

export default AiTutorSection;
