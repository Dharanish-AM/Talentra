import { create } from "zustand";
import {
  Company,
  JobDrive,
  Application,
  InterviewSlot,
  ApplicationStatus,
} from "@/types";
import { adminApi } from "@/services/admin.api";
import { studentApi } from "@/services/student.api";
import { recruiterApi } from "@/services/recruiter.api";

interface DataState {
  companies: Company[];
  drives: JobDrive[];
  applications: Application[];
  interviews: InterviewSlot[];
  isLoading: boolean;
  error: string | null;

  fetchCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, "id">) => Promise<void>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;

  fetchDrives: () => Promise<void>;
  fetchEligibleDrives: () => Promise<void>;
  addDrive: (drive: Omit<JobDrive, "id" | "applicantCount">) => Promise<void>;
  updateDrive: (id: string, data: Partial<JobDrive>) => Promise<void>;
  deleteDrive: (id: string) => Promise<void>;

  fetchApplications: () => Promise<void>;
  fetchAllApplications: () => Promise<void>;
  applyToDrive: (driveId: string) => Promise<boolean>;
  updateApplicationStatus: (
    appId: string,
    status: ApplicationStatus,
  ) => Promise<void>;

  fetchInterviews: () => Promise<void>;
  fetchAllInterviews: () => Promise<void>;
  fetchStudentInterviews: () => Promise<void>;
  fetchRecruiterApplications: () => Promise<void>;
  addInterview: (interview: Omit<InterviewSlot, "id">) => Promise<void>;
  updateInterviewResult: (
    id: string,
    result: "selected" | "rejected" | "pending",
    feedback?: string,
  ) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  companies: [],
  drives: [],
  applications: [],
  interviews: [],
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const companies = await adminApi.getAllCompanies();
      set({ companies, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch companies",
        isLoading: false,
      });
    }
  },

  addCompany: async (company) => {
    set({ isLoading: true, error: null });
    try {
      const newCompany = await adminApi.createCompany(company);
      set((s) => ({
        companies: [...s.companies, newCompany],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create company",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await adminApi.updateCompany(id, data);
      set((s) => ({
        companies: s.companies.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update company",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteCompany(id);
      set((s) => ({
        companies: s.companies.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete company",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchDrives: async () => {
    set({ isLoading: true, error: null });
    try {
      const drives = await adminApi.getAllDrives();
      set({ drives, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch drives",
        isLoading: false,
      });
    }
  },

  fetchEligibleDrives: async () => {
    set({ isLoading: true, error: null });
    try {
      const drives = await studentApi.getEligibleDrives();
      set({ drives, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch eligible drives",
        isLoading: false,
      });
    }
  },

  addDrive: async (drive) => {
    set({ isLoading: true, error: null });
    try {
      const newDrive = await adminApi.createDrive(drive);
      set((s) => ({ drives: [...s.drives, newDrive], isLoading: false }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create drive",
        isLoading: false,
      });
      throw error;
    }
  },

  updateDrive: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await adminApi.updateDrive(id, data);
      set((s) => ({
        drives: s.drives.map((d) => (d.id === id ? updated : d)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update drive",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteDrive: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteDrive(id);
      set((s) => ({
        drives: s.drives.filter((d) => d.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete drive",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const applications = await studentApi.getMyApplications();
      set({ applications, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch applications",
        isLoading: false,
      });
    }
  },

  fetchAllApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const applications = await adminApi.getAllApplications();
      set({ applications, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch all applications",
        isLoading: false,
      });
    }
  },

  applyToDrive: async (driveId) => {
    set({ isLoading: true, error: null });
    try {
      const application = await studentApi.applyToDrive(driveId);
      set((s) => ({
        applications: [...s.applications, application],
        drives: s.drives.map((d) =>
          d.id === driveId ? { ...d, applicantCount: d.applicantCount + 1 } : d,
        ),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to apply to drive",
        isLoading: false,
      });
      return false;
    }
  },

  updateApplicationStatus: async (appId, status) => {
    // Optimistic update
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === appId
          ? { ...a, status, updatedAt: new Date().toISOString().split("T")[0] }
          : a,
      ),
    }));

    try {
      if (status === "shortlisted") {
        await adminApi.shortlistApplicants([appId]);
      } else if (status === "rejected") {
        await adminApi.rejectApplicant(appId);
      }
    } catch (error) {
      // Revert optimistic update on error
      set((s) => ({
        error:
          error instanceof Error ? error.message : "Failed to update status",
        // Ideally we should revert the status here, but for now just showing error
      }));
    }
  },

  fetchInterviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const interviews = await recruiterApi.getCandidates();
      set({ interviews, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch interviews",
        isLoading: false,
      });
    }
  },

  fetchAllInterviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const interviews = await adminApi.getAllInterviews();
      set({ interviews, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch all interviews",
        isLoading: false,
      });
    }
  },

  fetchStudentInterviews: async () => {
    set({ isLoading: true, error: null });
    try {
      const interviews = await studentApi.getMyInterviews();
      set({ interviews, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch student interviews",
        isLoading: false,
      });
    }
  },

  fetchRecruiterApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const applications = await recruiterApi.getShortlistedApplications();
      set({ applications, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch recruiter applications",
        isLoading: false,
      });
    }
  },

  addInterview: async (interview) => {
    set({ isLoading: true, error: null });
    try {
      const interviews = await adminApi.scheduleInterviews([interview]);
      set((s) => ({
        interviews: [...s.interviews, ...interviews],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to schedule interview",
        isLoading: false,
      });
      throw error;
    }
  },

  updateInterviewResult: async (id, result, feedback) => {
    set({ isLoading: true, error: null });
    try {
      let updated: InterviewSlot;

      // First update the status
      updated = await recruiterApi.updateCandidateResult(id, result);

      // Then update feedback if provided
      if (feedback) {
        updated = await recruiterApi.submitFeedback(id, feedback);
      }

      set((s) => ({
        interviews: s.interviews.map((i) => (i.id === id ? updated : i)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update interview result",
        isLoading: false,
      });
      // Optionally refresh data to ensure sync
      get().fetchInterviews();
      throw error;
    }
  },
}));
