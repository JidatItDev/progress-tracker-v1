"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import NestedDropdown from "../../nesteddropdown/page";

/* ================= TYPES ================= */

export interface SelectedSubOptions {
  [parentName: string]: string[];
}

interface AddClientModalProps {
  onClose: () => void;
}

/* ================= COMPONENT ================= */

const AddClientModal = ({ onClose }: AddClientModalProps) => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedFeatures, setSelectedFeatures] = useState<{
    parents: string[];
    subs: SelectedSubOptions;
  }>({
    parents: [],
    subs: {},
  });

  const dropdownOptions = [
    {
      id: "Tabs",
      name: "Tabs",
      subOptions: [
        { id: "p1", label: "Projects" },
        { id: "p2", label: "Client" },
        { id: "p3", label: "Milestones" },
      ],
    },
    {
      id: "permissions",
      name: "Permissions",
      subOptions: [
        { id: "view", label: "View" },
        { id: "edit", label: "Edit" },
        { id: "delete", label: "Delete" },
        { id: "create", label: "Create" },
      ],
    },
  ];

  const handleSubmit = () => {
    if (!clientName || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      clientName,
      email,
      password,
      features: selectedFeatures,
    };

    console.log("Client Created:", payload);
    toast.success("Client added successfully");

    setTimeout(onClose, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white overflow-y-auto rounded-lg shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">Add Client</h2>
        <p className="text-sm text-gray-500 mb-5">
          Create a new client and assign permissions
        </p>

        <div className="space-y-4 flex flex-col w-72">
          <input
            className="w-full border rounded-md px-4 py-2"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <input
            className="w-full border rounded-md px-4 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-md px-4 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <NestedDropdown
            parentOptions={dropdownOptions}
            onChange={(parents, subs) => setSelectedFeatures({ parents, subs })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Add Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
