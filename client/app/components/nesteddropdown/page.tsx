"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/* ================= TYPES ================= */

export interface SubOption {
  id: string;
  label: string;
}

export interface ParentOption {
  id: string;
  name: string;
  subOptions: SubOption[];
}

export interface SelectedSubOptions {
  [parentName: string]: string[];
}

interface Props {
  parentOptions: ParentOption[];
  onChange?: (parents: string[], subs: SelectedSubOptions) => void;
}

/* ================= COMPONENT ================= */

const NestedDropdown: React.FC<Props> = ({
  parentOptions,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [parents, setParents] = useState<string[]>([]);
  const [subs, setSubs] = useState<SelectedSubOptions>({});
  const [activeParent, setActiveParent] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveParent(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleParent = (name: string) => {
    const enabled = parents.includes(name);
    const updatedParents = enabled
      ? parents.filter((p) => p !== name)
      : [...parents, name];

    const updatedSubs = { ...subs };
    if (enabled) delete updatedSubs[name];

    setParents(updatedParents);
    setSubs(updatedSubs);
    onChange?.(updatedParents, updatedSubs);
  };

  const toggleSub = (parent: string, sub: string) => {
    if (!parents.includes(parent)) return;

    const list = subs[parent] || [];
    const updated = list.includes(sub)
      ? list.filter((s) => s !== sub)
      : [...list, sub];

    const updatedSubs = { ...subs, [parent]: updated };
    setSubs(updatedSubs);
    onChange?.(parents, updatedSubs);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border rounded-md px-4 py-2 flex justify-between items-center overflow-auto" 
      >
        <span className="text-sm">
          Select Permissions ({parents.length})
        </span>
        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 border rounded-md shadow-lg bg-white">
          {parentOptions.map((parent) => {
            const enabled = parents.includes(parent.name);
            const openSub = activeParent === parent.name;

            return (
              <div key={parent.id}>
                <div
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    enabled &&
                    setActiveParent(openSub ? null : parent.name)
                  }
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleParent(parent.name)}
                    onClick={(e) => e.stopPropagation()}
                    className="mr-3"
                  />

                  <span className="flex-1">{parent.name}</span>

                  {enabled && (
                    <ChevronRight
                      size={16}
                      className={`transition ${
                        openSub ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>

                {enabled && openSub && (
                  <div className="bg-gray-50 px-6 py-3">
                    {parent.subOptions.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center gap-3 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            subs[parent.name]?.includes(sub.label) || false
                          }
                          onChange={() =>
                            toggleSub(parent.name, sub.label)
                          }
                        />
                        <span className="text-sm">{sub.label}</span>
                       
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;
