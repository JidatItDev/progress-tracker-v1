"use client";
import { ChevronRight } from "lucide-react";

export interface Project {
  id: number;
  name: string;
  milestones: number;
  status: "active" | "inactive";
  client: string;
  progress: string;
  priority: "High" | "Medium" | "Low";
  completion: number;
  time: string;
  team?: string[]; // Array of team member names
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Get first letter of each name
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Determine how many avatars to show
  const displayTeam = project.team?.slice(0, 3) || [];
  const remainingCount = (project.team?.length || 0) - displayTeam.length;

  return (
    <div className="bg-white w-55 rounded-lg p-3  shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 ">
        <div>
          <h3 className="text-gray-900 font-light mb-1 text-sm whitespace-nowrap ">
            {project.name}
          </h3>
          <p className="text-xs font-light">
            Milestones: {project.milestones}
          </p>
        </div>

        <span
          className={`text-xs font-light px-2 py-1 rounded ${
            project.status === "active" ? "text-green-400" : "text-gray-700"
          }`}
        >
          {project.status}
        </span>
      </div>

      <div>
        <div className="text-xs font-light text-gray-600">{project.client}</div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{project.progress}</span>
          <span
            className={`text-xs px-1 py-1 rounded ${
              project.priority === "High" ? "text-red-400" : "text-gray-600"
            }`}
          >
            {project.priority}
          </span>
        </div>

        <div className="w-full">
          <div className="relative w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${project.completion}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-end px-2 text-xs font-light text-black">
              {project.completion}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-2">
          {displayTeam.map((memberName, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full bg-neutral-800 border-1 border-white flex items-center justify-center text-xs font-light text-white"
              title={memberName}
            >
              {getInitial(memberName)}
            </div>
          ))}
          {remainingCount > 0 && (
            <div
              className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700"
              title={`+${remainingCount} more`}
            >
              +{remainingCount}
            </div>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
