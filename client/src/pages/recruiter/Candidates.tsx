import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDataStore } from "@/store/dataStore";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Search } from "lucide-react";
import { InterviewSlot } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import FeedbackDialog from "@/components/modals/FeedbackDialog";

export default function RecruiterCandidates() {
  const { interviews, updateInterviewResult } = useDataStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const statusFilter = searchParams.get("filter") || "all";

  const setStatusFilter = (val: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", val);
      return newParams;
    });
  };
  const [feedbackInterview, setFeedbackInterview] =
    useState<InterviewSlot | null>(null);

  const filtered = interviews.filter((i) => {
    return (
      (i.studentName.toLowerCase().includes(search.toLowerCase()) ||
        i.driveTitle.toLowerCase().includes(search.toLowerCase()) ||
        i.companyName.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || (i.result || "pending") === statusFilter)
    );
  });

  const [visibleCount, setVisibleCount] = useState(10);
  const visibleCandidates = filtered.slice(0, visibleCount);

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
        title="Candidates"
        description="Review and manage interview candidates."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or drive..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        {["all", "pending", "selected", "rejected"].map((s) => (
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
                Drive / Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Interview Details
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
            {visibleCandidates.map((interview) => (
              <tr
                key={interview.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {interview.studentName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {interview.studentEmail}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">
                    {interview.driveTitle}
                  </div>
                  <div className="text-xs">{interview.companyName}</div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  <div>
                    {formatDate(interview.date)} · {interview.time}
                  </div>
                  <div className="text-xs capitalize">{interview.mode}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={interview.result || "pending"} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {interview.result === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleResult(interview, "selected")}
                        >
                          Select
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                          onClick={() => handleResult(interview, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setFeedbackInterview(interview)}
                    >
                      {interview.feedback ? "Edit Feedback" : "Feedback"}
                    </Button>
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
                  No candidates match your filters.
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

      <FeedbackDialog
        open={!!feedbackInterview}
        onOpenChange={() => setFeedbackInterview(null)}
        interview={feedbackInterview}
      />
    </div>
  );
}
