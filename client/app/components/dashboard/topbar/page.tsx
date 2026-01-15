"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "../../searchbar/page";

interface User {
  name: string;
  role: string;
  avatarUrl?: string;
}

interface TopbarProps {
  user: User;
}

export default function Topbar({ user }: TopbarProps) {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme once on mount
  useEffect(() => {
    const initializeTheme = () => {
      const stored = localStorage.getItem("theme");
      if (stored) {
        return stored === "dark";
      }
      if (window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(initializeTheme());
  }, []);
  const handleSearch = (value: string) => {
    console.log("Search submitted:", value);
  };
  // Apply theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="h-16 w-full flex items-center px-6">
      <div className="flex items-center justify-end gap-2 flex-1">
        {/* Search Bar */}
        <div className="p-6 flex justify-center items-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark((s) => !s)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            {isDark ? (
              <Sun size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
          <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-black dark:text-gray-100 whitespace-nowrap">
              {user.name}
            </span>
            <span className="text-xs font-light text-gray-500 dark:text-gray-300 whitespace-nowrap">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
