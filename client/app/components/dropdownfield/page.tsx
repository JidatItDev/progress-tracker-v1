import { SelectHTMLAttributes } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[];
}

export default function SelectField({
  label,
  id,
  options,
  className = "",
  ...props
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium text-gray-700"
      >
        {label}
      </label>

      <select
        id={id}
        className={`rounded-md border border-gray-500 px-3 py-2 text-sm text-gray-500 bg-white
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
          ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
