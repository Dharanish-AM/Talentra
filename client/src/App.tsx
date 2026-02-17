import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DrivesPage from "@/pages/Drives";
import ApplicationsPage from "@/pages/student/Applications";
import StudentProfile from "@/pages/student/StudentProfile";
import CompaniesPage from "@/pages/admin/Companies";
import ApplicantsPage from "@/pages/admin/Applicants";
import InterviewsPage from "@/pages/Interviews";
import NotFound from "./pages/NotFound";
import RecruiterCandidates from "@/pages/recruiter/Candidates";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

// Candidates Wrapper Component
const CandidatesPageWrapper = () => {
  const { user } = useAuthStore();

  if (user?.role === "recruiter") {
    return <RecruiterCandidates />;
  }

  // Default to ApplicantsPage for Admin (and others if accessible)
  return <ApplicantsPage initialFilter="shortlisted" />;
};

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/drives" element={<DrivesPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route
                path="/applicants"
                element={<ApplicantsPage initialFilter="all" />}
              />
              <Route path="/interviews" element={<InterviewsPage />} />
              <Route path="/candidates" element={<CandidatesPageWrapper />} />

              <Route
                path="/offers"
                element={<ApplicantsPage initialFilter="offer" />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
