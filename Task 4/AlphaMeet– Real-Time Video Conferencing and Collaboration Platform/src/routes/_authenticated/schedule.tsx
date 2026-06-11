import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format,
  isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths,
} from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/schedule")({
  head: () => ({ meta: [{ title: "Meeting Scheduler — Alpha Meet" }] }),
  component: Schedule,
});

type Meeting = {
  id: string; host_id: string; title: string; description: string | null;
  scheduled_at: string; duration_minutes: number; room_code: string; status: string;
};

function Schedule() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("meetings").select("*").neq("status", "cancelled")
      .order("scheduled_at", { ascending: true });
    setMeetings((data as Meeting[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("schedule-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const meetingsByDay = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    meetings.forEach((m) => {
      const key = format(new Date(m.scheduled_at), "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    });
    return map;
  }, [meetings]);

  const upcoming = meetings
    .filter((m) => new Date(m.scheduled_at).getTime() >= Date.now() - 30 * 60_000)
    .slice(0, 8);

  const join = (m: Meeting) => navigate({ to: "/meeting/$code", params: { code: m.room_code } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Meeting Scheduler</h1>
          <p className="text-muted-foreground mt-1">Manage your meetings and calendar</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><CalendarPlus className="size-4 mr-2" />Schedule Meeting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Schedule a meeting</DialogTitle></DialogHeader>
            <ScheduleForm
              defaultDate={selectedDay}
              onCreated={(m) => { setOpen(false); load(); toast.success("Meeting scheduled!"); navigate({ to: "/meeting/$code", params: { code: m.room_code } }); }}
              userId={user?.id}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Calendar */}
        <Card className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{format(month, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => setMonth(subMonths(month, 1))}><ChevronLeft className="size-4" /></Button>
              <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => { setMonth(new Date()); setSelectedDay(new Date()); }}>Today</Button>
              <Button size="icon" variant="ghost" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight className="size-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-xs text-muted-foreground mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="px-2 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const dayMeetings = meetingsByDay.get(key) ?? [];
              const isSelected = isSameDay(d, selectedDay);
              const isCurrentMonth = isSameMonth(d, month);
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(d)}
                  className={`aspect-square rounded-xl p-2 text-left transition relative ${
                    isSelected ? "gradient-primary text-primary-foreground"
                    : dayMeetings.length ? "bg-secondary/80 hover:bg-secondary"
                    : "hover:bg-secondary/40"
                  } ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <span className="text-sm font-medium">{format(d, "d")}</span>
                  {dayMeetings.length > 0 && (
                    <div className="absolute bottom-1.5 left-1.5 flex gap-0.5">
                      {dayMeetings.slice(0, 3).map((m) => (
                        <span key={m.id} className={`size-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Upcoming list */}
        <Card className="glass p-5">
          <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
          <div className="space-y-3">
            {upcoming.length === 0 && <p className="text-muted-foreground text-sm">Nothing scheduled yet.</p>}
            {upcoming.map((m) => {
              const date = new Date(m.scheduled_at);
              return (
                <div key={m.id} className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{m.title}</h4>
                    <span className="text-xs text-muted-foreground shrink-0">{format(date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="size-3" />
                    {format(date, "p")} – {format(new Date(date.getTime() + m.duration_minutes * 60_000), "p")}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex -space-x-1.5">
                      {["👩‍💼", "👨‍💻", "👩‍🎨"].slice(0, (m.duration_minutes % 3) + 1).map((a, i) => (
                        <div key={i} className="size-6 rounded-full bg-primary/30 grid place-items-center text-xs ring-2 ring-background">{a}</div>
                      ))}
                    </div>
                    <Button size="sm" onClick={() => join(m)} className="gradient-primary text-primary-foreground h-7"><Play className="size-3 mr-1" />Join</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ScheduleForm({ defaultDate, onCreated, userId }: { defaultDate: Date; onCreated: (m: Meeting) => void; userId?: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(defaultDate, "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(Date.now() + 60 * 60_000), "HH:mm"));
  const [duration, setDuration] = useState(30);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    const scheduledAt = new Date(`${date}T${time}`);
    if (isNaN(scheduledAt.getTime())) { toast.error("Invalid date/time"); setSaving(false); return; }
    const { data, error } = await supabase.from("meetings").insert({
      host_id: userId, title, description: description || null,
      scheduled_at: scheduledAt.toISOString(), duration_minutes: duration,
    }).select().single();
    setSaving(false);
    if (error) return toast.error(error.message);
    onCreated(data as Meeting);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly team sync" />
      </div>
      <div>
        <Label htmlFor="desc">Description (optional)</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will we discuss?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label htmlFor="date">Date</Label><Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><Label htmlFor="time">Time</Label><Input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></div>
      </div>
      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input id="duration" type="number" min={5} max={480} required value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 30)} />
      </div>
      <Button type="submit" disabled={saving} className="gradient-primary text-primary-foreground w-full">
        {saving ? "Scheduling…" : "Schedule meeting"}
      </Button>
    </form>
  );
}
