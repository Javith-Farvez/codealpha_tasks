import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts";
import { COLUMNS } from "@/lib/types";
import { format, subDays } from "date-fns";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TaskForge Pro" }] }),
  component: Analytics,
});

function Analytics() {
  const { tasks, members, projects } = useStore();

  const trend = Array.from({ length: 14 }).map((_, i) => {
    const d = subDays(new Date(), 13 - i);
    return {
      date: format(d, "MMM d"),
      completed: Math.round(5 + Math.sin(i / 2) * 3 + Math.random() * 4),
      created: Math.round(6 + Math.cos(i / 2) * 2 + Math.random() * 3),
    };
  });

  const byColumn = COLUMNS.map(c => ({
    name: c.title,
    value: tasks.filter(t => t.column === c.id).length,
  }));

  const workload = members.map(m => ({
    name: m.name.split(" ")[0],
    tasks: tasks.filter(t => t.assigneeIds.includes(m.id) && t.column !== "completed").length,
  }));

  const projectProgress = projects.map(p => {
    const total = tasks.filter(t => t.projectId === p.id).length;
    const done = tasks.filter(t => t.projectId === p.id && t.column === "completed").length;
    return { name: p.name.split(" ")[0], progress: Math.round(done / Math.max(total, 1) * 100) };
  });

  const COLORS = ["#8B5CF6", "#06B6D4", "#22C55E", "#F59E0B", "#EC4899", "#6366F1"];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Productivity, performance & workload insights.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass border-border/50 p-5 lg:col-span-2">
          <div className="font-semibold mb-1">Productivity Trends</div>
          <div className="text-xs text-muted-foreground mb-4">Tasks created vs completed (14 days)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1f1b2e", border: "1px solid #333", borderRadius: 12 }} />
                <Area type="monotone" dataKey="completed" stroke="#8B5CF6" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="created" stroke="#06B6D4" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-border/50 p-5">
          <div className="font-semibold mb-1">Task Distribution</div>
          <div className="text-xs text-muted-foreground mb-4">By column</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byColumn} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {byColumn.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f1b2e", border: "1px solid #333", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] mt-2">
            {byColumn.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border-border/50 p-5">
          <div className="font-semibold mb-1">Workload Distribution</div>
          <div className="text-xs text-muted-foreground mb-4">Open tasks per teammate</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={workload}>
                <XAxis dataKey="name" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1f1b2e", border: "1px solid #333", borderRadius: 12 }} />
                <Bar dataKey="tasks" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-border/50 p-5 lg:col-span-2">
          <div className="font-semibold mb-1">Project Progress</div>
          <div className="text-xs text-muted-foreground mb-4">Completion percentage</div>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={projectProgress}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="name" stroke="#aaa" fontSize={11} />
                <Radar dataKey="progress" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: "#1f1b2e", border: "1px solid #333", borderRadius: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
