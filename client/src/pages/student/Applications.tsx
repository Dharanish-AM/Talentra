import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { ApplicationStatus } from "@/types";

const PIPELINE: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interview",
  "selected",
  "offer",
];

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const { applications } = useDataStore();
  const myApps = applications.filter((a) => a.studentId === user?.id);

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track the status of all your applications."
      />

      <div className="mb-8 flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-3">
        {PIPELINE.map((stage, i) => {
          const count = myApps.filter((a) => a.status === stage).length;
          return (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center rounded-lg px-6 py-3">
                <span className="font-display text-xl font-bold text-foreground">
                  {count}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {stage}
                </span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="mx-1 h-px w-8 bg-border" />
              )}
            </div>
          );
        })}
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
            {myApps.map((app) => (
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
            {myApps.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
