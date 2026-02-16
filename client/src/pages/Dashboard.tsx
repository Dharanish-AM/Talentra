import { useAuthStore } from '@/store/authStore';
import StudentDashboard from './student/StudentDashboard';
import AdminDashboard from './admin/AdminDashboard';
import RecruiterDashboard from './recruiter/RecruiterDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'recruiter') return <RecruiterDashboard />;
  return <StudentDashboard />;
}
