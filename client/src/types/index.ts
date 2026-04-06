export type UserRole = "student" | "admin" | "recruiter";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "selected"
  | "rejected"
  | "offer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface StudentProfile {
  userId: string;
  department: string;
  cgpa: number;
  backlogs: number;
  resumeUrl?: string;
  phone: string;
  graduationYear: number;
  skills: string[];
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website?: string;
  description: string;
}

export interface EligibilityCriteria {
  minCgpa: number;
  allowedDepartments: string[];
  maxBacklogs: number;
}

export interface JobDrive {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  role: string;
  package: string;
  location: string;
  eligibility: EligibilityCriteria;
  deadline: string;
  driveDate: string;
  status: "upcoming" | "active" | "completed";
  applicantCount: number;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  driveId: string;
  driveName: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  resumeUrl?: string;
}

export interface InterviewSlot {
  id: string;
  driveId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  driveTitle: string;
  companyName: string;
  role: string;
  date: string;
  time: string;
  mode: "online" | "offline";
  link?: string;
  feedback?: string;
  result?: "selected" | "rejected" | "pending";
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
}
