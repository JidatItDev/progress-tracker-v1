"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { ComponentType } from "react";

type SidebarItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  permission?: string;
};

type SidebarProps = {
  items: readonly SidebarItem[];
};

export default function Sidebar({ items }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <aside
      className={`h-screen bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 py-5  ${
        collapsed ? "w-25" : "w-54"
      }`}
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 mb-4 ">
        {collapsed ? (
          <img
            src="/logo.jpg"
            alt="Company Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="px-7 text-4xl font-semibold text-gray-900">
            LOGO
          </span>
        )}

        <button onClick={toggleCollapse} className="p-2">
          <ChevronLeft
            size={25}
            className={`text-gray-600 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 mt-5">
        <ul className="space-y-1">
          {items.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group  ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                  title={collapsed ? label : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={20}
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-black group-hover:text-gray-500"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-5 mt-4">
        <button className="w-full py-2.5 px-3 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500">
          {collapsed ? "+" : "+ Quick Add"}
        </button>
      </div>
    </aside>
  );
}
