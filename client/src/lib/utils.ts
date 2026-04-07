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

export function formatCurrency(amount: string | number): string {
  if (amount === "N/A" || !amount) return "N/A";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
