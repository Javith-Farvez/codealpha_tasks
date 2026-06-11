import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, Lock, Send, Search, Smile, Paperclip, Bell } from "lucide-react";
import { CHANNELS, SEED_MESSAGES, loadLS, saveLS, type ChatMessage, type Channel } from "@/lib/seed-data";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Chat — Alpha Meet" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>(() => loadLS("am.channels", CHANNELS));
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadLS("am.messages", SEED_MESSAGES));
  const [activeId, setActiveId] = useState<string>(channels[0]?.id ?? "c-general");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveLS("am.messages", messages); }, [messages]);
  useEffect(() => { saveLS("am.channels", channels); }, [channels]);

  const active = channels.find((c) => c.id === activeId)!;
  const filteredChannels = channels.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const activeMessages = useMemo(
    () => messages.filter((m) => m.channelId === activeId).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [messages, activeId]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeMessages.length, activeId]);

  // clear unread on open
  useEffect(() => {
    setChannels((cs) => cs.map((c) => (c.id === activeId && c.unread ? { ...c, unread: 0 } : c)));
    // eslint-disable-next-line
  }, [activeId]);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    const me: ChatMessage = {
      id: crypto.randomUUID(),
      channelId: activeId,
      authorId: user?.id ?? "me",
      authorName: user?.email?.split("@")[0] ?? "You",
      authorAvatar: "🧑",
      body,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, me]);
    setDraft("");
    // Simulate auto-reply in DMs/channels for that "real-time" feel
    const replyTo = active.kind === "dm" ? active.name : null;
    if (replyTo) {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            channelId: activeId,
            authorId: activeId,
            authorName: replyTo,
            authorAvatar: "👤",
            body: pickReply(),
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 1200 + Math.random() * 800);
    }
  };

  const createChannel = () => {
    const name = prompt("New channel name (lowercase, no spaces):")?.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name) return;
    const ch: Channel = { id: `c-${name}-${Date.now()}`, name, kind: "channel" };
    setChannels((c) => [...c, ch]);
    setActiveId(ch.id);
    toast.success(`#${name} created`);
  };

  return (
    <div className="grid grid-cols-[260px_1fr] gap-4 h-[calc(100vh-12rem)]">
      {/* Sidebar */}
      <Card className="glass p-3 flex flex-col">
        <div className="relative mb-3">
          <Search className="size-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input className="pl-8 h-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <SectionLabel onAdd={createChannel}>CHANNELS</SectionLabel>
        <div className="space-y-0.5 mb-3">
          {filteredChannels.filter((c) => c.kind === "channel").map((c) => (
            <ChannelRow key={c.id} c={c} active={c.id === activeId} onClick={() => setActiveId(c.id)} />
          ))}
        </div>
        <SectionLabel>DIRECT MESSAGES</SectionLabel>
        <div className="space-y-0.5 overflow-y-auto">
          {filteredChannels.filter((c) => c.kind === "dm").map((c) => (
            <ChannelRow key={c.id} c={c} active={c.id === activeId} onClick={() => setActiveId(c.id)} />
          ))}
        </div>
      </Card>

      {/* Main */}
      <Card className="glass flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
          <div className="flex items-center gap-2">
            {active.kind === "channel" ? <Hash className="size-5" /> : <Lock className="size-4" />}
            <h2 className="font-semibold">{active.name}</h2>
            <span className="text-sm text-muted-foreground ml-2">156 members</span>
          </div>
          <Button variant="ghost" size="icon"><Bell className="size-4" /></Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {activeMessages.map((m) => {
            const mine = m.authorId === (user?.id ?? "me");
            return (
              <div key={m.id} className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}>
                <div className="size-9 rounded-full grid place-items-center bg-secondary text-lg shrink-0">{m.authorAvatar}</div>
                <div className={`max-w-[70%] ${mine ? "items-end" : ""} flex flex-col`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm">{m.authorName}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(m.createdAt), "p")}</span>
                  </div>
                  <div className={`rounded-2xl px-4 py-2 text-sm ${mine ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                    {m.body}
                  </div>
                </div>
              </div>
            );
          })}
          {activeMessages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">No messages yet — say hello 👋</div>
          )}
        </div>

        <div className="border-t border-border/50 p-3">
          <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2">
            <Button variant="ghost" size="icon" className="size-8"><Paperclip className="size-4" /></Button>
            <Input
              placeholder={`Message ${active.kind === "channel" ? "#" + active.name : active.name}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              className="border-0 bg-transparent focus-visible:ring-0 px-0"
            />
            <Button variant="ghost" size="icon" className="size-8"><Smile className="size-4" /></Button>
            <Button onClick={send} className="gradient-primary text-primary-foreground">
              <Send className="size-4 mr-1.5" />Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ChannelRow({ c, active, onClick }: { c: Channel; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-sm transition ${
        active ? "gradient-primary text-primary-foreground" : "hover:bg-secondary/70"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        {c.kind === "channel" ? <Hash className="size-4 opacity-70" /> : <span className="size-2 rounded-full bg-green-500" />}
        <span className="truncate">{c.name}</span>
      </span>
      {!!c.unread && <Badge className="bg-destructive text-destructive-foreground h-5 px-1.5">{c.unread}</Badge>}
    </button>
  );
}

function SectionLabel({ children, onAdd }: { children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between px-2 mb-1 mt-2">
      <span className="text-[11px] font-semibold text-muted-foreground tracking-wider">{children}</span>
      {onAdd && <button onClick={onAdd} className="text-muted-foreground hover:text-foreground text-base leading-none">+</button>}
    </div>
  );
}

const REPLIES = [
  "Got it 👍",
  "On it!",
  "Sounds good, let me check.",
  "Yep, I'll handle it.",
  "Thanks for the heads up!",
  "Let's chat in the meeting.",
  "Pushing an update now.",
];
function pickReply() { return REPLIES[Math.floor(Math.random() * REPLIES.length)]; }
