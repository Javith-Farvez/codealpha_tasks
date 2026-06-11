import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/AppShell";
import { toast } from "sonner";
import { Palette, Bell, User as UserIcon, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — TaskForge Pro" }] }),
  component: SettingsPage,
});

const COLORS = [
  "from-violet-500 to-fuchsia-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-indigo-500 to-purple-500",
];

function SettingsPage() {
  const { members, currentUserId, updateProfile, theme, setTheme } = useStore();
  const me = members.find(m => m.id === currentUserId)!;
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const [role, setRole] = useState(me.role);
  const [color, setColor] = useState(me.avatarColor);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  const save = () => {
    updateProfile({ name, email, role, avatarColor: color });
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, appearance, and notifications.</p>
      </div>

      <Card className="glass border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2"><UserIcon className="h-4 w-4" /><h2 className="font-semibold">Profile</h2></div>
        <div className="flex items-center gap-4">
          <Avatar name={name || "?"} color={color} size="lg" />
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} className={`h-8 w-8 rounded-full bg-gradient-to-br ${c} ring-2 ${color === c ? "ring-primary" : "ring-transparent"}`} />
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="text-xs text-muted-foreground">Full Name</label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><label className="text-xs text-muted-foreground">Email</label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" />Role</label>
            <Select value={role} onValueChange={(v: any) => setRole(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Team Member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="glass border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2"><Palette className="h-4 w-4" /><h2 className="font-semibold">Appearance</h2></div>
        <div className="flex items-center justify-between">
          <div><div className="text-sm font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Use a darker theme across the app.</div></div>
          <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
        </div>
      </Card>

      <Card className="glass border-border/50 p-6 space-y-4">
        <div className="flex items-center gap-2"><Bell className="h-4 w-4" /><h2 className="font-semibold">Notifications</h2></div>
        <Row label="Email notifications" desc="Updates, mentions, and assignments." checked={notifEmail} onChange={setNotifEmail} />
        <Row label="Push notifications" desc="Real-time alerts in your browser." checked={notifPush} onChange={setNotifPush} />
        <Row label="Weekly digest" desc="A weekly summary every Monday morning." checked={notifWeekly} onChange={setNotifWeekly} />
      </Card>

      <div className="flex justify-end gap-2">
        <Badge variant="secondary">Signed in as {me.email}</Badge>
        <Button onClick={save} className="bg-gradient-brand border-0">Save changes</Button>
      </div>
    </div>
  );
}

function Row({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
