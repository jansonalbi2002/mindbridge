/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#0F766E',
        accent: '#38BDF8',
        background: '#F8FAFC',
        text: '#0F172A',
      },
      fontFamily: {
        heading: ['Poppins', 'Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15,23,42,0.15)',
        glass: '0 24px 60px rgba(15,23,42,0.25)',
      },
      backgroundImage: {
        'radial-soft':
          'radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 60%)',
      },
    },
  },
  plugins: [],
};

