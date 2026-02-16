import { api, handleApiError } from "./api";
import { StudentProfile, JobDrive, Application, InterviewSlot } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const studentApi = {
  async getProfile(): Promise<StudentProfile> {
    try {
      const response =
        await api.get<ApiResponse<{ profile: StudentProfile }>>(
          "/student/profile",
        );
      return response.data.data.profile;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      const response = await api.put<ApiResponse<{ profile: StudentProfile }>>(
        "/student/profile",
        data,
      );
      return response.data.data.profile;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async uploadResume(file: File): Promise<StudentProfile> {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post<ApiResponse<{ profile: StudentProfile }>>(
        "/student/profile/resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.data.profile;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getEligibleDrives(): Promise<JobDrive[]> {
    try {
      const response =
        await api.get<ApiResponse<{ drives: JobDrive[] }>>("/student/drives");
      return response.data.data.drives;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async applyToDrive(driveId: string): Promise<Application> {
    try {
      const response = await api.post<
        ApiResponse<{ application: Application }>
      >(`/student/drives/${driveId}/apply`);
      return response.data.data.application;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getMyApplications(): Promise<Application[]> {
    try {
      const response = await api.get<
        ApiResponse<{ applications: Application[] }>
      >("/student/applications");
      return response.data.data.applications;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getMyInterviews(): Promise<InterviewSlot[]> {
    try {
      const response = await api.get<
        ApiResponse<{ interviews: InterviewSlot[] }>
      >("/student/interviews");
      return response.data.data.interviews;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
