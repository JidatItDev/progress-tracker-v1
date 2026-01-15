"use client";

import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchBar({
  value = "",
  placeholder = "Type a command or search...",
  onChange,
  onSearch,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.(val);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(query);
    }
  };

  return (
    <div className={`relative w-full max-w-full ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}
