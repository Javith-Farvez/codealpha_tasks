import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Video, Mail } from "lucide-react";
import { TEAM } from "@/lib/seed-data";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({ meta: [{ title: "Team — Alpha Meet" }] }),
  component: TeamPage,
});

const STATUS_COLOR = { online: "bg-green-500", away: "bg-yellow-500", offline: "bg-muted-foreground" } as const;

function TeamPage() {
  const [q, setQ] = useState("");
  const list = TEAM.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.role.toLowerCase().includes(q.toLowerCase()));
  const online = TEAM.filter((m) => m.status === "online").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Team Members</h1>
          <p className="text-muted-foreground mt-1">{TEAM.length} members · {online} online</p>
        </div>
        <div className="relative">
          <Search className="size-4 absolute left-3 top-3 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search team…" className="pl-9 w-72" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((m) => (
          <Card key={m.id} className="glass p-5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="size-14 rounded-full grid place-items-center bg-secondary text-3xl">{m.avatar}</div>
                <span className={`absolute bottom-0 right-0 size-3.5 rounded-full ring-2 ring-background ${STATUS_COLOR[m.status]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{m.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{m.role}</p>
                <Badge variant="secondary" className="mt-1 capitalize text-xs">{m.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link to="/chat" className="flex-1">
                <Button size="sm" variant="outline" className="w-full"><MessageSquare className="size-4 mr-1.5" />Message</Button>
              </Link>
              <Link to="/schedule" className="flex-1">
                <Button size="sm" className="gradient-primary text-primary-foreground w-full"><Video className="size-4 mr-1.5" />Meet</Button>
              </Link>
              <a href={`mailto:${m.email}`}>
                <Button size="sm" variant="outline"><Mail className="size-4" /></Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
