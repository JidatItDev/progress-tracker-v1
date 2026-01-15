"use client";

import { useState } from "react";
import InputField from "@/app/components/inputfield/page";

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [showMembers, setShowMembers] = useState(false);

  const availableMembers = [
    "John Doe",
    "Jane Smith",
    "Alex Johnson",
    "Emily Davis",
    "Michael Brown",
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const projectData = {
      projectTitle,
      clientName,
      description,
      startDate,
      endDate,
      priority,
      teamMembers,
    };

    console.log("Project Created:", projectData);
    setProjectTitle("");
    setClientName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setPriority("medium");
    setTeamMembers([]);

    onClose();
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Project</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create a new project with essential details. You can add more
            details later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="projectTitle"
            label="Project Title*"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Enter Project Title..."
            required
          />

          <InputField
            id="clientName"
            label="Client Name*"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter Client name..."
            required
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description*
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief Project Description..."
              rows={3}
              className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="priority"
              className="text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-gray-700">
              Team Members*
            </label>

            <input
              type="text"
              placeholder="Select team members"
              readOnly
              value={teamMembers.join(", ")}
              onClick={() => setShowMembers(!showMembers)}
              className="rounded-lg border border-black px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-pink-500"
            />

            {/* Dropdown */}
            {showMembers && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white shadow-md max-h-40 overflow-y-auto">
                {availableMembers.map((member) => (
                  <div
                    key={member}
                    onClick={() => {
                      if (!teamMembers.includes(member)) {
                        setTeamMembers([...teamMembers, member]);
                      }
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-pink-50"
                  >
                    {member}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 ">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-pink-600 px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
