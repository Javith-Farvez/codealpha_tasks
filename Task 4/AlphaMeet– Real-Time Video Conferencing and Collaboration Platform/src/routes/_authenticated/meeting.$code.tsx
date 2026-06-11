import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/meeting/$code")({
  head: () => ({ meta: [{ title: "In meeting — Alpha Meet" }] }),
  component: Room,
});

type Meeting = {
  id: string; host_id: string; title: string; description: string | null;
  scheduled_at: string; duration_minutes: number; room_code: string; status: string;
};
type Participant = { id: string; user_id: string; joined_at: string; left_at: string | null };
type Msg = { id: string; user_id: string; body: string; created_at: string };
type Profile = { id: string; display_name: string | null };

function Room() {
  const { code } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);

  // Load meeting + join
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: m, error } = await supabase.from("meetings").select("*").eq("room_code", code).maybeSingle();
      if (error || !m) { toast.error("Meeting not found"); navigate({ to: "/dashboard" }); return; }
      setMeeting(m as Meeting);

      // Join
      await supabase.from("meeting_participants").upsert(
        { meeting_id: m.id, user_id: user.id, left_at: null },
        { onConflict: "meeting_id,user_id" }
      );
      // Mark live if host and time has come
      if (m.host_id === user.id && new Date(m.scheduled_at).getTime() <= Date.now() && m.status === "scheduled") {
        await supabase.from("meetings").update({ status: "live" }).eq("id", m.id);
      }

      loadParticipants(m.id);
      loadMessages(m.id);

      const ch = supabase.channel(`room-${m.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "meeting_participants", filter: `meeting_id=eq.${m.id}` }, () => loadParticipants(m.id))
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "meeting_messages", filter: `meeting_id=eq.${m.id}` }, (p) => {
          setMessages((cur) => [...cur, p.new as Msg]);
        })
        .subscribe();

      return () => { supabase.removeChannel(ch); };
    })();
    // eslint-disable-next-line
  }, [user, code]);

  const loadParticipants = async (mid: string) => {
    const { data } = await supabase.from("meeting_participants").select("*").eq("meeting_id", mid).is("left_at", null);
    const list = (data as Participant[]) ?? [];
    setParticipants(list);
    const ids = [...new Set(list.map((p) => p.user_id))];
    if (ids.length) {
      const { data: pr } = await supabase.from("profiles").select("id, display_name").in("id", ids);
      const map: Record<string, Profile> = {};
      (pr as Profile[] | null)?.forEach((p) => (map[p.id] = p));
      setProfiles(map);
    }
  };
  const loadMessages = async (mid: string) => {
    const { data } = await supabase.from("meeting_messages").select("*").eq("meeting_id", mid).order("created_at");
    setMessages((data as Msg[]) ?? []);
  };

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Camera/mic
  useEffect(() => {
    if (!camOn && !micOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    navigator.mediaDevices?.getUserMedia({ video: camOn, audio: micOn })
      .then((s) => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => toast.error("Camera/mic access denied"));
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line
  }, [camOn, micOn]);

  const leave = async () => {
    if (meeting && user) {
      await supabase.from("meeting_participants").update({ left_at: new Date().toISOString() })
        .eq("meeting_id", meeting.id).eq("user_id", user.id);
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    navigate({ to: "/dashboard" });
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !meeting || !user) return;
    const body = draft.trim();
    setDraft("");
    const { error } = await supabase.from("meeting_messages").insert({
      meeting_id: meeting.id, user_id: user.id, body,
    });
    if (error) toast.error(error.message);
  };

  if (!meeting) return <div className="text-muted-foreground">Loading meeting…</div>;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">{meeting.title}</h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(meeting.scheduled_at), "PPP · p")} · Room <span className="font-mono">{meeting.room_code}</span>
            </p>
          </div>
          <Badge className="bg-destructive text-destructive-foreground">LIVE</Badge>
        </div>

        <Card className="glass aspect-video grid place-items-center overflow-hidden relative">
          {camOn ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="size-24 rounded-full gradient-primary grid place-items-center mx-auto text-3xl font-semibold text-primary-foreground">
                {(profiles[user?.id ?? ""]?.display_name ?? "U")[0]?.toUpperCase()}
              </div>
              <p className="mt-3 text-muted-foreground">Camera off</p>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 glass rounded-full p-2">
            <Button size="icon" variant={micOn ? "secondary" : "destructive"} onClick={() => setMicOn(!micOn)}>
              {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
            </Button>
            <Button size="icon" variant={camOn ? "secondary" : "destructive"} onClick={() => setCamOn(!camOn)}>
              {camOn ? <VideoIcon className="size-4" /> : <VideoOff className="size-4" />}
            </Button>
            <Button size="icon" variant="destructive" onClick={leave}>
              <PhoneOff className="size-4" />
            </Button>
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Users className="size-4" /> Participants ({participants.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <Badge key={p.id} variant="secondary" className="gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400" />
                {profiles[p.user_id]?.display_name ?? "User"}
                {p.user_id === meeting.host_id && <span className="text-xs opacity-70">(host)</span>}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card className="glass flex flex-col h-[calc(100vh-180px)] sticky top-24">
        <div className="p-4 border-b border-border/50 font-medium">Chat</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && <p className="text-sm text-muted-foreground text-center">No messages yet.</p>}
          {messages.map((m) => {
            const isMe = m.user_id === user?.id;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-xs text-muted-foreground">{profiles[m.user_id]?.display_name ?? "User"}</span>
                <div className={`mt-1 px-3 py-2 rounded-lg max-w-[80%] text-sm ${isMe ? "gradient-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.body}
                </div>
              </div>
            );
          })}
          <div ref={chatEnd} />
        </div>
        <form onSubmit={send} className="p-3 border-t border-border/50 flex gap-2">
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" />
          <Button size="icon" type="submit" className="gradient-primary text-primary-foreground">
            <Send className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
