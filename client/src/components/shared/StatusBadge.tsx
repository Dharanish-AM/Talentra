import { STATUS_COLORS } from "@/constants";
import { ApplicationStatus } from "@/types";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
