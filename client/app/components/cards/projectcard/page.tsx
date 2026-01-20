"use client";
import { ChevronRight } from "lucide-react";

export interface Project {
  _id: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "high" | "medium" | "low";
  projectStatus: "active" | "inactive" | "completed";
  status: string;
  teamMembers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }>;
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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Get first letter of each name
  const getInitial = (teamMember: { name: string }) => {
    return teamMember.name.charAt(0).toUpperCase();
  };

  // Determine how many avatars to show
  const displayTeam = project.teamMembers?.slice(0, 3) || [];
  const remainingCount = (project.teamMembers?.length || 0) - displayTeam.length;

  // Calculate days until end date
  const getDaysRemaining = () => {
    const end = new Date(project.endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calculate completion percentage based on date range
  const getCompletionPercentage = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    const percentage = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return Math.round(percentage);
  };

  const completion = getCompletionPercentage();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white w-65 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-900 font-light mb-1 text-sm whitespace-nowrap">
            {project.projectName}
          </h3>
          <p className="text-xs font-light">
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
          </p>
        </div>

        <span
          className={`text-xs font-light px-2 py-1 rounded ${
            project.projectStatus === "active" ? "text-green-400" : "text-gray-700"
          }`}
        >
          {project.projectStatus}
        </span>
      </div>

      <div>
        <div className="text-xs font-light text-gray-600">{project.userId?.name || 'Unassigned'}</div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{project.description || 'No description'}</span>
          <span
            className={`text-xs px-1 py-1 rounded ${
              project.priority === "high" ? "text-red-400" : 
              project.priority === "medium" ? "text-yellow-500" : "text-gray-600"
            }`}
          >
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
          </span>
        </div>

        <div className="w-full">
          <div className="relative w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-end px-2 text-xs font-light text-black">
              {completion}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-2">
          {displayTeam.length > 0 ? (
            <>
              {displayTeam.map((member, index) => (
                <div
                  key={member._id || index}
                  className="w-5 h-5 rounded-full bg-neutral-800 border-1 border-white flex items-center justify-center text-xs font-light text-white"
                  title={member.name}
                >
                  {getInitial(member)}
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
            </>
          ) : (
            <span className="text-xs text-gray-400">No team members</span>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}