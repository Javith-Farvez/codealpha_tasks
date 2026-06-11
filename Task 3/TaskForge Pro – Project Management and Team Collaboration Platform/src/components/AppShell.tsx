import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, KanbanSquare, Calendar as CalendarIcon,
  BarChart3, Users, Bell, Search, Plus, Sparkles, Sun, Moon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { initials, useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/board", label: "Kanban", icon: KanbanSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/team", label: "Team", icon: Users },
];

export function Avatar({ name, color, size = "md" }: { name: string; color: string; size?: "sm"|"md"|"lg" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} grid place-items-center font-semibold text-white ring-2 ring-background shadow-md shrink-0`}>
      {initials(name)}
    </div>
  );
}

export default function AppShell() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const navigate = useNavigate();
  const { members, currentUserId, notifications, markAllRead, theme, setTheme, isAuthenticated, logout, hydrate } = useStore();
  useEffect(() => { void hydrate(); }, [hydrate]);
  const me = members.find(m => m.id === currentUserId);
  const unread = notifications.filter(n => !n.read).length;
  const [q, setQ] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.classList.add("light");
    else root.classList.remove("light");
  }, [theme]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Wait one tick for zustand persist to rehydrate from localStorage
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated && pathname !== "/login") {
      navigate({ to: "/login" });
    }
  }, [hydrated, isAuthenticated, pathname, navigate]);

  if (pathname === "/login") return <Outlet />;
  if (!hydrated) {
    return <div className="min-h-screen bg-background" />;
  }
  if (!isAuthenticated || !me) {
    return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">Redirecting to sign in…</div>;
  }

  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col glass border-r border-border/50 m-3 rounded-2xl p-4 sticky top-3 h-[calc(100vh-1.5rem)]">
        <div className="flex items-center gap-2 px-2 pb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">TaskForge</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Pro</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map(item => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}>
                {active && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-gradient-brand opacity-90 shadow-glow" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="glass rounded-xl p-3 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-sunset grid place-items-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="font-semibold text-sm">Upgrade to Enterprise</div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Unlock unlimited automations, AI assist & SSO.</p>
          <Button size="sm" className="w-full bg-gradient-brand hover:opacity-90 border-0">Upgrade</Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-border/40">
          <div className="flex items-center gap-3 px-4 md:px-6 h-16">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects, tasks, people…"
                className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 grid place-items-center text-[9px] font-bold rounded-full bg-gradient-sunset text-white">{unread}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  Notifications
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.slice(0,6).map(n => (
                  <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                    <div className="flex items-center gap-2 w-full">
                      <span className={`h-2 w-2 rounded-full ${!n.read ? "bg-gradient-brand" : "bg-muted"}`} />
                      <span className="font-medium text-sm">{n.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">{n.body}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/board"><Button size="sm" className="bg-gradient-brand border-0 hover:opacity-90 hidden sm:flex"><Plus className="h-4 w-4 mr-1" /> New Task</Button></Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar name={me.name} color={me.avatarColor} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{me.name}</div>
                  <div className="text-xs text-muted-foreground font-normal">{me.email}</div>
                  <Badge className="mt-1.5 bg-gradient-brand border-0">{me.role}</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/login" }); }}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 px-3 py-2 overflow-x-auto scrollbar-thin border-b border-border/40">
          {nav.map(item => {
            const Icon = item.icon;
            const active = isActive(item.to, item.exact);
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${active ? "bg-gradient-brand text-white" : "bg-white/5 text-muted-foreground"}`}>
                <Icon className="h-3.5 w-3.5" />{item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 md:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AvatarStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  const { members } = useStore();
  const list = useMemo(() => ids.map(id => members.find(m => m.id === id)).filter(Boolean) as ReturnType<typeof members.find>[], [ids, members]);
  const visible = list.slice(0, max);
  const extra = list.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map(m => m && <Avatar key={m.id} name={m.name} color={m.avatarColor} size="sm" />)}
      {extra > 0 && (
        <div className="h-7 w-7 rounded-full bg-muted ring-2 ring-background grid place-items-center text-[10px] font-semibold">+{extra}</div>
      )}
    </div>
  );
}
