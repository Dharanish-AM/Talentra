import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const { applications } = useDataStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredApps = applications.filter((app) => {
    const matchSearch =
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.driveName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const [visibleCount, setVisibleCount] = useState(10);
  const visibleApps = filteredApps.slice(0, visibleCount);

  const uniqueStatuses = ["all", ...new Set(applications.map((a) => a.status))];

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track the status of all your applications."
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
        {[
          "all",
          "applied",
          "shortlisted",
          "interview",
          "selected",
          "rejected",
          "offer",
        ].map((s) => (
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
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleApps.map((app) => (
              <tr key={app.id} className="transition-colors hover:bg-muted/30">
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
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(app.updatedAt)}
                </td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No applications match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visibleCount < filteredApps.length && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
