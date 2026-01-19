"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Activity from "@/app/components/activity/page";
import ButtonPink from "@/app/components/button/pinkbutton/page";
import ButtonWhite from "@/app/components/button/whitebutton/page";
import ProjectCard, { Project } from "@/app/components/cards/projectcard/page";
import StatCard from "@/app/components/cards/statscard/page";
import CreateProjectModal from "../../components/modal/createprojectmodal/page";
import DashboardLayout from "@/app/components/dashboard/dashboardlayout/page";
import { List, Grid3X3, Folder, Users, ClockArrowDown } from "lucide-react";
import { GiProgression } from "react-icons/gi";

const statsData = [
  {
    label: "Total Projects",
    value: 12,
    icon: Folder,
    link: "View all Projects",
  },
  {
    label: "Active Milestones",
    value: 12,
    icon: GiProgression,
    link: "View all Milestones",
  },
  {
    label: "Team Members",
    value: 12,
    icon: Users,
    link: "View all Team Members",
  },
  {
    label: "Delays",
    value: 12,
    icon: ClockArrowDown,
    link: "View all Delays",
  },
];

const activityData = [
  {
    id: 1,
    heading: "Developer Updated Milestone ETA",
    projectName: "ABC Project",
    updatedby: "John Doe",
    time: "2 hours ago",
  },
  {
    id: 2,
    heading: "Developer Updated Milestone ETA",
    projectName: "XYZ Project",
    updatedby: "Jane Smith",
    time: "55 minutes ago",
  },
  {
    id: 3,
    heading: "Developer Updated Milestone ETA",
    projectName: "XYZ Project",
    updatedby: "Jane Smith",
    time: "2 day ago",
  },
  {
    id: 4,
    heading: "Developer Updated Milestone ETA",
    projectName: "XYZ Project",
    updatedby: "Jane Smith",
    time: "1 day ago",
  },
];

