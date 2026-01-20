"use client";

import { useState } from "react";
import axios from "axios";
import InputField from "@/app/components/inputfield/page";
import { toast } from "react-toastify";

interface SubMilestoneModalProps {
  onClose: () => void;
  milestoneId: string;
  projectId: string;
}

const SubMilestoneModal = ({ onClose, milestoneId, projectId }: SubMilestoneModalProps) => {
  const [subMilestoneName, setSubMilestoneName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!subMilestoneName.trim()) {
      toast.error("Sub-milestone name is required");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error("Start date and end date are required");
      return;
    }
    
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }
    
    if (!milestoneId) {
      toast.error("Milestone ID is missing");
      return;
    }
    
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    const subMilestoneData = {
      projectId: projectId,
      milestoneId: milestoneId,
      submilestoneName: subMilestoneName,
      description: description,
      startDate: startDate,
      endDate: endDate
    };

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      console.log("📤 Creating sub-milestone with data:", subMilestoneData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/createSubMilestone`,
        subMilestoneData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Sub-milestone created:", response.data);
      
      toast.success("Sub-milestone added successfully!");
      
      // Close modal after successful creation
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (err) {
      console.error("❌ Error creating sub-milestone:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to create sub-milestone";
        toast.error(errorMsg);
      } else {
        toast.error("Failed to create sub-milestone");
      }
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-xl font-semibold text-gray-800">Add Sub Milestone</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new sub-milestone with essential details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sub-Milestone Name */}
            <InputField
              id="subMilestoneName"
              label="Sub-Milestone Name*"
              value={subMilestoneName}
              onChange={(e) => setSubMilestoneName(e.target.value)}
              placeholder="Enter Sub-Milestone Name..."
              required
              disabled={isSubmitting}
            />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the sub-milestone..."
                rows={3}
                required
                disabled={isSubmitting}
                className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Date*
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  End Date*
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Note:</span> This sub-milestone will be created for:
              </p>
              <p className="text-xs text-gray-500 mt-1">
                • Project ID: <span className="font-mono">{projectId.substring(0, 8)}...</span>
              </p>
              <p className="text-xs text-gray-500">
                • Milestone ID: <span className="font-mono">{milestoneId.substring(0, 8)}...</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-pink-600 px-5 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  "+ Add Sub-Milestone"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubMilestoneModal;