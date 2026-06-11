import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { AvatarStack } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon, Trash2, Archive } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — TaskForge Pro" }] }),
  component: Projects,
});

const COLORS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-purple-500",
];

function Projects() {
  const { projects, tasks, members, addProject, deleteProject, updateProject } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const create = () => {
    if (!name.trim()) return;
    addProject({ name, description: desc, color, memberIds: members.slice(0, 3).map(m => m.id), dueDate: undefined });
    setName(""); setDesc(""); setOpen(false);
    toast.success("Project created");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm">All your team's projects in one place.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-brand border-0 hover:opacity-90"><Plus className="h-4 w-4 mr-1" /> New Project</Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader><DialogTitle>Create new project</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Project name" value={name} onChange={e => setName(e.target.value)} />
              <Textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Cover color</div>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${c} ring-2 ${color === c ? "ring-primary" : "ring-transparent"}`} />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={create} className="bg-gradient-brand border-0">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p, i) => {
          const projTasks = tasks.filter(t => t.projectId === p.id);
          const done = projTasks.filter(t => t.column === "completed").length;
          const pct = Math.round((done / Math.max(projTasks.length, 1)) * 100);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="glass border-border/50 overflow-hidden hover:shadow-glow transition-all group">
                <div className={`h-24 bg-gradient-to-br ${p.color} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-black/30 border-0 backdrop-blur capitalize">{p.status}</Badge>
                </div>
                <div className="p-5 -mt-6 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link to="/board" className="font-semibold text-lg hover:text-primary transition truncate block">{p.name}</Link>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>{done}/{projTasks.length} tasks</span>
                    <span className="font-semibold text-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5 mt-1.5" />
                  <div className="flex items-center justify-between mt-4">
                    <AvatarStack ids={p.memberIds} />
                    <div className="flex items-center gap-1">
                      {p.dueDate && (
                        <Badge variant="outline" className="text-[10px] border-white/10">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {differenceInDays(parseISO(p.dueDate), new Date())}d
                        </Badge>
                      )}
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { updateProject(p.id, { status: "archived" }); toast("Archived"); }}>
                        <Archive className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-400 hover:text-rose-300" onClick={() => { deleteProject(p.id); toast("Project deleted"); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
