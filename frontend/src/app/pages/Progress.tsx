import { useState } from "react";
import { TrendingUp, TrendingDown, Trophy, Target, Flame, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const weightData = [
  { date: "Jan", weight: 82.5, muscle: 38 },
  { date: "Feb", weight: 81.8, muscle: 38.5 },
  { date: "Mar", weight: 80.4, muscle: 39.1 },
  { date: "Apr", weight: 79.2, muscle: 39.8 },
  { date: "May", weight: 78.6, muscle: 40.2 },
  { date: "Jun", weight: 77.9, muscle: 40.8 },
  { date: "Jul", weight: 77.2, muscle: 41.3 },
  { date: "Aug", weight: 76.5, muscle: 41.9 },
];

const strengthData = [
  { month: "Jan", bench: 70, squat: 100, deadlift: 120 },
  { month: "Feb", bench: 72.5, squat: 105, deadlift: 125 },
  { month: "Mar", bench: 75, squat: 107.5, deadlift: 130 },
  { month: "Apr", bench: 77.5, squat: 110, deadlift: 135 },
  { month: "May", bench: 80, squat: 115, deadlift: 140 },
  { month: "Jun", bench: 82.5, squat: 120, deadlift: 145 },
  { month: "Jul", bench: 82.5, squat: 120, deadlift: 150 },
  { month: "Aug", bench: 85, squat: 125, deadlift: 155 },
];

const radarData = [
  { subject: "Strength", A: 82, fullMark: 100 },
  { subject: "Cardio", A: 65, fullMark: 100 },
  { subject: "Flexibility", A: 54, fullMark: 100 },
  { subject: "Endurance", A: 71, fullMark: 100 },
  { subject: "Balance", A: 63, fullMark: 100 },
  { subject: "Speed", A: 58, fullMark: 100 },
];

const workoutFreqData = [
  { week: "W1", workouts: 4 },
  { week: "W2", workouts: 5 },
  { week: "W3", workouts: 3 },
  { week: "W4", workouts: 6 },
  { week: "W5", workouts: 5 },
  { week: "W6", workouts: 4 },
  { week: "W7", workouts: 6 },
  { week: "W8", workouts: 5 },
];

const prs = [
  { exercise: "Bench Press", weight: "85kg", date: "Aug 2", change: "+2.5kg", up: true },
  { exercise: "Squat", weight: "125kg", date: "Jul 28", change: "+5kg", up: true },
  { exercise: "Deadlift", weight: "155kg", date: "Aug 5", change: "+5kg", up: true },
  { exercise: "Overhead Press", weight: "60kg", date: "Jul 15", change: "+2.5kg", up: true },
  { exercise: "Pull-Ups", weight: "20 reps", date: "Jul 8", change: "+3 reps", up: true },
];

const bodyStats = [
  { label: "Body Fat", value: "16.2%", change: "-1.4%", up: false },
  { label: "Muscle Mass", value: "41.9kg", change: "+3.9kg", up: true },
  { label: "BMI", value: "22.8", change: "-1.1", up: false },
  { label: "VO2 Max", value: "48 ml/kg", change: "+3.5", up: true },
];

const calendarData = [
  [true, true, false, true, true, false, false],
  [true, false, true, true, true, false, true],
  [true, true, true, false, true, true, false],
  [false, true, true, true, false, true, true],
];

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("8M");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Progress & Analytics</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track your fitness journey over time
          </p>
        </div>
        <div className="flex gap-1">
          {["1M", "3M", "6M", "8M", "1Y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Body Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bodyStats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xl font-semibold text-foreground">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-500" />
                )}
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                <span className="text-xs text-muted-foreground">vs 3mo ago</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="body">
        <TabsList className="mb-4">
          <TabsTrigger value="body">Body Composition</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="fitness">Fitness Profile</TabsTrigger>
          <TabsTrigger value="records">PRs</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Chart */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Body Weight</CardTitle>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-medium">-6kg total</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#030213" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#030213" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#717182" }}
                      axisLine={false}
                      tickLine={false}
                      domain={["dataMin - 1", "dataMax + 1"]}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                      formatter={(v) => [`${v}kg`, "Weight"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#030213"
                      strokeWidth={2}
                      fill="url(#weightGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Muscle Mass Chart */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Muscle Mass</CardTitle>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">+3.9kg total</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weightData}>
                    <defs>
                      <linearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#717182" }}
                      axisLine={false}
                      tickLine={false}
                      domain={["dataMin - 1", "dataMax + 1"]}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                      formatter={(v) => [`${v}kg`, "Muscle"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="muscle"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#muscleGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Workout Frequency */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Workout Frequency</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Avg: 4.75/week</span>
                  <Badge variant="secondary" className="text-xs">Last 8 weeks</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={workoutFreqData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                    formatter={(v) => [v, "Workouts"]}
                  />
                  <Bar dataKey="workouts" fill="#030213" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Calendar */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activity Calendar</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-0.5">
                    {[0.1, 0.3, 0.6, 0.8, 1].map((o, i) => (
                      <div key={i} className="w-3 h-3 rounded-sm bg-primary" style={{ opacity: o }} />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="text-[10px] text-muted-foreground w-6 text-center">
                    {d}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5">
                {calendarData.map((week, wi) => (
                  <div key={wi} className="flex gap-2">
                    {week.map((active, di) => (
                      <div
                        key={di}
                        className={`w-6 h-6 rounded-sm transition-colors ${
                          active ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <Flame className="w-3 h-3 inline text-orange-500 mr-1" />
                <strong>14-day current streak</strong> · 22 workouts in last 28 days
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Strength Progress (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={strengthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#717182" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                    formatter={(v) => [`${v}kg`]}
                  />
                  <Legend iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="bench" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Bench Press" />
                  <Line type="monotone" dataKey="squat" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Squat" />
                  <Line type="monotone" dataKey="deadlift" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Deadlift" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Fitness Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#717182" }} />
                    <Radar
                      name="Fitness"
                      dataKey="A"
                      stroke="#030213"
                      fill="#030213"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {radarData.map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.subject}</span>
                    <span className="text-sm font-semibold text-foreground">{item.A}/100</span>
                  </div>
                  <Progress value={item.A} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Personal Records</CardTitle>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prs.map((pr, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{pr.exercise}</p>
                      <p className="text-xs text-muted-foreground">Set on {pr.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{pr.weight}</p>
                      <p className="text-xs text-green-600 font-medium">{pr.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Goals Progress */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Goal Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Weight Goal", current: "76.5kg", target: "74kg", progress: 78, color: "text-blue-500" },
              { label: "Bench Press PR", current: "85kg", target: "100kg", progress: 85, color: "text-purple-500" },
              { label: "Monthly Workouts", current: "18", target: "20", progress: 90, color: "text-green-500" },
            ].map((goal) => (
              <div key={goal.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{goal.label}</span>
                  <span className="text-sm font-semibold">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {goal.current}</span>
                  <span>Goal: {goal.target}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
