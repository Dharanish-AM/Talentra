import { useState } from "react";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import FeedbackDialog from "@/components/modals/FeedbackDialog";
import { InterviewSlot } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function InterviewsPage() {
  const { user } = useAuthStore();
  const { interviews, updateInterviewResult } = useDataStore();
  const [feedbackInterview, setFeedbackInterview] =
    useState<InterviewSlot | null>(null);

  const isRecruiter = user?.role === "recruiter";

  const handleResult = (
    interview: InterviewSlot,
    result: "selected" | "rejected",
  ) => {
    updateInterviewResult(interview.id, result);
    toast({
      title: `Candidate ${result}`,
      description: `${interview.studentName} has been ${result}.`,
    });
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        description="Manage interview schedules and feedback."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview, i) => (
          <div
            key={interview.id}
            className="rounded-xl border border-border bg-card p-5 shadow-card animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-base font-semibold text-foreground">
                  {interview.studentName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {interview.date} · {interview.time}
                </p>
              </div>
              <StatusBadge status={interview.result || "pending"} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-1 capitalize">
                📹 {interview.mode}
              </span>
              {interview.link && (
                <a
                  href={interview.link}
                  className="rounded bg-info/10 px-2 py-1 text-info hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Join Link
                </a>
              )}
            </div>
            {interview.feedback && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground">Feedback:</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {interview.feedback}
                </p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              {isRecruiter && (
                <>
                  {interview.result === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleResult(interview, "selected")}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 text-xs"
                        onClick={() => handleResult(interview, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setFeedbackInterview(interview)}
                  >
                    {interview.feedback ? "Edit Feedback" : "Add Feedback"}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        {interviews.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
            No interviews scheduled yet.
          </div>
        )}
      </div>

      <FeedbackDialog
        open={!!feedbackInterview}
        onOpenChange={() => setFeedbackInterview(null)}
        interview={feedbackInterview}
      />
    </div>
  );
}
