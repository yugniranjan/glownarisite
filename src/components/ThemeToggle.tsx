'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const KEY = 'glownari_theme';
const THEME_META = {
  light: { label: 'Light theme', next: 'Dark theme', icon: Sun },
  dark: { label: 'Dark theme', next: 'Light theme', icon: Moon },
} satisfies Record<Theme, { label: string; next: string; icon: typeof Sun }>;

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
}

export function ThemeScript() {
  const code = `
    (() => {
      try {
        const key = '${KEY}';
        const resolved = localStorage.getItem(key) === 'dark' ? 'dark' : 'light';
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
      } catch (_) {
        document.documentElement.classList.add('light');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function ThemeToggle({ inverse = false }: { inverse?: boolean }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    localStorage.setItem(KEY, next);
    applyTheme(next);
  }

  function cycleTheme() {
    choose(theme === 'dark' ? 'light' : 'dark');
  }

  const Icon = THEME_META[theme].icon;
  const label = `${THEME_META[theme].label}. Switch to ${THEME_META[theme].next}.`;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={cycleTheme}
      className={`grid h-10 w-10 place-items-center rounded-md border transition-colors ${
        inverse
          ? 'border-white/20 bg-white/10 text-white hover:bg-white hover:text-accent'
          : 'border-border bg-bg-glass text-text-muted hover:bg-bg-elev-3 hover:text-text'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
