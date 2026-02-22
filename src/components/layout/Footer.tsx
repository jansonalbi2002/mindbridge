const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 dark:bg-slate-950/80 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 md:flex-row">
        <div>© {new Date().getFullYear()} MindBridge Labs. All rights reserved.</div>
        <div className="flex gap-4">
          <button
            type="button"
            className="hover:text-primary dark:hover:text-accent transition-colors"
          >
            Privacy
          </button>
          <button
            type="button"
            className="hover:text-primary dark:hover:text-accent transition-colors"
          >
            Terms
          </button>
          <button
            type="button"
            className="hover:text-primary dark:hover:text-accent transition-colors"
          >
            Careers
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
