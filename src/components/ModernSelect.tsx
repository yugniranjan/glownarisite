'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type ModernSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export default function ModernSelect({
  value,
  options,
  onChange,
  placeholder = 'Select',
  className = '',
}: {
  value: string;
  options: ModernSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-border bg-bg-elev-3 px-3.5 py-2.5 text-left text-sm text-text shadow-sm transition hover:border-accent/60 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block truncate font-bold">{selected?.label || placeholder}</span>
          {selected?.description && (
            <span className="mt-0.5 block truncate text-xs font-medium text-text-muted">
              {selected.description}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-bg-elev-2 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.22)]"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition ${
                  active ? 'bg-accent text-white' : 'text-text hover:bg-bg-glass'
                }`}
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                  {active && <Check className="h-4 w-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{option.label}</span>
                  {option.description && (
                    <span className={`mt-0.5 block truncate text-xs ${active ? 'text-white/80' : 'text-text-muted'}`}>
                      {option.description}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
