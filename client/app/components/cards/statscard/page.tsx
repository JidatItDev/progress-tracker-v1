"use client";
import { ChevronRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  link: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  link,
}: StatCardProps) {
  return (
    <div className="bg-[#303030] rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-pink-500 text-sm font-medium">{label}</span>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>

      <div className="text-4xl font-bold text-gray-200">{value}</div>

      <a className="text-gray-400 text-xs hover:text-pink-500">
        {link}
        <ChevronRight className="inline-block w-4 h-4 ml-1" />
      </a>
    </div>
  );
}
