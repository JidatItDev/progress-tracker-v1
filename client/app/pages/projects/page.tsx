"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DashboardLayout from "../../components/dashboard/dashboardlayout/page";
import ProjectCard, { Project } from "../../components/cards/projectcard/page";
import Link from "next/link";
import CreateProjectModal from "../../components/modal/createprojectmodal/page";
import ButtonPink from "@/app/components/button/pinkbutton/page";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
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
      console.log(response,"rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")

      const projects = response.data.projects || response.data;
      setProjectData(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch projects");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.toggle("modal-open", isModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

  // Refresh projects after creating a new one
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchProjects(); // Refresh the project list
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />

      <DashboardLayout>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Projects {!loading && `(${projectData.length})`}
          </h1>
          <ButtonPink
            buttonname="+ Create Project"
            className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-lg text-white text-sm font-semibold"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Loading State */}
        {loading && (
           <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-6">
            {error}
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-6 mt-6  rounded-lg justify-center p-5">
            {projectData.length === 0 ? (
              <div className="text-center w-full py-12 text-gray-500">
                No projects found. Create your first project!
              </div>
            ) : (
              projectData.map((project) => (
                <Link
                  key={project._id}
                  href={`/pages/projects/${project._id}`}
                  className="block"
                >
                  <ProjectCard project={project} />
                </Link>
              ))
            )}
          </div>
        )}
      </DashboardLayout>

      {isModalOpen && <CreateProjectModal onClose={handleModalClose} />}
    </>
  );
};

export default Projects;