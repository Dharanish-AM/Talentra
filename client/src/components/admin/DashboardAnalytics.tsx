import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, JobDrive, Company } from "@/types";

interface DashboardAnalyticsProps {
  applications: Application[];
  drives: JobDrive[];
  companies: Company[];
}

export default function DashboardAnalytics({
  applications,
  drives,
  companies,
}: DashboardAnalyticsProps) {
  // 1. Placement Funnel Data
  const funnelData = [
    {
      name: "Applied",
      value: applications.length,
      fill: "#3b82f6", // blue-500
    },
    {
      name: "Shortlisted",
      value: applications.filter(
        (a) =>
          a.status === "shortlisted" ||
          a.status === "interview" ||
          a.status === "selected" ||
          a.status === "offer",
      ).length,
      fill: "#8b5cf6", // violet-500
    },
    {
      name: "Interview",
      value: applications.filter(
        (a) =>
          a.status === "interview" ||
          a.status === "selected" ||
          a.status === "offer",
      ).length,
      fill: "#eab308", // yellow-500
    },
    {
      name: "Selected",
      value: applications.filter(
        (a) => a.status === "selected" || a.status === "offer",
      ).length,
      fill: "#22c55e", // green-500
    },
  ];

  // 2. Applications Trend Data (Last 7 days or simpler grouping by date)
  // Group applications by date applied
  const appsByDate: Record<string, number> = {};
  applications.forEach((app) => {
    const date = app.appliedAt.split("T")[0]; // YYYY-MM-DD
    appsByDate[date] = (appsByDate[date] || 0) + 1;
  });

  // Convert to array and sort by date
  const trendData = Object.entries(appsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 active days

  // 3. Drive Status Distribution
  const driveStatusData = [
    {
      name: "Active",
      value: drives.filter((d) => d.status === "active").length,
      color: "#22c55e",
    },
    {
      name: "Upcoming",
      value: drives.filter((d) => d.status === "upcoming").length,
      color: "#3b82f6",
    },
    {
      name: "Completed",
      value: drives.filter((d) => d.status === "completed").length,
      color: "#94a3b8",
    },
  ];

  // 4. Top Companies by Applicants
  // Count applicants per company
  const companyApps: Record<string, number> = {};
  applications.forEach((app) => {
    companyApps[app.companyName] = (companyApps[app.companyName] || 0) + 1;
  });

  const topCompaniesData = Object.entries(companyApps)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
      {/* Placement Funnel - Bar Chart */}
      <Card className="col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Placement Funnel</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ borderRadius: "8px" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Drive Status - Pie Chart */}
      <Card className="col-span-3 lg:col-span-3">
        <CardHeader>
          <CardTitle>Drive Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={driveStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {driveStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            {driveStatusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications Trend - Line Chart */}
      <Card className="col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Application Trends</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Companies - Bar Chart (Rotated or List) */}
      <Card className="col-span-3 lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topCompaniesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#f97316"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
