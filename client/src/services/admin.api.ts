import { api, handleApiError } from "./api";
import { Company, JobDrive, Application, InterviewSlot } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface Analytics {
  totalCompanies: number;
  totalDrives: number;
  totalApplications: number;
  totalInterviews: number;
  activeDrives: number;
  upcomingDrives: number;
}

export const adminApi = {
  async getAllCompanies(): Promise<Company[]> {
    try {
      const response =
        await api.get<ApiResponse<{ companies: Company[] }>>(
          "/admin/companies",
        );
      return response.data.data.companies;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createCompany(data: Omit<Company, "id">): Promise<Company> {
    try {
      const response = await api.post<ApiResponse<{ company: Company }>>(
        "/admin/companies",
        data,
      );
      return response.data.data.company;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    try {
      const response = await api.put<ApiResponse<{ company: Company }>>(
        `/admin/companies/${id}`,
        data,
      );
      return response.data.data.company;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteCompany(id: string): Promise<void> {
    try {
      await api.delete(`/admin/companies/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getAllDrives(): Promise<JobDrive[]> {
    try {
      const response =
        await api.get<ApiResponse<{ drives: JobDrive[] }>>("/admin/drives");
      return response.data.data.drives;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createDrive(
    data: Omit<JobDrive, "id" | "applicantCount">,
  ): Promise<JobDrive> {
    try {
      const response = await api.post<ApiResponse<{ drive: JobDrive }>>(
        "/admin/drives",
        data,
      );
      return response.data.data.drive;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateDrive(id: string, data: Partial<JobDrive>): Promise<JobDrive> {
    try {
      const response = await api.put<ApiResponse<{ drive: JobDrive }>>(
        `/admin/drives/${id}`,
        data,
      );
      return response.data.data.drive;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteDrive(id: string): Promise<void> {
    try {
      await api.delete(`/admin/drives/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getDriveApplicants(driveId: string): Promise<Application[]> {
    try {
      const response = await api.get<
        ApiResponse<{ applicants: Application[] }>
      >(`/admin/drives/${driveId}/applicants`);
      return response.data.data.applicants;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getAllApplications(): Promise<Application[]> {
    try {
      const response = await api.get<
        ApiResponse<{ applications: Application[] }>
      >("/admin/applications");
      return response.data.data.applications;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getAllInterviews(): Promise<InterviewSlot[]> {
    try {
      const response =
        await api.get<ApiResponse<{ interviews: InterviewSlot[] }>>(
          "/admin/interviews",
        );
      return response.data.data.interviews;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async shortlistApplicants(applicationIds: string[]): Promise<void> {
    try {
      await api.post("/admin/applicants/shortlist", { applicationIds });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async rejectApplicant(applicationId: string): Promise<void> {
    try {
      await api.post("/admin/applicants/reject", { applicationId });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async scheduleInterviews(
    interviews: Omit<InterviewSlot, "id">[],
  ): Promise<InterviewSlot[]> {
    try {
      const response = await api.post<
        ApiResponse<{ interviews: InterviewSlot[] }>
      >("/admin/interviews/schedule", { interviews });
      return response.data.data.interviews;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async releaseOffers(applicationIds: string[]): Promise<void> {
    try {
      await api.post("/admin/offers/release", { applicationIds });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getAnalytics(): Promise<Analytics> {
    try {
      const response =
        await api.get<ApiResponse<{ analytics: Analytics }>>(
          "/admin/analytics",
        );
      return response.data.data.analytics;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async downloadAnalyticsReport(): Promise<Blob> {
    try {
      const response = await api.get("/admin/analytics/export", {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
