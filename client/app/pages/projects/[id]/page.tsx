"use Client";
import { notFound } from "next/navigation";
import DashboardLayout from "../../../components/dashboard/dashboardlayout/page";
import Tabs from "@/app/components/tabscomponent/page";
import Image from "next/image";
import ButtonPink from "@/app/components/button/pinkbutton/page";
import MilestoneCard from "../../../components/cards/milestonecard/page";
import {useAuthStore} from "@/app/store/useAuthStore";

export interface Milestone {
  id: number;
  title: string;
  date: string;
  projectName: string;
  status: string;
  progress: number;
}

interface Team {
  id: number;
  name: string;
  role: string;
  avatar: string;
}
interface Activity {
  id: number;
  updatedby: string;
  updatedtime: string;
  updateddate: string;
  time: string;
}
export type PermissionAction = "view" | "create" | "update" | "delete";

export type PermissionMap = {
  [resource: string]: Partial<Record<PermissionAction, boolean>>;
};

export type User = {
  id: string;
  name: string;
  role: "admin" | "client" | "user";
  permissions: PermissionMap;
};

interface Project {
  id: number;
  name: string;
  milestones: Milestone[];
  status: "active" | "completed" | "on-hold";
  client: string;
  progress: string;
  priority: "High" | "Medium" | "Low";
  completion: number;
  team: Team[];
  activity: Activity[];
  time: string;
  startDate: string;
  endDate: string;
  deliveryDate: string;
  daysRemaining: number;
}
const projectData: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    milestones: [
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
      {
        id: 3,
        title: "Testing Phase",
        date: "2023-06-28",
        projectName: "Website Redesign",
        status: "active",
        progress: 30,
      },
    ],
    status: "active",
    activity: [
      {
        id: 1,
        updatedby: "Alice Johnson",
        updatedtime: "2023-06-01T10:00:00",
        updateddate: "2023-06-01",
        time: "2 hours ago",
      },
    ],
    client: "ABC Company",
    progress: "In Progress",
    priority: "High",
    completion: 50,
    team: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Project Manager",
        avatar: "/avatar.png",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Frontend Developer",
        avatar: "/avatar.png",
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "UI/UX Designer",
        avatar: "/avatar.png",
      },
    ],
    time: "2 hours ago",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    deliveryDate: "2023-07-15",
    daysRemaining: 15,
  },
  {
    id: 2,
    name: "Mobile App Development",
    milestones: [
      {
        id: 1,
        title: "Planning",
        date: "2023-06-05",
        projectName: "Mobile App Development",
        status: "completed",
        progress: 100,
      },
      {
        id: 2,
        title: "UI Design",
        date: "2023-06-15",
        projectName: "Mobile App Development",
        status: "active",
        progress: 70,
      },
    ],
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    activity: [
      {
        id: 1,
        updatedby: "Alice Johnson",
        updatedtime: "2023-06-01T10:00:00",
        updateddate: "2023-06-01",
        time: "2 hours ago",
      },
    ],
    team: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Project Manager",
        avatar: "/avatar.png",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Frontend Developer",
        avatar: "/avatar.png",
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "UI/UX Designer",
        avatar: "/avatar.png",
      },
    ],
    time: "2 hours ago",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    deliveryDate: "2023-07-15",
    daysRemaining: 15,
  },
  {
    id: 3,
    name: "App Development",
    milestones: [
      {
        id: 1,
        title: "Backend Setup",
        date: "2023-06-08",
        projectName: "App Development",
        status: "active",
        progress: 45,
      },
    ],
    status: "active",
    activity: [
      {
        id: 1,
        updatedby: "Alice Johnson",
        updatedtime: "2023-06-01T10:00:00",
        updateddate: "2023-06-01",
        time: "2 hours ago",
      },
    ],
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Project Manager",
        avatar: "/avatar.png",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Frontend Developer",
        avatar: "/avatar.png",
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "UI/UX Designer",
        avatar: "/avatar.png",
      },
    ],
    time: "2 hours ago",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    deliveryDate: "2023-07-15",
    daysRemaining: 15,
  },
  {
    id: 4,
    name: "App Development",
    milestones: [
      {
        id: 1,
        title: "API Integration",
        date: "2023-06-12",
        projectName: "App Development",
        status: "active",
        progress: 50,
      },
    ],
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    activity: [
      {
        id: 1,
        updatedby: "Alice Johnson",
        updatedtime: "2023-06-01T10:00:00",
        updateddate: "2023-06-01",
        time: "2 hours ago",
      },
    ],
    completion: 34,
    team: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Project Manager",
        avatar: "/avatar.png",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Frontend Developer",
        avatar: "/avatar.png",
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "UI/UX Designer",
        avatar: "/avatar.png",
      },
    ],
    time: "2 hours ago",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    deliveryDate: "2023-07-15",
    daysRemaining: 15,
  },
  {
    id: 5,
    name: "App Development",
    activity: [
      {
        id: 1,
        updatedby: "Alice Johnson",
        updatedtime: "2023-06-01T10:00:00",
        updateddate: "2023-06-01",
        time: "2 hours ago",
      },
    ],
    milestones: [
      {
        id: 1,
        title: "Quality Assurance",
        date: "2023-06-25",
        projectName: "App Development",
        status: "active",
        progress: 20,
      },
    ],
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Project Manager",
        avatar: "/avatar.png",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Frontend Developer",
        avatar: "/avatar.png",
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "UI/UX Designer",
        avatar: "/avatar.png",
      },
    ],
    time: "2 hours ago",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    deliveryDate: "2023-07-15",
    daysRemaining: 15,
  },
  {
    id: 6,
    name: "App Development",
    activity: [
      {
        id: 1,
        updatedby: "Alice Johnson",
        updatedtime: "2023-06-01T10:00:00",
        updateddate: "2023-06-01",
        time: "2 hours ago",
      },
    ],
    milestones: [
      {
        id: 1,
        title: "Deployment",
        date: "2023-06-30",
        projectName: "App Development",
        status: "active",
        progress: 10,
      },
    ],
    status: "active",
    client: "XYZ Corporation",
    progress: "In Progress",
    priority: "Medium",
    completion: 34,
    team: [
      {
        id: 1,
        name: "Alice Johnson",
        role: "Project Manager",
        avatar: "/avatar.png",
      },
      {
        id: 2,
        name: "Bob Smith",
        role: "Frontend Developer",
        avatar: "/avatar.png",
      },
      {
        id: 3,
        name: "Charlie Brown",
        role: "UI/UX Designer",
        avatar: "/avatar.png",
      },
    ],
    time: "2 hours ago",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    deliveryDate: "2023-07-15",
    daysRemaining: 15,
  },
];

