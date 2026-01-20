"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonPink from "../../button/pinkbutton/page";
import { CirclePlus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import SubMilestoneModal from "../../modal/submilestonemodal/page";
import AddDelayModal from "../../modal/delaymodal/page";

interface Milestone {
  id: string;
  title: string;
  date: string;
  projectName: string;
  status: string;
  progress: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  projectId: string;
  projectData?: unknown;
}

interface SubMilestone {
  _id: string;
  subMilestoneName: string;
  progress: number;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

const MilestoneCard = ({ milestone }: { milestone: Milestone }) => {
  const [showSubMilestones, setShowSubMilestones] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [subMilestones, setSubMilestones] = useState<SubMilestone[]>([]);
  const [isLoadingSubMilestones, setIsLoadingSubMilestones] = useState(false);

  // Calculate milestone progress based on sub-milestones
  const milestoneProgress =
    subMilestones.length > 0
      ? Math.round(
          subMilestones.reduce((acc, sm) => acc + sm.progress, 0) /
            subMilestones.length
        )
      : milestone.progress;

  // Fetch sub-milestones when the dropdown is opened
  useEffect(() => {
    if (showSubMilestones && subMilestones.length === 0) {
      fetchSubMilestones();
    }
  }, [showSubMilestones]);

  // Handle body scroll lock for any modal
  useEffect(() => {
    const isAnyModalOpen = isModalOpen || isDelayModalOpen;
    document.body.classList.toggle("modal-open", isAnyModalOpen);

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpen, isDelayModalOpen]);

  const fetchSubMilestones = async () => {
    setIsLoadingSubMilestones(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const projectId = milestone.projectId;
      const milestoneId = milestone.id;

      if (!projectId || !milestoneId) {
        console.warn("Missing projectId or milestoneId", {
          projectId,
          milestoneId,
          milestone,
        });
        toast.error("Missing project information");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getSubMilestones`,
        {
          params: {
            projectId: projectId,
            milestoneId: milestoneId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Sub-milestones fetched:", response.data);

      const subMilestonesData =
        response.data.subMilestones || response.data || [];
      setSubMilestones(subMilestonesData);

      if (subMilestonesData.length === 0) {
        console.log("No sub-milestones found for this milestone");
      }
    } catch (err) {
      console.error("❌ Error fetching sub-milestones:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch sub-milestones";
        toast.error(errorMsg);
      } else {
        toast.error("Failed to fetch sub-milestones");
      }
    } finally {
      setIsLoadingSubMilestones(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh sub-milestones after adding a new one
    fetchSubMilestones();
  };

  const handleDeleteSubMilestone = async (subMilestoneId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/deleteSubMilestone/${subMilestoneId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🗑️ Sub-milestone deleted:", response.data);
      toast.success("Sub-milestone deleted successfully!");

      // Refresh sub-milestones list
      fetchSubMilestones();
    } catch (err) {
      console.error("❌ Error deleting sub-milestone:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || "Failed to delete sub-milestone";
        toast.error(errorMsg);
      } else {
        toast.error("Failed to delete sub-milestone");
      }
    }
  };

  const handleUpdateSubMilestone = (subMilestoneId: string) => {
    // TODO: Implement update modal
    console.log("Update sub-milestone:", subMilestoneId);
    toast.info("Update functionality to be implemented");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Main Milestone Card */}
      <div className="p-5 flex justify-between items-center">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
            <span className="text-xs text-gray-400">
              📅 {new Date(milestone.date).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-3">{milestone.projectName}</p>

          <button
            onClick={() => setShowSubMilestones((prev) => !prev)}
            className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold flex items-center gap-1 hover:bg-gray-800 transition-colors"
          >
            Sub Milestones{" "}
            {subMilestones.length > 0 && `(${subMilestones.length})`}
            {showSubMilestones ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-2 w-1/3">
          <div className="flex justify-end px-2">
            <span
              className={`text-xs font-medium ${
                milestone.status === "active"
                  ? "text-green-500"
                  : milestone.status === "completed"
                  ? "text-blue-600"
                  : milestone.status === "delayed"
                  ? "text-orange-500"
                  : "text-gray-500"
              }`}
            >
              • {milestone.status}
            </span>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-pink-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${milestoneProgress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-end px-2 text-xs font-semibold">
              {milestoneProgress}%
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsDelayModalOpen(true)}
              className="px-4 py-2 w-30 border rounded-full bg-white text-black text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Delay
            </button>
          </div>
        </div>
      </div>

      {/* Sub Milestones */}
      {showSubMilestones && (
        <div className="px-5 pb-5 pt-4 border-t space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-700">
              Sub-Milestones
            </h4>
            <ButtonPink
              buttonname="+ Add Sub-Milestone"
              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          {isLoadingSubMilestones ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : subMilestones.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No sub-milestones yet. Click &quot;Add Sub-Milestone&quot; to
              create one.
            </div>
          ) : (
            subMilestones.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center gap-4 pl-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1 min-w-[140px]">
                  <span className="text-sm text-gray-700 font-medium">
                    {sub.subMilestoneName}
                  </span>
                  {sub.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {sub.description}
                    </p>
                  )}
                </div>

                <div className="flex-1 max-w-md">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>

                <span className="text-xs font-medium text-gray-600 w-10 text-right">
                  {sub.progress}%
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSubMilestone(sub._id)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title="Edit sub-milestone"
                  >
                    <CirclePlus size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubMilestone(sub._id)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                    title="Delete sub-milestone"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <SubMilestoneModal
          onClose={handleModalClose}
          milestoneId={milestone.id}
          projectId={milestone.projectId}
        />
      )}

      {isDelayModalOpen && (
        <AddDelayModal
          onClose={() => setIsDelayModalOpen(false)}
          milestoneId={milestone.id}
          projectId={milestone.projectId}
        />
      )}
    </div>
  );
};

export default MilestoneCard;
