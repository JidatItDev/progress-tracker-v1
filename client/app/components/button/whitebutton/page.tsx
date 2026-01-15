"use client"
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
  label: string;
  value: string;
  onClick?: () => void;
}

interface ButtonWhiteProps {
  buttonname: string;
  options: DropdownOption[];
  className: string;
  onSelect?: (option: DropdownOption) => void;
}

const ButtonWhite = ({ buttonname, options,className, onSelect }: ButtonWhiteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.onClick) {
      option.onClick();
    }
    if (onSelect) {
      onSelect(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={className}  >
        {buttonname}
        <ChevronDown
          className={`ml-2 w-4 h-4 text-black transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left text-sm text-black hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonWhite;