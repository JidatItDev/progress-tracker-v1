"use client";

import { useState, ReactNode } from "react";

type TabsProps = {
  tabs: string[];
  children: Record<string, ReactNode>;
};

export default function Tabs({ tabs, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {children[activeTab]}
      </div>
    </div>
  );
}
