import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { format } from "date-fns";

export function formatDate(dateValue: string | number | Date): string {
  if (!dateValue) return "";
  
  let date: Date;
  if (typeof dateValue === "number") {
    date = new Date(dateValue);
  } else if (typeof dateValue === "string") {
    if (/^\d+$/.test(dateValue)) {
      date = new Date(parseInt(dateValue, 10));
    } else {
      date = new Date(dateValue);
    }
  } else {
    date = dateValue;
  }

  if (isNaN(date.getTime())) return String(dateValue);
  return format(date, "MMM dd, yyyy");
}
