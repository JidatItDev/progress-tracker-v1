"use client";

import { useState } from "react";
import InputField from "@/app/components/inputfield/page";
import SelectField from "../../dropdownfield/page";
import { toast } from "react-toastify";

interface MilestoneModalProps {
  onClose: () => void;
}

const SubMilestoneModal = ({ onClose }: MilestoneModalProps) => {
  const [milestoneName, setMilestoneName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [subMilestoneName, setSubMilestoneName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamMembers, setTeamMembers] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const milestoneData = {
      milestoneName,
      subMilestoneName,
      projectName,
      description,
      startDate,
      endDate,
      teamMembers,
    };

    console.log("Milestone Created:", milestoneData);

    toast.success("Milestone added successfully!");

    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-1 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div className="bg-white rounded-md p-2">
        <div
          className="w-full max-w-md rounded-xl  p-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-xl font-semibold text-gray-800">Add Sub Milestone</h1>
            <p className="mt-1 text-xs text-gray-500">
              Add a new milestone with essential details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Select Project */}
            <SelectField
              id="projectName"
              label="Select Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              options={[
                { label: "Select Project", value: "" },
                { label: "Project Alpha", value: "alpha" },
                { label: "Project Beta", value: "beta" },
              ]}
            />

            {/* Milestone Name */}
            <InputField
              id="milestoneName"
              label="Milestone Name*"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Enter Milestone Name..."
              required
            />

            <InputField
              id="milestoneName"
              label="Sub-Milestone Name*"
              value={subMilestoneName}
              onChange={(e) => setSubMilestoneName(e.target.value)}
              placeholder="Enter Milestone Name..."
              required
            />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief Project Description..."
                rows={3}
                required
                className="rounded-md border border-gray-500 px-3 py-1 text-sm focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md border px-3 py-2 text-xs"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md border px-3 py-2 text-xs"
              />
            </div>

            {/* Team Members */}
            <SelectField
              id="teamMembers"
              label="Team Members"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              options={[
                { label: "Select Team Member", value: "" },
                { label: "John", value: "john" },
                { label: "Jane", value: "jane" },
              ]}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-3 py-1 border text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-pink-600 px-3 py-1 text-xs text-white hover:bg-pink-700"
              >
                + Add Milestone
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubMilestoneModal;