function TeamAvatars({ team }: { team?: any[] }) {
  const getInitial = (member: any) => {
    try {
      // If member is a string
      if (typeof member === "string") {
        return member.charAt(0).toUpperCase();
      }
      // If member is an object with a name property
      if (typeof member === "object" && member !== null) {
        const name = member.name || member.username || member.email || "";
        if (name) return name.charAt(0).toUpperCase();
      }
      // If member is a number or other type
      const stringValue = String(member || "?");
      return stringValue.charAt(0).toUpperCase();
    } catch (error) {
      return "?";
    }
  };

  const getMemberName = (member: any, index: number) => {
    try {
      if (typeof member === "string") return member;
      if (typeof member === "object" && member !== null) {
        return (
          member.name || member.username || member.email || `Member ${index + 1}`
        );
      }
      return `Member ${index + 1}`;
    } catch (error) {
      return `Member ${index + 1}`;
    }
  };

  const displayTeam = Array.isArray(team) ? team.slice(0, 3) : [];
  const remainingCount = Math.max(0, (team?.length || 0) - displayTeam.length);

  return (
    <div className="flex -space-x-2">
      {displayTeam.map((member, index) => {
        const memberName = getMemberName(member, index);
        return (
          <div
            key={index}
            className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
            title={memberName}
          >
            {getInitial(member)}
          </div>
        );
      })}
      {remainingCount > 0 && (
        <div
          className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700"
          title={`+${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.toggle("modal-open", isModalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen]);

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

      // Assuming the API returns projects in response.data or response.data.projects
      const projects = response.data.projects || response.data;
      setProjectData(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to fetch projects"
        );
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

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchProjects(); // Refresh the project list
  };

  const activitySection = (
    <div className="rounded-xl bg-white border-gray-100 overflow-hidden">
      {activityData.map((activity) => (
        <Activity key={activity.id} activity={activity} />
      ))}
    </div>
  );

  return (
    <>
      <DashboardLayout>
        <div className="space-y-4">
          <div className="bg-[#242424] border rounded-xl p-5">
            <h1 className="text-xl font-bold text-gray-50">
              Project Dashboard
            </h1>
            <p className="text-gray-100 text-sm">Monitor and manage your projects</p>

            <div className="gap-4 mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statsData.map((item, index) => (
                <StatCard key={index} {...item} />
              ))}
            </div>
          </div>

          {view === "grid" ? (
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center justify-between w-2/3 pr-6">
                <h1 className="text-xl font-bold">
                  Projects ({projectData.length})
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Grid3X3
                      onClick={() => setView("grid")}
                      className="w-7 h-7 cursor-pointer text-gray-700 bg-gray-200 rounded-md p-1"
                    />
                    <List
                      onClick={() => setView("list")}
                      className="w-7 h-7 cursor-pointer text-gray-400 hover:text-gray-700"
                    />
                  </div>
                  <ButtonWhite
                    className="p-1 rounded-lg border-white bg-white text-black whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                    buttonname="All Status"
                    options={[
                      { label: "Option 1", value: "opt1" },
                      { label: "Option 2", value: "opt2" },
                      { label: "Option 3", value: "opt3" },
                    ]}
                    onSelect={(option) => console.log(option.value)}
                  />
                  <ButtonWhite
                    className="p-1 rounded-lg border-white bg-white whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                    buttonname="All Priority"
                    options={[
                      { label: "Option 1", value: "opt1" },
                      { label: "Option 2", value: "opt2" },
                      { label: "Option 3", value: "opt3" },
                    ]}
                    onSelect={(option) => console.log(option.value)}
                  />
                  <ButtonPink
                    buttonname="+ Quick Add"
                    className="bg-pink-600 hover:bg-pink-700 px-2 py-1 rounded-lg text-white text-sm font-semibold whitespace-nowrap"
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              </div>
              <div className="w-1/3">
                <h1 className="text-xl font-bold">Recent Activity</h1>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between py-3">
              <h1 className="text-xl font-bold">
                Projects ({projectData.length})
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Grid3X3
                    onClick={() => setView("grid")}
                    className="w-7 h-7 cursor-pointer text-gray-400 hover:text-gray-700"
                  />
                  <List
                    onClick={() => setView("list")}
                    className="w-7 h-7 cursor-pointer text-gray-700 bg-gray-200 rounded-md p-1"
                  />
                </div>
                <ButtonWhite
                  className="p-1 rounded-lg bg-white text-black whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 flex items-center justify-center"
                  buttonname="All Status"
                  options={[
                    { label: "Option 1", value: "opt1" },
                    { label: "Option 2", value: "opt2" },
                    { label: "Option 3", value: "opt3" },
                  ]}
                  onSelect={(option) => console.log(option.value)}
                />
                <ButtonWhite
                  className="p-1 rounded-lg bg-white text-black whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                  buttonname="All Priority"
                  options={[
                    { label: "Option 1", value: "opt1" },
                    { label: "Option 2", value: "opt2" },
                    { label: "Option 3", value: "opt3" },
                  ]}
                  onSelect={(option) => console.log(option.value)}
                />
                <ButtonPink
                  className="py-1 px-4 rounded-lg bg-pink-500 text-white text-sm font-medium whitespace-nowrap hover:bg-pink-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                  buttonname="+ Quick Add"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading projects...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Projects Display */}
          {!loading && !error && view === "grid" ? (
            <div className="flex gap-6">
              <div className="w-3/4">
                {projectData.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No projects found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectData.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                )}
              </div>
              <div className="w-1/3">{activitySection}</div>
            </div>
          ) : !loading && !error ? (
            <div className="flex flex-col gap-4">
              {projectData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No projects found
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white text-black text-base font-semibold">
                        <tr>
                          <th className="px-2 py-3">Project Name</th>
                          <th className="px-2 py-3">Client</th>
                          <th className="px-2 py-3">Status</th>
                          <th className="px-2 py-3">Progress</th>
                          <th className="px-2 py-3">Team</th>
                          <th className="px-2 py-3">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectData.map((project) => (
                          <tr
                            key={project._id}
                            className="hover:bg-gray-50 transition text-xs text-gray-500"
                          >
                            <td className="px-2 py-3 font-medium">{project.projectName || 'N/A'}</td>
                            <td className="px-2 py-3">{project.userId?.name || 'N/A'}</td>
                            <td className="px-2 py-3 capitalize">{project.projectStatus || 'N/A'}</td>
                            <td className="px-2 py-3">{project.priority || 'N/A'}</td>
                            <td className="px-2 py-3">
                              <TeamAvatars team={project.teamMembers} />
                            </td>
                            <td className="px-4 py-3">
                              {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-4">Recent Activity</h1>
                    {activitySection}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </DashboardLayout>

      {/* Modal - Rendered outside DashboardLayout */}
      {isModalOpen && <CreateProjectModal onClose={handleModalClose} />}
    </>
  );
}