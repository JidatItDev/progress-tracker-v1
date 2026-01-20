"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "@/app/components/inputfield/page";

interface User {
  _id: string;
  name: string;
  email?: string;
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAvailableMembers(response.data.users || response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } else {
        setError("Failed to fetch users");
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async () => {
    if (!projectTitle || !clientName || !description) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Get userId and token from localStorage
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId") || "6968a5a70e206b2737dd4e0d";

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const projectData = {
        userId: userId,
        projectName: projectTitle,
        client: clientName, // FIX: Added the missing 'client' field
        description: description,
        startDate: startDate,
        endDate: endDate,
        priority: priority,
        teamMembers: teamMembers,
      };

      console.log("📤 Sending to API:", projectData); // Debug log

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/createProject`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Project Created Successfully:", response.data);

      // Reset form
      setProjectTitle("");
      setClientName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setPriority("medium");
      setTeamMembers([]);

      // Close modal
      onClose();
    } catch (err) {
      console.error("Error creating project:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create project");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeamMember = (memberId: string) => {
    if (teamMembers.includes(memberId)) {
      setTeamMembers(teamMembers.filter((id) => id !== memberId));
    } else {
      setTeamMembers([...teamMembers, memberId]);
    }
  };

  const getSelectedMemberNames = () => {
    return availableMembers
      .filter((member) => teamMembers.includes(member._id))
      .map((member) => member.name)
      .join(", ");
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-5">
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

            {isLoadingUsers ? (
              <div className="rounded-lg border border-black px-3 py-2 text-sm text-gray-400">
                Loading users...
              </div>
            ) : (
              <input
                type="text"
                placeholder="Select team members"
                readOnly
                value={getSelectedMemberNames()}
                onClick={() => setShowMembers(!showMembers)}
                className="rounded-lg border border-black px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-pink-500"
              />
            )}

            {showMembers && !isLoadingUsers && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {availableMembers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No users available
                  </div>
                ) : (
                  availableMembers.map((member) => (
                    <div
                      key={member._id}
                      onClick={() => toggleTeamMember(member._id)}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-pink-50 flex items-center gap-2 ${
                        teamMembers.includes(member._id) ? "bg-pink-100" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={teamMembers.includes(member._id)}
                        onChange={() => {}}
                        className="rounded text-pink-600"
                      />
                      <span>{member.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-pink-600 px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;