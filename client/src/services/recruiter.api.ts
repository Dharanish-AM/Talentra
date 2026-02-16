import { api, handleApiError } from "./api";
import { InterviewSlot } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface FeedbackData {
  feedback: string;
}

export const recruiterApi = {
  async getCandidates(): Promise<InterviewSlot[]> {
    try {
      const response = await api.get<
        ApiResponse<{ candidates: InterviewSlot[] }>
      >("/recruiter/candidates");
      return response.data.data.candidates;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async submitFeedback(
    interviewId: string,
    feedback: string,
  ): Promise<InterviewSlot> {
    try {
      const response = await api.post<
        ApiResponse<{ interview: InterviewSlot }>
      >(`/recruiter/feedback/${interviewId}`, { feedback });
      return response.data.data.interview;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateCandidateResult(
    interviewId: string,
    result: "selected" | "rejected" | "pending",
  ): Promise<InterviewSlot> {
    try {
      const response = await api.put<ApiResponse<{ interview: InterviewSlot }>>(
        `/recruiter/candidates/${interviewId}/result`,
        { result },
      );
      return response.data.data.interview;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
