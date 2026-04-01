import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const {
    fetchCompanies,
    fetchDrives,
    fetchAllApplications,
    fetchAllInterviews,
    fetchEligibleDrives,
    fetchApplications,
    fetchStudentInterviews,
    fetchInterviews,
    fetchRecruiterApplications,
  } = useDataStore();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const role = user.role?.toLowerCase();
      if (role === "admin") {
        await Promise.all([
          fetchCompanies(),
          fetchDrives(),
          fetchAllApplications(),
          fetchAllInterviews(),
        ]);
      } else if (role === "student") {
        await Promise.all([
          fetchEligibleDrives(),
          fetchApplications(),
          fetchStudentInterviews(),
        ]);
      } else if (role === "recruiter") {
        await Promise.all([fetchInterviews(), fetchRecruiterApplications()]);
      }
    };

    loadData();
  }, [
    user,
    fetchCompanies,
    fetchDrives,
    fetchAllApplications,
    fetchAllInterviews,
    fetchEligibleDrives,
    fetchApplications,
    fetchStudentInterviews,
    fetchInterviews,
    fetchRecruiterApplications,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
