import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import FeedbackDialog from "@/components/modals/FeedbackDialog";
import { UserCheck, Calendar, ClipboardList, CheckCircle } from "lucide-react";
import { InterviewSlot } from "@/types";
import { Button } from "@/components/ui/button";
import RecruiterAnalytics from "@/components/recruiter/RecruiterAnalytics";
import { toast } from "@/hooks/use-toast";

export default function RecruiterDashboard() {
  const { user } = useAuthStore();
  const {
    applications,
    interviews,
    updateInterviewResult,
    fetchInterviews,
    fetchRecruiterApplications,
  } = useDataStore();

  useEffect(() => {
    fetchInterviews();
    fetchRecruiterApplications();
  }, [fetchInterviews, fetchRecruiterApplications]);
  const shortlisted = applications.filter(
    (a) => a.status === "shortlisted" || a.status === "interview",
  );

  const [visibleInterviewsCount, setVisibleInterviewsCount] = useState(4);
  const visibleInterviews = interviews.slice(0, visibleInterviewsCount);

  const [visibleShortlistedCount, setVisibleShortlistedCount] = useState(5);
  const visibleShortlisted = shortlisted.slice(0, visibleShortlistedCount);

  const [feedbackInterview, setFeedbackInterview] =
    useState<InterviewSlot | null>(null);

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
        title={`Welcome, ${user?.name.split(" ")[0]}`}
        description="Review candidates and manage interviews."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Shortlisted"
          value={shortlisted.length}
          icon={<UserCheck className="h-5 w-5" />}
          delay={0}
        />
        <StatCard
          label="Pending Interviews"
          value={interviews.filter((i) => i.result === "pending").length}
          icon={<Calendar className="h-5 w-5" />}
          delay={100}
        />
        <StatCard
          label="Feedback Given"
          value={interviews.filter((i) => i.feedback).length}
          icon={<ClipboardList className="h-5 w-5" />}
          delay={200}
        />
        <StatCard
          label="Selected"
          value={applications.filter((a) => a.status === "selected").length}
          icon={<CheckCircle className="h-5 w-5" />}
          delay={300}
        />
      </div>

      <RecruiterAnalytics interviews={interviews} applications={shortlisted} />

      <div className="mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Upcoming Interviews
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleInterviews.map((interview) => (
            <div
              key={interview.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-base font-semibold text-foreground">
                    {interview.studentName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(interview.date)} · {interview.time}
                  </p>
                </div>
                <StatusBadge status={interview.result || "pending"} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">📹 {interview.mode}</span>
                {interview.link && (
                  <a
                    href={interview.link}
                    className="text-primary hover:underline"
                  >
                    Join Link
                  </a>
                )}
              </div>
              {interview.feedback && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-foreground">
                    Feedback:
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {interview.feedback}
                  </p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                {interview.result === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => handleResult(interview, "selected")}
                    >
                      Select
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs"
                      onClick={() => handleResult(interview, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setFeedbackInterview(interview)}
                >
                  {interview.feedback ? "Edit Feedback" : "Add Feedback"}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {visibleInterviewsCount < interviews.length && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisibleInterviewsCount((prev) => prev + 4)}
            >
              Show More
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Shortlisted Candidates
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleShortlisted.map((app) => (
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
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleShortlistedCount < shortlisted.length && (
            <div className="border-t border-border p-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleShortlistedCount((prev) => prev + 5)}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      </div>

      <FeedbackDialog
        open={!!feedbackInterview}
        onOpenChange={() => setFeedbackInterview(null)}
        interview={feedbackInterview}
      />
    </div>
  );
}
