import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { format } from "date-fns";

export function formatDate(dateString: string | Date): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Check if date is valid
  if (isNaN(date.getTime())) return String(dateString); // Fallback to original string
  return format(date, "MMM dd, yyyy");
}
