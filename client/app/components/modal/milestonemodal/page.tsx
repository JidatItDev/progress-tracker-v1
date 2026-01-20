"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "@/app/components/inputfield/page";
import { toast } from "react-toastify";

interface TeamMember {
  _id: string;
  name: string;
  email?: string;
}

interface Project {
  _id: string;
  projectName: string;
  teamMembers: TeamMember[];
  startDate: string;
  endDate: string;
}

interface MilestoneModalProps {
  onClose: () => void;
}

const MilestoneModal = ({ onClose }: MilestoneModalProps) => {
  const [milestoneName, setMilestoneName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<TeamMember[]>([]);
  
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Update team members when project is selected
  useEffect(() => {
    if (projectId) {
      const selectedProject = availableProjects.find(p => p._id === projectId);
      if (selectedProject) {
        setAvailableTeamMembers(selectedProject.teamMembers || []);
        setTeamMembers([]); // Reset selected team members
        
        // Set project date constraints
        const projStartDate = selectedProject.startDate ? new Date(selectedProject.startDate).toISOString().split('T')[0] : "";
        const projEndDate = selectedProject.endDate ? new Date(selectedProject.endDate).toISOString().split('T')[0] : "";
        
        setProjectStartDate(projStartDate);
        setProjectEndDate(projEndDate);
        
        // Reset milestone dates when project changes
        setStartDate("");
        setEndDate("");
      }
    } else {
      setAvailableTeamMembers([]);
      setTeamMembers([]);
      setProjectStartDate("");
      setProjectEndDate("");
      setStartDate("");
      setEndDate("");
    }
  }, [projectId, availableProjects]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        toast.error("Please login again");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Projects fetched:", response.data);

      // Handle different response structures
      const projects = response.data.projects || response.data || [];
      setAvailableProjects(projects);
      
      if (projects.length === 0) {
        toast.info("No projects available");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to fetch projects";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        toast.error("Failed to fetch projects");
      }
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!milestoneName || !projectId || !description) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        toast.error("Authentication token not found");
        return;
      }

      const milestoneData = {
        projectId: projectId,
        milestoneName: milestoneName,
        description: description,
        startDate: startDate,
        endDate: endDate,
      };

      console.log("📤 Sending to API:", milestoneData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/createMilestone`,
        milestoneData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Milestone Created Successfully:", response.data);
      toast.success("Milestone added successfully!");

      // Reset form
      setMilestoneName("");
      setProjectId("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setTeamMembers([]);

      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err) {
      console.error("❌ Error creating milestone:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || "Failed to create milestone";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
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
    return availableTeamMembers
      .filter((member) => teamMembers.includes(member._id))
      .map((member) => member.name)
      .join(", ");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg p-2">
        <div
          className="w-full max-w-md rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Add Milestone
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Add a new milestone with essential details.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Project */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Select Project*
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                disabled={isLoadingProjects}
                className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {isLoadingProjects ? "Loading projects..." : "Select Project"}
                </option>
                {availableProjects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Milestone Name */}
            <InputField
              id="milestoneName"
              label="Milestone Name*"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              placeholder="Enter Milestone Name..."
              required
            />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief Milestone Description..."
                rows={3}
                required
                className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={projectStartDate}
                  max={projectEndDate}
                  disabled={!projectId}
                  className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || projectStartDate}
                  max={projectEndDate}
                  disabled={!projectId}
                  className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
               
              </div>
            </div>

            {/* Team Members (Display Only - from selected project) */}
            {projectId && (
              <div className="flex flex-col gap-2 relative">
             

                {availableTeamMembers.length > 0 ? (
                  <input
                    type="text"
                    placeholder="View team members"
                    readOnly
                    value={getSelectedMemberNames() || "Click to view members"}
                    onClick={() => setShowMembers(!showMembers)}
                    className="rounded-lg border border-black px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-pink-500"
                  />
                ) : (
                  <div className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-400">
                    No team members assigned to this project
                  </div>
                )}

                {showMembers && availableTeamMembers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {availableTeamMembers.map((member) => (
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
                        <div>
                          <div className="font-medium">{member.name}</div>
                          {member.email && (
                            <div className="text-xs text-gray-500">{member.email}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                type="submit"
                className="rounded-lg bg-pink-600 px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isLoadingProjects}
              >
                {isSubmitting ? "Creating..." : "Add Milestone"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MilestoneModal;