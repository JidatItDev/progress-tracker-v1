"use client";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-base text-gray-700">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs ${className}`}
        {...props}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;
