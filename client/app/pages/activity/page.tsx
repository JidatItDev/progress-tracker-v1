"use client";

import DashboardLayout from "@/app/components/dashboard/dashboardlayout/page";
import SearchBar from "@/app/components/searchbar/page";
import { CircleCheckBig, File, LockKeyhole, Milestone } from "lucide-react";
import { JSX } from "react";

interface ActivityProps {
  id: number;
  title: string;
  description: string;
  tag: string;
  team: string;
  time: string;
  icon: JSX.Element;
}

const activityData: ActivityProps[] = [
  {
    id: 1,
    title: "Milestone ETA updated",
    description: "Website Redesign – Design Phase moved to Dec 15",
    tag: "milestone updated",
    team: "Dev Team",
    time: "2 minutes ago",
    icon: <LockKeyhole />,
  },
  {
    id: 2,
    title: "Milestone Completed",
    description: "Website Redesign – Design Phase moved to Dec 15",
    tag: "milestone updated",
    team: "Dev Team",
    time: "2 minutes ago",
    icon: <CircleCheckBig />,
  },
  {
    id: 3,
    title: "Milestone Overdue",
    description: "Website Redesign – Design Phase moved to Dec 15",
    tag: "milestone updated",
    team: "Dev Team",
    time: "2 minutes ago",
    icon: <Milestone />,
  },
  {
    id: 4,
    title: "New Project Created",
    description: "Website Redesign – Design Phase moved to Dec 15",
    tag: "milestone updated",
    team: "Dev Team",
    time: "2 minutes ago",
    icon: <File />,
  },
];

const ActivityPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Recent Activity</h1>
        <p className="text-gray-500">Monitor and manage your projects</p>
      </div>

      <div className="bg-white p-3 rounded-md mb-6">
        <SearchBar onSearch={(value) => console.log(value)} />
      </div>

      <div className="bg-white rounded-md p-4">
        <div className="relative  border-l-2 border-black ml-4">
          {activityData.map((activity) => (
            <div key={activity.id} className="flex gap-4 mb-6 relative">
              <div
                className={`w-8 h-8 flex items-center justify-center bg-green-100 rounded-full absolute -left-4`}
              >
                <span className="text-sm">{activity.icon}</span>
              </div>

              <div className="ml-6 w-full">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{activity.title}</h3>
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                    {activity.tag}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <span>{activity.team}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityPage;
