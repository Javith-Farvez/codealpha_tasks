import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Avatar, AvatarStack } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, CheckCircle2, Clock, Target, ArrowUpRight,
  Activity as ActivityIcon, CalendarClock, Sparkles,
} from "lucide-react";
import { differenceInDays, format, isToday, parseISO } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — TaskForge Pro" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { projects, tasks, activity, members, currentUserId } = useStore();
  const me = members.find(m => m.id === currentUserId)!;

  const active = projects.filter(p => p.status === "active");
  const completed = tasks.filter(t => t.column === "completed");
  const dueToday = tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)) && t.column !== "completed");
  const productivity = Math.round((completed.length / Math.max(tasks.length, 1)) * 100);

  const stats = [
    { label: "Active Projects", value: active.length, icon: Target, gradient: "from-violet-500 to-fuchsia-500", delta: "+2 this week" },
    { label: "Tasks Due Today", value: dueToday.length, icon: Clock, gradient: "from-amber-500 to-orange-500", delta: "next 24h" },
    { label: "Completed Tasks", value: completed.length, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500", delta: "+8 this week" },
    { label: "Productivity", value: `${productivity}%`, icon: TrendingUp, gradient: "from-cyan-500 to-blue-500", delta: "trending up" },
  ];

  const upcoming = [...tasks]
    .filter(t => t.dueDate && t.column !== "completed")
    .sort((a, b) => +parseISO(a.dueDate!) - +parseISO(b.dueDate!))
    .slice(0, 6);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-brand opacity-30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-aurora opacity-20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Sparkles className="h-4 w-4 text-primary" /> Welcome back, {me.name.split(" ")[0]}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              You have <span className="text-gradient">{dueToday.length} tasks</span> due today
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening across your workspace.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/board" className="px-4 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-90 transition">Open Kanban</Link>
            <Link to="/projects" className="px-4 py-2.5 rounded-xl glass text-sm font-medium hover:bg-white/5 transition">New Project</Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass border-border/50 p-5 hover:shadow-glow transition-all group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="text-3xl font-bold mt-1">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-emerald-400" />{s.delta}</div>
                  </div>
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.gradient} grid place-items-center shadow-lg group-hover:scale-110 transition`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Projects</h2>
            <Link to="/projects" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {active.map(p => {
              const projTasks = tasks.filter(t => t.projectId === p.id);
              const done = projTasks.filter(t => t.column === "completed").length;
              const pct = Math.round((done / Math.max(projTasks.length, 1)) * 100);
              return (
                <motion.div key={p.id} whileHover={{ y: -2 }}>
                  <Card className="glass border-border/50 p-5 h-full">
                    <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${p.color} mb-3`} />
                    <div className="font-semibold">{p.name}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                      <span>{done}/{projTasks.length} tasks</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 mt-1.5" />
                    <div className="flex items-center justify-between mt-4">
                      <AvatarStack ids={p.memberIds} />
                      {p.dueDate && (
                        <Badge variant="outline" className="text-[10px] border-white/10">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          {differenceInDays(parseISO(p.dueDate), new Date())}d left
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Upcoming deadlines */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
          </div>
          <Card className="glass border-border/50 divide-y divide-border/40">
            {upcoming.map(t => {
              const project = projects.find(p => p.id === t.projectId);
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-white/5 transition">
                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${project?.color} grid place-items-center text-[10px] font-bold text-white`}>
                    {format(parseISO(t.dueDate!), "dd")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{project?.name} · {format(parseISO(t.dueDate!), "MMM d")}</div>
                  </div>
                  <PriorityBadge p={t.priority} />
                  <AvatarStack ids={t.assigneeIds} max={2} />
                </div>
              );
            })}
          </Card>
        </div>

        {/* Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><ActivityIcon className="h-5 w-5" /> Team Activity</h2>
          <Card className="glass border-border/50 p-4 space-y-3 max-h-[640px] overflow-y-auto scrollbar-thin">
            {activity.map(a => {
              const u = members.find(m => m.id === a.userId);
              if (!u) return null;
              return (
                <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                  <Avatar name={u.name} color={u.avatarColor} size="sm" />
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{u.name.split(" ")[0]}</span>{" "}
                    <span className="text-muted-foreground">{a.text}</span>
                    <div className="text-[10px] text-muted-foreground/70 mt-0.5">just now</div>
                  </div>
                </motion.div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

export function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, string> = {
    low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    medium: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    high: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    urgent: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full border ${map[p]} font-medium capitalize`}>{p}</span>;
}
