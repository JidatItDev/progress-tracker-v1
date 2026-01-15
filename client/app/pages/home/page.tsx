"use client";

import { useState } from "react";
import Activity from "@/app/components/activity/page";
import ButtonPink from "@/app/components/button/pinkbutton/page";
import ButtonWhite from "@/app/components/button/whitebutton/page";
import ProjectCard, { Project } from "@/app/components/cards/projectcard/page";
import StatCard from "@/app/components/cards/statscard/page";
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

function TeamAvatars({ team }: { team?: string[] }) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const displayTeam = team?.slice(0, 3) || [];
  const remainingCount = (team?.length || 0) - displayTeam.length;

  return (
    <div className="flex -space-x-2">
      {displayTeam.map((memberName, index) => (
        <div
          key={index}
          className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
          title={memberName}
        >
          {getInitial(memberName)}
        </div>
      ))}
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

  const activitySection = (
    <div className="rounded-xl bg-white border-gray-100 overflow-hidden">
      {activityData.map((activity) => (
        <Activity key={activity.id} activity={activity} />
      ))}
    </div>
  );

  return (
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
                  className=" p-1  rounded-lg border-white bg-white text-black whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                  buttonname="All Status"
                  options={[
                    { label: "Option 1", value: "opt1" },
                    { label: "Option 2", value: "opt2" },
                    { label: "Option 3", value: "opt3" },
                  ]}
                  onSelect={(option) => console.log(option.value)}
                />
                <ButtonWhite
                  className="  p-1  rounded-lg border-white bg-white whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                  buttonname="All Priority"
                  options={[
                    { label: "Option 1", value: "opt1" },
                    { label: "Option 2", value: "opt2" },
                    { label: "Option 3", value: "opt3" },
                  ]}
                  onSelect={(option) => console.log(option.value)}
                />{" "}
                <ButtonPink
                  className=" py-1 px-4 rounded-lg w-full  bg-pink-500 text-white text-sm font-medium hover:bg-pink-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                  buttonname="+ Quick Add"
                  onClick={() => console.log("Quick Add Button")}
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
                className=" p-1  rounded-lg  bg-white text-black whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 flex items-center justify-center"
                buttonname="Select Option"
                options={[
                  { label: "Option 1", value: "opt1" },
                  { label: "Option 2", value: "opt2" },
                  { label: "Option 3", value: "opt3" },
                ]}
                onSelect={(option) => console.log(option.value)}
              />
              <ButtonWhite
                className=" p-1  rounded-lg  bg-white text-black whitespace-nowrap text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                buttonname="Select Option"
                options={[
                  { label: "Option 1", value: "opt1" },
                  { label: "Option 2", value: "opt2" },
                  { label: "Option 3", value: "opt3" },
                ]}
                onSelect={(option) => console.log(option.value)}
              />{" "}
              <ButtonPink
                className=" py-1 px-4 rounded-lg w-full  bg-pink-500 text-white text-sm font-medium hover:bg-pink-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                buttonname="+ Quick Add"
                onClick={() => console.log("Quick Add Button")}
              />
            </div>
          </div>
        )}

        {view === "grid" ? (
          <div className="flex gap-6">
            <div className="w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectData.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
            <div className="w-1/3">{activitySection}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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
                      key={project.id}
                      className="hover:bg-gray-50 transition text-xs text-gray-500"
                    >
                      <td className="px-2 py-3 font-medium">{project.name}</td>
                      <td className="px-2 py-3">{project.client}</td>
                      <td className="px-2 py-3 capitalize">{project.status}</td>
                      <td className="px-2 py-3">{project.progress}</td>
                      <td className="px-2 py-3">
                        <TeamAvatars team={project.team} />
                      </td>
                      <td className="px-4 py-3">{project.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-4">Recent Activity</h1>
              {activitySection}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
