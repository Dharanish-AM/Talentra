import { useAuthStore } from '@/store/authStore';
import StudentDashboard from './student/StudentDashboard';
import AdminDashboard from './admin/AdminDashboard';
import RecruiterDashboard from './recruiter/RecruiterDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();

  const role = user?.role?.toLowerCase();
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'recruiter') return <RecruiterDashboard />;
  return <StudentDashboard />;
}
