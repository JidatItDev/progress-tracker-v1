"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import axios from "axios";
import DashboardLayout from "../../../components/dashboard/dashboardlayout/page";
import Tabs from "@/app/components/tabscomponent/page";
import Image from "next/image";
import MilestoneCard from "../../../components/cards/milestonecard/page";

export interface Milestone {
  _id: string;
  title: string;
  date: string;
  projectName: string;
  status: string;
  progress: number;
}

interface Team {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Activity {
  _id: string;
  updatedby: string;
  updatedtime: string;
  updateddate: string;
  time: string;
}

interface Project {
  _id: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "high" | "medium" | "low";
  projectStatus: "active" | "inactive" | "completed";
  status: string;
  teamMembers: Team[];
  milestones?: Milestone[];
  activity?: Activity[];
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ProjectPage = () => {
  const params = useParams();
  const id = params?.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found");
          return;
        }

        // First, fetch all projects
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getProjects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const projects = response.data.projects || response.data;
        
        // Find the specific project by ID
        const foundProject = projects.find((p: Project) => p._id === id);
        
        if (!foundProject) {
          setError("Project not found");
          return;
        }

        if (!foundProject) {
          setError("Project not found");
          return;
        }

        setProject(foundProject);
      } catch (err) {
        console.error("Error fetching project:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("Project not found");
          } else {
            setError(err.response?.data?.message || "Failed to fetch project");
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calculate completion percentage
  const getCompletionPercentage = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    const percentage = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return Math.round(percentage);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading project...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Project not found"}
        </div>
      </DashboardLayout>
    );
  }

  // Calculate milestone summary
  const totalMilestones = project.milestones?.length || 0;
  const completedMilestones = project.milestones?.filter(
    (m) => m.status === "completed"
  ).length || 0;
  const remainingMilestones = totalMilestones - completedMilestones;
  const completion = getCompletionPercentage(project.startDate, project.endDate);
  const daysRemaining = getDaysRemaining(project.endDate);

  return (
    <DashboardLayout>
      <div className="max-w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-black">
            Project: {project.projectName}
          </h1>
          <p className="text-base text-gray-500">
            Client: {project.userId?.name || 'Unassigned'}
          </p>
        </div>
        <Tabs tabs={["Overview", "Milestones", "Members", "Activity"]}>
          {{
            Overview: (
              <>
                <div className="flex gap-4">
                  {/* Left Side*/}
                  <div className="flex-1 bg-white p-8 rounded-xl">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Project Overview
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-8">
                      {project.description || 'No description available'}
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 space-y-4 mt-5 ">
                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          Start Date
                        </p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <span className="text-gray-400">📅</span>{" "}
                          {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          End Date
                        </p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <span className="text-gray-400">📅</span>{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          Status
                        </p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {project.projectStatus}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          Days Remaining
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side*/}
                  <div className="w-80 bg-gray-900 p-6 rounded-xl relative">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-normal font-semibold text-white px-2">
                        Progress Summary
                      </h2>
                      <span className="text-xs text-pink-500 font-semibold p-2 capitalize">
                        {project.priority}
                      </span>
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-white mb-2">
                        {completion}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones summary */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white">
                        <span>Completed</span>
                        <span className="font-medium">
                          {completedMilestones} milestones
                        </span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>In Progress</span>
                        <span className="font-medium">
                          {totalMilestones - completedMilestones - remainingMilestones}{" "}
                          milestones
                        </span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Upcoming</span>
                        <span className="font-medium">
                          {remainingMilestones} milestones
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold text-gray-900">
                      Team Members
                    </h1>
                  </div>

                  <div className="flex gap-3">
                    {project.teamMembers && project.teamMembers.length > 0 ? (
                      project.teamMembers.map((member) => (
                        <div
                          key={member._id}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 capitalize">
                                {member.role}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {member.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No team members assigned</p>
                    )}
                  </div>
                </div>
              </>
            ),

            Milestones: (
              <div className="space-y-4">
                {project.milestones && project.milestones.length > 0 ? (
                  project.milestones.map((milestone) => (
                    <MilestoneCard key={milestone._id} milestone={milestone} />
                  ))
                ) : (
                  <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                    No milestones found for this project
                  </div>
                )}
              </div>
            ),

            Members: (
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Team Members
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    project.teamMembers.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-800 text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="leading-tight">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {member.role}
                          </p>
                          <p className="text-xs text-gray-500">{member.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-3">
                      No team members assigned
                    </p>
                  )}
                </div>
              </div>
            ),

            Activity: (
              <div className="bg-white rounded-lg p-6">
                <h1 className="text-lg font-semibold text-gray-900 mb-4">
                  Activity Log
                </h1>
                {project.activity && project.activity.length > 0 ? (
                  <div className="space-y-4">
                    {project.activity.map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-2 h-2 rounded-full bg-pink-500 mt-2" />

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">
                                Team member{" "}
                                <span className="font-medium text-green-500">
                                  {activity.updatedby}
                                </span>{" "}
                                updated the milestone
                              </p>
                              <div className="inline-block mt-2 px-3 py-1 bg-black text-white text-xs rounded-md">
                                {new Date(activity.updateddate).toLocaleDateString()}
                              </div>
                            </div>

                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No activity to display
                  </p>
                )}
              </div>
            ),
          }}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProjectPage;