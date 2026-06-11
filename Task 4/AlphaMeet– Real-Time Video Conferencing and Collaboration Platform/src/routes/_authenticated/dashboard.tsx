import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Video, Users, Clock, Trash2, X, MessageSquare, TrendingUp, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { TEAM } from "@/lib/seed-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Alpha Meet" }] }),
  component: Dashboard,
});

type Meeting = {
  id: string; host_id: string; title: string; description: string | null;
  scheduled_at: string; duration_minutes: number; room_code: string; status: string;
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .gte("scheduled_at", new Date(Date.now() - 1000 * 60 * 60).toISOString())
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true })
      .limit(50);
    if (error) toast.error(error.message);
    setMeetings((data as Meeting[]) ?? []);
    setLoading(false);
  };

  const seedIfEmpty = async () => {
    if (!user || seeded) return;
    const { count } = await supabase.from("meetings").select("id", { count: "exact", head: true }).eq("host_id", user.id);
    if ((count ?? 0) > 0) { setSeeded(true); return; }
    const titles = [
      "Product Team Sync", "Design Review", "Engineering Standup", "Sprint Planning",
      "Client Onboarding Call", "Marketing Brainstorm", "1:1 with Manager", "All-Hands Meeting",
      "Architecture Discussion", "QA Triage", "Customer Feedback Session", "Roadmap Review",
    ];
    const now = Date.now();
    const rows = titles.map((title, i) => ({
      host_id: user.id, title,
      description: `Auto-created sample meeting — ${title}`,
      scheduled_at: new Date(now + (i - 1) * 1000 * 60 * 60 * 3).toISOString(),
      duration_minutes: [30, 45, 60][i % 3],
    }));
    const { error } = await supabase.from("meetings").insert(rows);
    if (error) toast.error("Seed failed: " + error.message);
    setSeeded(true);
    load();
  };

  useEffect(() => {
    load();
    const channel = supabase.channel("meetings-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => { seedIfEmpty(); /* eslint-disable-next-line */ }, [user]);

  const join = (m: Meeting) => navigate({ to: "/meeting/$code", params: { code: m.room_code } });
  const cancel = async (id: string) => {
    const { error } = await supabase.from("meetings").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Meeting cancelled");
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this meeting permanently?")) return;
    const { error } = await supabase.from("meetings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Meeting deleted");
  };

  const now = Date.now();
  const live = meetings.filter((m) => now >= new Date(m.scheduled_at).getTime() - 5 * 60_000 && now < new Date(m.scheduled_at).getTime() + m.duration_minutes * 60_000);
  const upcoming = meetings.filter((m) => !live.includes(m));

  const stats = [
    { label: "Active Meetings", value: live.length || meetings.length, icon: Video, gradient: "from-indigo-500 to-violet-500" },
    { label: "Team Members", value: TEAM.length * 19 + 4, icon: Users, gradient: "from-violet-500 to-purple-500" },
    { label: "Messages Today", value: "1,234", icon: MessageSquare, gradient: "from-cyan-500 to-teal-500" },
    { label: "Productivity", value: "+32%", icon: TrendingUp, gradient: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${s.gradient} text-white`}>
            <div className="absolute -top-6 -right-6 size-32 rounded-full bg-white/15 blur-xl" />
            <div className="absolute top-3 right-3 size-16 rounded-full bg-white/10" />
            <s.icon className="size-7 opacity-90" />
            <div className="text-4xl font-bold mt-6">{s.value}</div>
            <div className="text-sm opacity-90 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Meetings */}
      {live.length > 0 && (
        <Card className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Active Meetings</h2>
            <Link to="/schedule">
              <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="size-4 mr-1.5" />Start Meeting</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {live.map((m) => (
              <div key={m.id} className="bg-secondary/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{m.title}</h3>
                    <Badge className="bg-destructive text-destructive-foreground">● LIVE</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Hosted by {m.host_id === user?.id ? "You" : TEAM[Math.floor(Math.random() * TEAM.length)].name}</p>
                  <Button onClick={() => join(m)} size="sm" className="gradient-primary text-primary-foreground mt-3">
                    <Play className="size-4 mr-1.5" />Join Meeting
                  </Button>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{m.duration_minutes} min</p>
                  <p className="text-primary">{Math.floor(Math.random() * 12) + 3} participants</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upcoming */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Upcoming meetings</h2>
          <p className="text-muted-foreground mt-1">{loading ? "Loading…" : `${upcoming.length} scheduled`} · realtime updates on</p>
        </div>
        <Link to="/schedule">
          <Button className="gradient-primary text-primary-foreground"><CalendarPlus className="size-4 mr-2" />Schedule a meeting</Button>
        </Link>
      </div>

      {!loading && meetings.length === 0 && (
        <Card className="glass p-10 text-center">
          <Video className="size-10 mx-auto text-muted-foreground" />
          <h3 className="mt-3 font-semibold">No meetings yet</h3>
          <p className="text-muted-foreground text-sm mt-1">Schedule one to get started.</p>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcoming.map((m) => {
          const date = new Date(m.scheduled_at);
          const isHost = m.host_id === user?.id;
          return (
            <Card key={m.id} className="glass p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg leading-tight">{m.title}</h3>
                <Badge variant="secondary">{m.status}</Badge>
              </div>
              {m.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{m.description}</p>}
              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" />{format(date, "PPP · p")}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="size-4" />{m.duration_minutes} min · {formatDistanceToNow(date, { addSuffix: true })}</div>
                <div className="text-xs text-muted-foreground">Room: <span className="font-mono">{m.room_code}</span></div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button size="sm" onClick={() => join(m)} className="gradient-primary text-primary-foreground flex-1"><Video className="size-4 mr-1.5" />Join</Button>
                {isHost && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => cancel(m.id)} title="Cancel"><X className="size-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(m.id)} title="Delete"><Trash2 className="size-4" /></Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
