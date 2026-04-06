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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, InterviewSlot } from "@/types";

interface RecruiterAnalyticsProps {
  interviews: InterviewSlot[];
  applications: Application[]; // Shortlisted applications
}

export default function RecruiterAnalytics({
  interviews,
  applications,
}: RecruiterAnalyticsProps) {
  // 1. Interview Outcomes (Pie Chart)
  const outcomeData = [
    {
      name: "Selected",
      value: interviews.filter((i) => i.result === "selected").length,
      color: "#22c55e", // green-500
    },
    {
      name: "Rejected",
      value: interviews.filter((i) => i.result === "rejected").length,
      color: "#ef4444", // red-500
    },
    {
      name: "Pending",
      value: interviews.filter((i) => i.result === "pending" || !i.result)
        .length,
      color: "#eab308", // yellow-500
    },
  ];

  // 2. Daily Interview Load (Bar Chart)
  // Group interviews by date
  const interviewsByDate: Record<string, number> = {};

  interviews.forEach((i) => {
    const d = new Date(i.date);
    if (!isNaN(d.getTime())) {
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD for grouping
      interviewsByDate[dateKey] = (interviewsByDate[dateKey] || 0) + 1;
    }
  });

  const dailyLoadData = Object.entries(interviewsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // Take the most recent 7-10 active days or just slicing to fit
    .slice(-10);

  // 3. Candidate Pipeline (Bar Chart - Funnel like)
  const pipelineData = [
    {
      name: "Shortlisted",
      value: applications.length,
      fill: "#3b82f6", // blue-500
    },
    {
      name: "Scheduled",
      value: interviews.length,
      fill: "#8b5cf6", // violet-500
    },
    {
      name: "Feedback",
      value: interviews.filter((i) => i.feedback).length,
      fill: "#f97316", // orange-500
    },
    {
      name: "Selected",
      value: interviews.filter((i) => i.result === "selected").length,
      fill: "#22c55e", // green-500
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
      {/* Candidate Pipeline - Bar Chart */}
      <Card className="col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
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
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Interview Outcomes - Pie Chart */}
      <Card className="col-span-3 lg:col-span-3">
        <CardHeader>
          <CardTitle>Interview Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={outcomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {outcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            {outcomeData.map((entry) => (
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

      {/* Daily Interview Load - Bar Chart */}
      <Card className="col-span-7 lg:col-span-7">
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyLoadData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (isNaN(date.getTime())) return value;
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
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
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
