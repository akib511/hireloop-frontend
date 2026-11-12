"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";

import {
  BarChart3,
  Bookmark,
  Briefcase,
 
  Files,
  FileText,
  LayoutDashboard,
  
  Plus,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

const menuItemsByRole = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { id: "applications", name: "My Applications", url: "/dashboard/seeker/applications", icon: FileText },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
    { id: "profile", name: "Profile", url: "/dashboard/seeker/profile", icon: UserRound },
  ],

  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { id: "post-job", name: "Post a Job", url: "/dashboard/recruiter/jobs/post-job", icon: Plus },
    { id: "jobs", name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    { id: "applicants", name: "Applications", url: "/dashboard/recruiter/applicants", icon: Files},
    { id: "company", name: "settings", url: "/dashboard/recruiter/company", icon: Settings},
  ],

  admin: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { id: "reports", name: "Reports", url: "/dashboard/admin/reports", icon: BarChart3 },
    { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
};

export function DashboardSidebar() {
  const { data: session, isPending } = authClient.useSession();

  const pathname = usePathname();

  const user = session?.user;
  const role = user?.role;

  const menuItems = menuItemsByRole[role] || [];

  if (isPending) return null;

  return (
    <Sidebar
      className="border-r border-white/10 bg-[#09090b]"
    >
      {/* Header */}
      <SidebarHeader className="bg-[#09090b] px-4 pt-6">

        {/* Logo */}
        <Link href="/" className="mb-5 px-2">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-blue-500">Hire</span>
            <span className="text-orange-500">Loop</span>
          </h1>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#18181b] p-3">

          {/* Avatar */}
          {user?.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="h-10 w-10 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <UserRound size={20} />
            </div>
          )}

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "User"}
            </p>

            <p className="mt-0.5 text-xs capitalize text-gray-400">
              {role}
            </p>

            <span className="mt-1 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400">
              {role === "admin"
                ? "Administrator"
                : role === "recruiter"
                  ? "Recruiter Account"
                  : "Job Seeker"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Menu */}
      <SidebarContent className="bg-[#09090b] px-3 py-5">

        <SidebarMenu className="gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={isActive}
                  className={`
                    h-11 rounded-lg px-3 transition-all duration-200

                    ${
                      isActive
                        ? "bg-[#27272a] text-white hover:bg-[#27272a] hover:text-white"
                        : "text-gray-400 hover:bg-[#18181b] hover:text-white"
                    }
                  `}
                >
                  <item.icon
                    size={19}
                    className={isActive ? "text-blue-400" : "text-gray-500"}
                  />

                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 bg-[#09090b] p-4">
        <p className="text-center text-xs text-gray-600">
          © 2026 HireLoop. All rights reserved.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}