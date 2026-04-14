"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, BookOpen } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Chuyển sang theme ${theme === "oled" ? "E-ink" : "OLED"}`}
      className="
        flex items-center gap-2 px-3 py-2 rounded-lg
        border border-border-default
        text-text-secondary text-sm
        hover:border-border-accent hover:text-text-primary
        transition-all duration-200
      "
    >
      {theme === "oled" ? (
        <>
          <BookOpen size={16} strokeWidth={1.5} />
          <span className="hidden sm:inline">E-ink</span>
        </>
      ) : (
        <>
          <Moon size={16} strokeWidth={1.5} />
          <span className="hidden sm:inline">OLED</span>
        </>
      )}
    </button>
  );
}
