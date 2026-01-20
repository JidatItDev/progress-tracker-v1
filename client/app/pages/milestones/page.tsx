"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ButtonPink from "@/app/components/button/pinkbutton/page";
import MilestoneCard from "@/app/components/cards/milestonecard/page";
import DashboardLayout from "@/app/components/dashboard/dashboardlayout/page";
import SearchBar from "@/app/components/searchbar/page";
import MilestoneModal from "@/app/components/modal/milestonemodal/page";

interface ProjectId {
  _id: string;
  projectName: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface Milestone {
  _id: string;
  projectId: ProjectId; // This is an object, not a string
  milestoneName: string;
  description: string;
  startDate: string;
  endDate: string;
  milestoneStatus?: string;
  status?: string;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

const Milestones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [filteredMilestones, setFilteredMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.classList.toggle("modal-open", isModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

  // Fetch milestones on component mount
  useEffect(() => {
    fetchMilestones();
  }, []);

  // Filter milestones when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMilestones(milestones);
    } else {
      const filtered = milestones.filter(
        (milestone) =>
          milestone.milestoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          milestone.projectId?.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          milestone.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMilestones(filtered);
    }
  }, [searchQuery, milestones]);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getMilestones`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Milestones fetched:", response.data);

      // Handle different response structures
      const milestonesData = response.data.milestones || response.data || [];
      setMilestones(milestonesData);
      setFilteredMilestones(milestonesData);

      if (milestonesData.length === 0) {
        toast.info("No milestones found");
      }
    } catch (err) {
      console.error("❌ Error fetching milestones:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to fetch milestones";
        toast.error(errorMsg);
      } else {
        toast.error("Failed to fetch milestones");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh milestones after adding a new one
    fetchMilestones();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Transform milestone data to match MilestoneCard expected format
  const transformMilestoneData = (milestone: Milestone) => {
    return {
      id: milestone._id,
      title: milestone.milestoneName,
      date: milestone.endDate || milestone.startDate,
      projectName: milestone.projectId?.projectName || "Unknown Project",
      status: milestone.milestoneStatus || milestone.status || "active",
      progress: milestone.progress || 0,
      description: milestone.description,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      projectId: milestone.projectId?._id || "", // Extract the _id from projectId object
      projectData: milestone.projectId, // Keep the entire project data
    };
  };

  return (
    <DashboardLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />

      <div className="px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Milestones</h1>
          <ButtonPink
            buttonname="+ Add Milestone"
            className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-lg text-white text-sm font-semibold"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        <div className="py-6 w-full">
          <SearchBar 
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={handleSearchChange}
            placeholder="Search milestones by name, project, or description..."
          />
        </div>

        {isModalOpen && <MilestoneModal onClose={handleModalClose} />}
      </div>

      <div className="space-y-6 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {searchQuery ? "No milestones found matching your search" : "No milestones yet"}
            </div>
            {!searchQuery && (
              <p className="text-gray-500 text-sm mt-2"> Click &quot;Add Milestone&quot; to create your first milestone </p>
            )}
          </div>
        ) : (
          filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone._id}
              milestone={transformMilestoneData(milestone)}
            />
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default Milestones;