"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Theme`}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Theme`}
      className={`p-2 rounded-xl transition-all flex items-center justify-center gap-1.5 border font-semibold text-xs ${
        theme === "light"
          ? "bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300 shadow-sm"
          : "bg-slate-900 hover:bg-slate-800 text-blue-400 border-slate-800 shadow-md"
      } ${className}`}
    >
      {theme === "light" ? (
        <>
          <Sun className="w-4 h-4 text-amber-500 fill-amber-400/20 animate-spin-slow" />
          <span className="hidden md:inline text-slate-700">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
          <span className="hidden md:inline text-slate-300">Dark</span>
        </>
      )}
    </button>
  );
}
