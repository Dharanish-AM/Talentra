import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  FileText,
  Calendar,
  Award,
  LogOut,
  GraduationCap,
  ClipboardList,
  UserCheck,
} from "lucide-react";

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/drives", label: "Job Drives", icon: Briefcase },
  { to: "/applications", label: "My Applications", icon: FileText },
  { to: "/interviews", label: "Interviews", icon: Calendar },
  { to: "/profile", label: "My Profile", icon: GraduationCap },
];

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/drives", label: "Job Drives", icon: Briefcase },
  { to: "/applicants", label: "Applicants", icon: Users },
  { to: "/interviews", label: "Interviews", icon: Calendar },
];

const recruiterLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: UserCheck },
  { to: "/interviews", label: "Interviews", icon: Calendar },
];

export default function AppSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "recruiter"
        ? recruiterLinks
        : studentLinks;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight text-sidebar-accent-foreground">
            Talentra
          </h1>
          <p className="text-xs text-sidebar-foreground/60 capitalize">
            {user?.role} Portal
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <link.icon className="h-4.5 w-4.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-primary">
            {user?.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/50">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
