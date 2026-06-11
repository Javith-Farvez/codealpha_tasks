import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Trash2 } from "lucide-react";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — TaskForge Pro" }] }),
  component: Team,
});

const COLORS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
];

function Team() {
  const { members, tasks, projects, addMember, removeMember } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Team Member");

  const handleInvite = () => {
    if (!name.trim() || !email.trim()) return;
    addMember({ name, email, role, avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)], online: true });
    setName(""); setEmail("");
    setOpen(false);
    toast.success(`Invitation sent to ${email}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground text-sm">{members.length} people in your workspace.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-brand border-0"><UserPlus className="h-4 w-4 mr-1" /> Invite Member</Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader><DialogTitle>Invite a teammate</DialogTitle></DialogHeader>
            <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Team Member">Team Member</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter><Button onClick={handleInvite} className="bg-gradient-brand border-0">Send Invitation</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m, i) => {
          const open = tasks.filter(t => t.assigneeIds.includes(m.id) && t.column !== "completed").length;
          const done = tasks.filter(t => t.assigneeIds.includes(m.id) && t.column === "completed").length;
          const projs = projects.filter(p => p.memberIds.includes(m.id)).length;
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="glass border-border/50 p-5 relative overflow-hidden group">
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${m.avatarColor} opacity-20 blur-2xl`} />
                <div className="flex items-start justify-between relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={m.name} color={m.avatarColor} size="lg" />
                      {m.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" />}
                    </div>
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-400" onClick={() => { removeMember(m.id); toast("Removed"); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Badge className="mt-3 bg-gradient-brand border-0">{m.role}</Badge>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <Stat label="Projects" value={projs} />
                  <Stat label="Open" value={open} />
                  <Stat label="Done" value={done} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-lg py-2">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}
