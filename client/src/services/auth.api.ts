import { api, handleApiError } from "./api";
import { User } from "@/types";

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin" | "recruiter";
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse["data"]> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async register(data: RegisterData): Promise<LoginResponse["data"]> {
    try {
      const response = await api.post<LoginResponse>("/auth/register", data);
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getMe(): Promise<User> {
    try {
      const response = await api.get<{
        success: boolean;
        data: { user: User };
      }>("/auth/me");
      return response.data.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
