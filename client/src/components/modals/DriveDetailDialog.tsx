import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { JobDrive } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drive: JobDrive | null;
}

export default function DriveDetailDialog({
  open,
  onOpenChange,
  drive,
}: Props) {
  const { user } = useAuthStore();
  const { applyToDrive, applications } = useDataStore();

  if (!drive) return null;

  const alreadyApplied = applications.some(
    (a) => a.studentId === user?.id && a.driveId === drive.id,
  );

  const handleApply = async () => {
    if (!user) return;
    const result = await applyToDrive(drive.id);
    if (result.success) {
      toast({
        title: "Application submitted!",
        description: `You applied to ${drive.companyName} — ${drive.role}`,
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Application Failed",
        description: result.message || "Failed to apply to drive.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{drive.companyName}</DialogTitle>
          <DialogDescription>{drive.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={drive.status} />
            <span className="text-sm text-muted-foreground">
              {drive.applicantCount} {drive.applicantCount === 1 ? "applicant" : "applicants"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{drive.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-foreground">Role:</span>{" "}
              <span className="text-muted-foreground">{drive.role}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Package:</span>{" "}
              <span className="text-muted-foreground">{formatCurrency(drive.package)}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Location:</span>{" "}
              <span className="text-muted-foreground">{drive.location}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Drive Date:</span>{" "}
              <span className="text-muted-foreground">
                {formatDate(drive.driveDate)}
              </span>
            </div>
            <div>
              <span className="font-medium text-foreground">Deadline:</span>{" "}
              <span className="text-muted-foreground">
                {formatDate(drive.deadline)}
              </span>
            </div>
            <div>
              <span className="font-medium text-foreground">Min CGPA:</span>{" "}
              <span className="text-muted-foreground">
                {drive.eligibility.minCgpa}
              </span>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">
              Departments:
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {drive.eligibility.allowedDepartments.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          {user?.role === "student" && drive.status === "active" && (
            <Button
              className="w-full"
              onClick={handleApply}
              disabled={alreadyApplied}
            >
              {alreadyApplied ? "Already Applied" : "Apply Now"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
