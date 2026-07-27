import type { Config } from 'tailwindcss';

/**
 * All colors read from CSS variables defined in src/app/globals.css.
 * Swap palette → change variables only, never this file.
 *
 * Current palette: premium berry, warm ivory, and deep teal with light/dark variables.
 */
const config: Config = {
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:          'var(--bg)',
        'bg-elev-1': 'var(--bg-elev-1)',
        'bg-elev-2': 'var(--bg-elev-2)',
        'bg-elev-3': 'var(--bg-elev-3)',

        text:        'var(--text)',
        'text-muted':'var(--text-muted)',
        'text-dim':  'var(--text-dim)',

        border:        'var(--border)',
        'border-strong':'var(--border-strong)',

        accent: {
          DEFAULT: 'var(--accent)',
          strong:  'var(--accent-strong)',
          soft:    'var(--accent-soft)',
        },
        info: {
          DEFAULT: 'var(--info)',
          soft:    'var(--info-soft)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft:    'var(--success-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft:    'var(--danger-soft)',
        },
        whatsapp: {
          DEFAULT: 'var(--whatsapp)',
          strong:  'var(--whatsapp-strong)',
        },

        // Back-compat aliases
        ink:     'var(--text)',
        muted:   'var(--text-muted)',
        line:    'var(--border)',
        paper:   'var(--bg-elev-1)',
        surface: 'var(--bg-elev-2)',
        brand:   'var(--accent)',
        amber:   'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1280px',
        prose: '40rem',
      },
      boxShadow: {
        card:  'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
        cta:   'var(--shadow-cta)',
        soft:  '0 18px 60px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
