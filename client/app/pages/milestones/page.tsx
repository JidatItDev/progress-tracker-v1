"use client";

import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ButtonPink from "@/app/components/button/pinkbutton/page";
import MilestoneCard from "@/app/components/cards/milestonecard/page";
import DashboardLayout from "@/app/components/dashboard/dashboardlayout/page";
import SearchBar from "@/app/components/searchbar/page";
import MilestoneModal from "@/app/components/modal/milestonemodal/page";

const milestonesdata = [
  {
    id: 1,
    title: "Design Phase",
    date: "2023-06-10",
    projectName: "Website Redesign",
    status: "completed",
    progress: 100,
  },
  {
    id: 2,
    title: "Development Phase",
    date: "2023-06-20",
    projectName: "Website Redesign",
    status: "active",
    progress: 60,
  },
];

const Milestones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    document.body.classList.toggle("modal-open", isModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);
 
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
          <SearchBar onSearch={(value) => console.log(value)} />
        </div>

        {isModalOpen && (
          <MilestoneModal onClose={() => setIsModalOpen(false)} />
        )}
      </div>

      <div className="space-y-6 p-6">
        {milestonesdata.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Milestones;