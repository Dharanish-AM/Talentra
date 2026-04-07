import { useState, useEffect } from "react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Briefcase, FileText, CheckCircle, Clock } from "lucide-react";
import DriveDetailDialog from "@/components/modals/DriveDetailDialog";
import { JobDrive } from "@/types";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { applications, drives, fetchApplications, fetchEligibleDrives } =
    useDataStore();

  useEffect(() => {
    fetchApplications();
    fetchEligibleDrives();
  }, [fetchApplications, fetchEligibleDrives]);
  const activeDrives = drives.filter((d) => d.status === "active");
  const [selectedDrive, setSelectedDrive] = useState<JobDrive | null>(null);

  const [visibleAppsCount, setVisibleAppsCount] = useState(5);
  const visibleApps = applications.slice(0, visibleAppsCount);

  const [visibleDrivesCount, setVisibleDrivesCount] = useState(4);
  const visibleDrives = activeDrives.slice(0, visibleDrivesCount);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        description="Track your applications and explore new opportunities."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Drives"
          value={activeDrives.length}
          icon={<Briefcase className="h-5 w-5" />}
          delay={0}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          icon={<FileText className="h-5 w-5" />}
          delay={100}
        />
        <StatCard
          label="Shortlisted"
          value={applications.filter((a) => a.status === "shortlisted").length}
          icon={<CheckCircle className="h-5 w-5" />}
          trend="up"
          change="+1 this week"
          delay={200}
        />
        <StatCard
          label="Interviews"
          value={applications.filter((a) => a.status === "interview").length}
          icon={<Clock className="h-5 w-5" />}
          delay={300}
        />
      </div>

      <div className="mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Recent Applications
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Drive
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleApps.map((app) => (
                <tr
                  key={app.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {app.companyName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {app.driveName}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(app.appliedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleAppsCount < applications.length && (
            <div className="border-t border-border p-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleAppsCount((prev) => prev + 5)}
              >
                Show More
              </Button>
            </div>
          )}
          {applications.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground border-t border-border">
              No applications yet. Explore active drives!
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Active Drives
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleDrives.map((drive) => (
            <div
              key={drive.id}
              className="cursor-pointer rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
              onClick={() => setSelectedDrive(drive)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-base font-semibold text-foreground">
                    {drive.companyName}
                  </p>
                  <p className="text-sm text-muted-foreground">{drive.role}</p>
                </div>
                <StatusBadge status={drive.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>💰 {formatCurrency(drive.package)}</span>
                <span>📍 {drive.location}</span>
                <span>📅 Deadline: {formatDate(drive.deadline)}</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                Min CGPA: {drive.eligibility.minCgpa} ·{" "}
                {drive.eligibility.allowedDepartments.join(", ")}
              </div>
            </div>
          ))}
        </div>
        {visibleDrivesCount < activeDrives.length && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisibleDrivesCount((prev) => prev + 4)}
            >
              Show More
            </Button>
          </div>
        )}
      </div>

      <DriveDetailDialog
        open={!!selectedDrive}
        onOpenChange={() => setSelectedDrive(null)}
        drive={selectedDrive}
      />
    </div>
  );
}
