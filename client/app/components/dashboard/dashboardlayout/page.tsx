"use client";

import Sidebar from "../sidebar/page";
import Topbar from "../topbar/page";
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
import { useEffect, useState } from "react";

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

interface User {
  name: string;
  role: string;
  email?: string;
  permissions?: {
    [resource: string]: {
      view?: boolean;
      create?: boolean;
      update?: boolean;
      delete?: boolean;
    };
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth guard - check localStorage for user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Show nothing while checking auth
  if (loading || !user) return null;

  const sidebarItems = ALL_SIDEBAR_ITEMS.filter((item) => {
    // Admin sees everything
    if (user.role === "admin") return true;

    if (!item.permission) return false;

    const [resource, action] = item.permission.split(".");
    return Boolean(
      user.permissions?.[resource]?.[action as "view" | "create" | "update" | "delete"]
    );
  });

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