interface ProjectPageProps {
  params: {
    id: string;
  };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user = useAuthStore((s) => s.user);
  if (!user?.permissions.projects?.view && user?.role !== "admin") {
    return <div className="text-red-600">Access Denied</div>;
  }
  const { id } = await params;
  const projectId = Number(id);

  const project = projectData.find((p) => p.id === projectId);

  if (!project) return notFound();

  // Calculate milestone summary for Progress Summary section
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const remainingMilestones = totalMilestones - completedMilestones;

  return (
    <DashboardLayout>
      <div className="max-w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-black">
            Project: {project.name}
          </h1>
          <p className="text-base text-gray-500">Client: {project.client}</p>
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
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quaerat delectus molestiae eaque beatae necessitatibus
                      maxime accusantium sequi recusandae, tenetur repellat
                      omnis, est architecto et quisquam iure quo. Accusantium,
                      rerum itaque.
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 space-y-4 mt-5 ">
                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          Start Date
                        </p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <span className="text-gray-400">📅</span>{" "}
                          {project.startDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          End Date
                        </p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <span className="text-gray-400">📅</span>{" "}
                          {project.endDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          Delivery Date
                        </p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <span className="text-gray-400">📅</span>{" "}
                          {project.deliveryDate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-black font-semibold mb-1">
                          Days Remaining
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.daysRemaining} days
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
                      <span className="text-xs text-pink-500 font-semibold p-2">
                        {project.priority}
                      </span>
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-white mb-2">
                        {project.completion}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.completion}%` }}
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
                        <span>Inprogress</span>
                        <span className="font-medium">
                          {totalMilestones -
                            completedMilestones -
                            remainingMilestones}{" "}
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
                    {/* <ButtonPink
                      className="py-2 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                      buttonname="+ Add Members"
                      onClick={() => console.log("Add Members Button")}

                    /> */}
                  </div>

                  <div className="flex  gap-3">
                    {project.team.map((member) => (
                      <div
                        key={member.id}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {member.role}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {member.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ),

            Milestones: (
              <div className="space-y-4">
                {project.milestones.map((milestone) => (
                  <MilestoneCard key={milestone.id} milestone={milestone} />
                ))}
              </div>
            ),

            Members: (
              <div className="bg-white rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Team Members
                  </h2>

                  {/* <ButtonPink
                    className="bg-black text-white px-4 py-2 rounded-md text-sm"
                    buttonname="+ Add Members"
                    onClick={() => console.log("Add Members Button")}

                  /> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      </div>

                      <div className="leading-tight">
                        <p className="text-sm font-medium text-gray-900">
                          {member.role}
                        </p>
                        <p className="text-xs text-gray-500">{member.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),

            Activity: (
              <>
                <div className="bg-white rounded-lg p-6">
                  <h1 className="text-lg font-semibold text-gray-900 mb-4">
                    Activity Log
                  </h1>
                  {project.activity && project.activity.length > 0 ? (
                    <div className="space-y-4">
                      {project.activity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 " />

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm text-gray-700">
                                  Team member{" "}
                                  <span className="font-medium text-green-500">
                                    {activity.updatedby}
                                  </span>{" "}
                                  updated the milestone eta{" "}
                                  {project.milestones[0]?.title ||
                                    "Project Milestone"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Changed eta from september 10 to
                                </p>
                                <div className="inline-block mt-2 px-3 py-1 bg-black text-white text-xs rounded-md">
                                  {activity.updateddate}
                                </div>
                              </div>

                              {/* Time ago */}
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
              </>
            ),
          }}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProjectPage;
