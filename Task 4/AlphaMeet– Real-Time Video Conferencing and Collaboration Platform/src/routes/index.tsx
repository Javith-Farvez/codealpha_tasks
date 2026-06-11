import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alpha Meet — Real-time video meetings" },
      { name: "description", content: "Schedule, host, and join real-time meetings with your team." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-lg gradient-primary grid place-items-center">
            <Video className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">Alpha Meet</span>
        </div>
        <div className="flex gap-2">
          <Link to="/auth"><Button variant="ghost">Sign in</Button></Link>
          <Link to="/auth"><Button className="gradient-primary text-primary-foreground">Get started</Button></Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Meetings that <span className="text-gradient">just work.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Schedule, host, and join real-time video meetings with built-in chat. Real backend, real database, real-time updates.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/auth"><Button size="lg" className="gradient-primary text-primary-foreground">Start free</Button></Link>
          <Link to="/auth"><Button size="lg" variant="outline">Sign in</Button></Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            { icon: Calendar, title: "Schedule instantly", desc: "Pick a date and time. Done." },
            { icon: Users, title: "Join with one click", desc: "Live room codes for every meeting." },
            { icon: Zap, title: "Realtime updates", desc: "New meetings appear without refresh." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-xl p-6">
              <f.icon className="size-7 text-primary mb-3" />
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
