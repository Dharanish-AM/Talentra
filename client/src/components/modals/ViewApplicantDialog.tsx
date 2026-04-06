import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { Application } from "@/types";
import { useDataStore } from "@/store/dataStore";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
}

export default function ViewApplicantDialog({
  open,
  onOpenChange,
  application,
}: Props) {
  const updateApplicationStatus = useDataStore(
    (s) => s.updateApplicationStatus,
  );

  if (!application) return null;

  const handleAction = (
    action: "shortlisted" | "rejected" | "selected" | "offer",
  ) => {
    updateApplicationStatus(application.id, action);
    toast({
      title: `Application ${action}`,
      description: `${application.studentName}'s application has been ${action}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{application.studentName}</DialogTitle>
          <DialogDescription>
            {application.driveName} — {application.companyName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Status:</span>
            <StatusBadge status={application.status} />
          </div>
          <div className="text-xs text-muted-foreground">
            Applied: {formatDate(application.appliedAt)} · Updated:{" "}
            {formatDate(application.updatedAt)}
          </div>
          {application.resumeUrl && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  window.open(
                    `http://localhost:8000/resumes/${application.resumeUrl}`,
                    "_blank",
                  )
                }
              >
                View Resume
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="flex-wrap gap-2">
          {application.status === "applied" && (
            <>
              <Button size="sm" onClick={() => handleAction("shortlisted")}>
                Shortlist
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction("rejected")}
              >
                Reject
              </Button>
            </>
          )}
          {application.status === "shortlisted" && (
            <Button size="sm" onClick={() => handleAction("selected")}>
              Move to Interview
            </Button>
          )}
          {application.status === "interview" && (
            <>
              <Button size="sm" onClick={() => handleAction("selected")}>
                Select
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction("rejected")}
              >
                Reject
              </Button>
            </>
          )}
          {application.status === "selected" && (
            <Button size="sm" onClick={() => handleAction("offer")}>
              Release Offer
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
