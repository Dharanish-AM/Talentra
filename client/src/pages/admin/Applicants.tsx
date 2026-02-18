import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Search } from "lucide-react";
import ViewApplicantDialog from "@/components/modals/ViewApplicantDialog";
import ScheduleInterviewDialog from "@/components/modals/ScheduleInterviewDialog";
import { Application } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ApplicantsPageProps {
  initialFilter?: string;
}

export default function ApplicantsPage({
  initialFilter = "all",
}: ApplicantsPageProps) {
  const { user } = useAuthStore();
  const { applications, updateApplicationStatus } = useDataStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const statusFilter = searchParams.get("filter") || initialFilter;

  useEffect(() => {
    // If no filter param is present and we have a specific initialFilter (not 'all'),
    // we might want to set it in the URL or just let the fallback handle it.
    // The fallback handles it for rendering, but setting it in URL makes it explicit for sharing/reloading.
    if (!searchParams.get("filter") && initialFilter !== "all") {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("filter", initialFilter);
          return newParams;
        },
        { replace: true },
      );
    }
  }, [initialFilter, searchParams, setSearchParams]);

  const setStatusFilter = (status: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", status);
      return newParams;
    });
  };

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [scheduleApp, setScheduleApp] = useState<Application | null>(null);

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const [visibleCount, setVisibleCount] = useState(10);
  const visibleApps = filtered.slice(0, visibleCount);

  const handleQuickAction = (
    app: Application,
    action: "shortlisted" | "rejected",
  ) => {
    updateApplicationStatus(app.id, action);
    toast({
      title: `Application ${action}`,
      description: `${app.studentName} has been ${action}.`,
    });
  };

  return (
    <div>
      <PageHeader
        title="Applicants"
        description="Review and manage all student applications."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or company..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        {[
          "all",
          "applied",
          "shortlisted",
          "interview",
          "selected",
          "offer",
          "rejected",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

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
              <tr key={app.id} className="transition-colors hover:bg-muted/30">
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
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </Button>

                    {user?.role === "admin" && app.status === "applied" && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleQuickAction(app, "shortlisted")}
                        >
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                          onClick={() => handleQuickAction(app, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {user?.role === "admin" && app.status === "shortlisted" && (
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setScheduleApp(app)}
                      >
                        Schedule Interview
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No applicants match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Show More
          </Button>
        </div>
      )}

      <ViewApplicantDialog
        open={!!selectedApp}
        onOpenChange={() => setSelectedApp(null)}
        application={selectedApp}
      />
      <ScheduleInterviewDialog
        open={!!scheduleApp}
        onOpenChange={() => setScheduleApp(null)}
        application={scheduleApp}
      />
    </div>
  );
}
