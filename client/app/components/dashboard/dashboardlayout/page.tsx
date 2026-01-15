"use client";

import Sidebar from "../sidebar/page";
import Topbar from "../topbar/page";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  Home,
  Files,
  Handshake,
  Users,
  History,
  BarChart3,
  Settings,
  Milestone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ALL_SIDEBAR_ITEMS = [
  {
    label: "Overview",
    href: "/pages/home",
    icon: Home,
    permission: "overview.view",
  },
  {
    label: "Projects",
    href: "/pages/projects",
    icon: Files,
    permission: "projects.view",
  },
  {
    label: "Milestones",
    href: "/pages/milestones",
    icon: Milestone,
    permission: "milestones.view",
  },
  {
    label: "Clients",
    href: "/pages/clients",
    icon: Handshake,
    permission: "clients.view",
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
    permission: "users.view",
  },
  {
    label: "Activity",
    href: "/pages/activity",
    icon: History,
    permission: "activity.view",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    permission: "analytics.view",
  },
  {
    label: "Admin",
    href: "/dashboard/admin",
    icon: Settings,
    permission: "admin.view",
  },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // 🚨 HARD GUARD
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const sidebarItems = ALL_SIDEBAR_ITEMS.filter((item) => {
    // Admin sees everything
    if (user.role === "admin") return true;

    if (!item.permission) return false;

    const [resource, action] = item.permission.split(".");
return Boolean(
  user.permissions?.[resource as keyof typeof user.permissions]?.[
    action as "view" | "create" | "update" | "delete"
  ]
);  });

  return (
    <div className="flex h-screen">
      <Sidebar items={sidebarItems} />

      <div className="flex flex-col flex-1">
        <Topbar user={user} />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
