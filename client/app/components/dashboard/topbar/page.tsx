"use client";

import { useRouter } from "next/navigation";
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(stored ? stored === "dark" : prefersDark);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login page
    router.push("/login");
  };

  return (
    <header className="h-16 w-full flex items-center px-6">
      <div className="flex items-center justify-end gap-2 flex-1">
        <div className="p-6">
          <SearchBar onSearch={(v) => console.log(v)} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={() => setIsDark((s) => !s)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* User Profile */}
        <div
          ref={menuRef}
          className="relative flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700"
        >
          <button
            onClick={() => setOpenMenu((s) => !s)}
            className="flex items-center gap-3 focus:outline-none"
            aria-haspopup="menu"
            aria-expanded={openMenu}
          >
            <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
          </button>

          {/* Dropdown */}
          {openMenu && (
            <div
              className="absolute right-0 top-12 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 z-50"
              role="menu"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600"
                role="menuitem"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}