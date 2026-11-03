"use client";

import React from "react";
import { Sun, Eye, Moon } from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";
import { ThemeMode } from "@/src/types";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const modes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { id: "comfort", label: "Comfort", icon: <Eye className="w-3.5 h-3.5" /> },
    { id: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="group"
      aria-label="Theme mode switcher"
      className="inline-flex items-center p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-medium"
    >
      {modes.map((m) => {
        const isActive = theme === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setTheme(m.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              isActive
                ? "bg-[var(--bg-card)] text-[var(--accent-orange)] font-semibold shadow-sm border border-[var(--border-subtle)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title={`Switch to ${m.label} appearance`}
            aria-pressed={isActive}
          >
            {m.icon}
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};

