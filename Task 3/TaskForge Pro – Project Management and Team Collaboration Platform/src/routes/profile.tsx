import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, ListTodo, FolderKanban, Mail, Shield } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — TaskForge Pro" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { members, currentUserId, tasks, projects, activity } = useStore();
  const me = members.find(m => m.id === currentUserId)!;
  const myTasks = tasks.filter(t => t.assigneeIds.includes(me.id));
  const done = myTasks.filter(t => t.column === "completed").length;
  const open = myTasks.length - done;
  const projs = projects.filter(p => p.memberIds.includes(me.id));
  const recent = activity.filter(a => a.userId === me.id).slice(0, 8);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass border-border/50 p-6 relative overflow-hidden">
          <div className={`absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br ${me.avatarColor} opacity-20 blur-3xl`} />
          <div className="relative flex flex-wrap items-center gap-5">
            <Avatar name={me.name} color={me.avatarColor} size="lg" />
            <div className="flex-1 min-w-[200px]">
              <div className="text-2xl font-bold">{me.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{me.email}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-gradient-brand border-0"><Shield className="h-3 w-3 mr-1" />{me.role}</Badge>
                {me.online && <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">Online</Badge>}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Open Tasks" value={open} icon={ListTodo} color="from-cyan-500 to-blue-500" />
        <Stat label="Completed" value={done} icon={CheckCircle2} color="from-emerald-500 to-teal-500" />
        <Stat label="Projects" value={projs.length} icon={FolderKanban} color="from-violet-500 to-fuchsia-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50 p-5">
          <h3 className="font-semibold mb-3">Your Projects</h3>
          <div className="space-y-2">
            {projs.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${p.color}`} />
                <div className="flex-1"><div className="text-sm font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.description}</div></div>
              </div>
            ))}
            {!projs.length && <p className="text-sm text-muted-foreground">No projects yet.</p>}
          </div>
        </Card>
        <Card className="glass border-border/50 p-5">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {recent.map(a => (
              <div key={a.id} className="text-sm flex gap-2"><span className="text-muted-foreground">•</span><span>{a.text}</span></div>
            ))}
            {!recent.length && <p className="text-sm text-muted-foreground">No activity yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <Card className="glass border-border/50 p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} grid place-items-center text-white`}><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      </div>
    </Card>
  );
}
