import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Search } from "lucide-react";
import DriveDetailDialog from "@/components/modals/DriveDetailDialog";
import CreateDriveDialog from "@/components/modals/CreateDriveDialog";
import { JobDrive } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DrivesPage() {
  const { user } = useAuthStore();
  const { drives, applications } = useDataStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDrive, setSelectedDrive] = useState<JobDrive | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = drives.filter((d) => {
    const matchSearch =
      d.companyName.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const [visibleCount, setVisibleCount] = useState(9);
  const visibleDrives = filtered.slice(0, visibleCount);

  const alreadyApplied = (driveId: string) =>
    applications.some((a) => a.studentId === user?.id && a.driveId === driveId);

  return (
    <div>
      <PageHeader
        title="Job Drives"
        description="Browse and apply to campus recruitment drives."
        action={
          user?.role === "admin" ? (
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" /> New Drive
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        {["all", "active", "upcoming", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDrives.map((drive, i) => (
          <div
            key={drive.id}
            className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated animate-fade-in cursor-pointer"
            style={{ animationDelay: `${i * 80}ms` }}
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
            <p className="mt-3 line-clamp-2 flex-1 text-xs text-muted-foreground">
              {drive.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1">
                💰 {drive.package}
              </span>
              <span className="rounded bg-muted px-2 py-1">
                📍 {drive.location}
              </span>
              <span className="rounded bg-muted px-2 py-1">
                📅 {formatDate(drive.deadline)}
              </span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Min CGPA: {drive.eligibility.minCgpa} · Max Backlogs:{" "}
              {drive.eligibility.maxBacklogs}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {drive.eligibility.allowedDepartments.map((dept) => (
                <span
                  key={dept}
                  className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
                >
                  {dept}
                </span>
              ))}
            </div>
            {user?.role === "student" && drive.status === "active" && (
              <Button
                className="mt-4 w-full"
                disabled={alreadyApplied(drive.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDrive(drive);
                }}
              >
                {alreadyApplied(drive.id) ? "Already Applied" : "Apply Now"}
              </Button>
            )}
            {user?.role === "admin" && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDrive(drive);
                  }}
                >
                  View Details ({drive.applicantCount})
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 9)}
          >
            Show More
          </Button>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No drives match your filters.
        </div>
      )}

      <DriveDetailDialog
        open={!!selectedDrive}
        onOpenChange={() => setSelectedDrive(null)}
        drive={selectedDrive}
      />
      <CreateDriveDialog open={showCreate} onOpenChange={setShowCreate} />
    </div>
  );
}
