import { useState } from "react";
import { useDataStore } from "@/store/dataStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Plus, Globe } from "lucide-react";
import AddCompanyDialog from "@/components/modals/AddCompanyDialog";
import DriveDetailDialog from "@/components/modals/DriveDetailDialog";
import { JobDrive } from "@/types";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const { companies, drives } = useDataStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<JobDrive | null>(null);

  const [visibleCount, setVisibleCount] = useState(9);
  const visibleCompanies = companies.slice(0, visibleCount);

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Manage registered companies for campus placements."
        action={
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Company
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCompanies.map((company, i) => {
          const companyDrives = drives.filter((d) => {
            const getDriveCompanyId = (
              id: string | { _id: string; id?: string },
            ) => {
              if (typeof id === "object" && id !== null) {
                return id.id || id._id;
              }
              return id;
            };

            const driveCompanyId = getDriveCompanyId(
              d.companyId as unknown as string | { _id: string; id?: string },
            );
            const targetCompanyId = company.id;

            return String(driveCompanyId) === String(targetCompanyId);
          });
          return (
            <div
              key={company.id}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-display text-lg font-bold text-primary">
                {company.name.charAt(0)}
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {company.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-accent">
                {company.industry}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                {company.description}
              </p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Globe className="h-3 w-3" /> Website
                </a>
              )}
              <div className="mt-4">
                {companyDrives.length > 0 ? (
                  <div className="space-y-2">
                    {companyDrives.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDrive(d)}
                        className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-xs hover:bg-muted transition-colors"
                      >
                        <span className="font-medium text-foreground">
                          {d.role}
                        </span>
                        <StatusBadge status={d.status} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No drives yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < companies.length && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 9)}
          >
            Show More
          </Button>
        </div>
      )}

      <AddCompanyDialog open={showAdd} onOpenChange={setShowAdd} />
      <DriveDetailDialog
        open={!!selectedDrive}
        onOpenChange={() => setSelectedDrive(null)}
        drive={selectedDrive}
      />
    </div>
  );
}
