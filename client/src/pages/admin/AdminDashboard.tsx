import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useDataStore } from "@/store/dataStore";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { adminApi } from "@/services/admin.api";
import {
  Building2,
  Briefcase,
  Users,
  Award,
  Plus,
  Download,
} from "lucide-react";
import CreateDriveDialog from "@/components/modals/CreateDriveDialog";
import ViewApplicantDialog from "@/components/modals/ViewApplicantDialog";
import { Application } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import DashboardAnalytics from "@/components/admin/DashboardAnalytics";

export default function AdminDashboard() {
  const { drives, applications, companies } = useDataStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [visibleDrivesCount, setVisibleDrivesCount] = useState(5);
  const visibleDrives = drives.slice(0, visibleDrivesCount);

  const [visibleAppsCount, setVisibleAppsCount] = useState(5);
  const visibleApps = applications.slice(0, visibleAppsCount);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await adminApi.downloadAnalyticsReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placement-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Export Successful",
        description: "Analytics report has been downloaded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description:
          error instanceof Error ? error.message : "Failed to download report",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Placement Dashboard"
        description="Overview of campus recruitment activities."
        action={
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" /> New Drive
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Companies"
          value={companies.length}
          icon={<Building2 className="h-5 w-5" />}
          delay={0}
        />
        <StatCard
          label="Active Drives"
          value={drives.filter((d) => d.status === "active").length}
          icon={<Briefcase className="h-5 w-5" />}
          trend="up"
          change="+2 this month"
          delay={100}
        />
        <StatCard
          label="Total Applicants"
          value={applications.length}
          icon={<Users className="h-5 w-5" />}
          delay={200}
        />
        <StatCard
          label="Offers Made"
          value={
            applications.filter(
              (a) => a.status === "offer" || a.status === "selected",
            ).length
          }
          icon={<Award className="h-5 w-5" />}
          delay={300}
        />
      </div>

      <DashboardAnalytics
        applications={applications}
        drives={drives}
        companies={companies}
      />

      <div className="mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          All Job Drives
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Applicants
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Drive Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleDrives.map((drive) => (
                <tr
                  key={drive.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {drive.companyName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {drive.role}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {drive.package}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={drive.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {drive.applicantCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(drive.driveDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleDrivesCount < drives.length && (
            <div className="border-t border-border p-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleDrivesCount((prev) => prev + 5)}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Recent Applications
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Drive
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
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
                    {app.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {app.driveName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {app.companyName}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </Button>
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
        </div>
      </div>

      <CreateDriveDialog open={showCreate} onOpenChange={setShowCreate} />
      <ViewApplicantDialog
        open={!!selectedApp}
        onOpenChange={() => setSelectedApp(null)}
        application={selectedApp}
      />
    </div>
  );
}
