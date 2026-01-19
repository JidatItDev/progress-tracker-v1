"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DashboardLayout from "../../components/dashboard/dashboardlayout/page";
import ProjectCard, { Project } from "../../components/cards/projectcard/page";
import Link from "next/link";
import CreateProjectModal from "../../components/modal/createprojectmodal/page";
import ButtonPink from "@/app/components/button/pinkbutton/page";

const projectData: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    milestones: 5,
    status: "active",
    client: "ABC Company",
    progress: "In Progress",
    priority: "High",
    completion: 50,
    team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Mobile App Development",
    milestones: 8,
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 84,
    team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    time: "1 day ago",
  },
  {
    id: 3,
    name: "App Development",
    milestones: 3,
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    time: "2 hours ago",
  },
  {
    id: 4,
    name: "App Development",
    milestones: 3,
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    time: "2 hours ago",
  },
  {
    id: 5,
    name: "App Development",
    milestones: 3,
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    time: "2 hours ago",
  },
  {
    id: 6,
    name: "App Development",
    milestones: 3,
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: ["Alice Johnson", "Bob Smith", "Charlie Brown"],
    time: "2 hours ago",
  },
];

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.toggle("modal-open", isModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

  return (
    <>
      {/*  ToastContainer lives on THIS page */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />

      <DashboardLayout>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projects</h1>
          <ButtonPink
            buttonname="+ Create Project"
            className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-lg text-white text-sm font-semibold"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Projects grid */}
        <div className="flex flex-wrap gap-6 mt-6">
          {projectData.map((project) => (
            <Link
              key={project.id}
              href={`/pages/projects/${project.id}`}
              className="block"
            >
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      </DashboardLayout>

      {isModalOpen && (
        <CreateProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Projects;
