"use client";

import { useTheme, type Theme } from "./ThemeProvider";

const modes: Theme[] = ["light", "dark", "system"];

const icons: Record<Theme, React.ReactNode> = {
  light: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="2.25" stroke="currentColor" strokeWidth="1.25" />
      <line x1="6.5" y1="1" x2="6.5" y2="2.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="6.5" y1="10.75" x2="6.5" y2="12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="1" y1="6.5" x2="2.25" y2="6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="10.75" y1="6.5" x2="12" y2="6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="2.808" y1="2.808" x2="3.69" y2="3.69" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="9.31" y1="9.31" x2="10.192" y2="10.192" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="10.192" y1="2.808" x2="9.31" y2="3.69" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <line x1="3.69" y1="9.31" x2="2.808" y2="10.192" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  dark: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M10.5 8A5 5 0 015 2.5a5 5 0 100 9 5 5 0 005.5-3.5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  system: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="2" width="11" height="7" rx="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.5 11.5h4M6.5 9.5v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
};

const labels: Record<Theme, string> = { light: "Light", dark: "Dark", system: "System" };

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-lg border border-neutral-200 dark:border-white/10 p-0.5 bg-neutral-100 dark:bg-white/[0.03]">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          title={labels[mode]}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all
            ${theme === mode
              ? "bg-white dark:bg-white/10 text-neutral-700 dark:text-white/80 shadow-sm"
              : "text-neutral-500 dark:text-white/30 hover:text-neutral-700 dark:hover:text-white/50"
            }
          `}
        >
          {icons[mode]}
          <span className="hidden sm:inline">{labels[mode]}</span>
        </button>
      ))}
    </div>
  );
}
