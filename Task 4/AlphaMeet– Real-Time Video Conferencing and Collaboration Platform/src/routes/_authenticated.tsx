import { createFileRoute, Outlet, useNavigate, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Video, LayoutDashboard, CalendarPlus, LogOut, MessageSquare, FolderOpen, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.invalidate();
    navigate({ to: "/" });
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/schedule", label: "Schedule", icon: CalendarPlus },
    { to: "/chat", label: "Chat", icon: MessageSquare },
    { to: "/files", label: "Files", icon: FolderOpen },
    { to: "/team", label: "Team", icon: Users },
  ] as const;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 sticky top-0 z-10 glass">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-8 rounded-lg gradient-primary grid place-items-center">
              <Video className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Alpha Meet</span>
          </Link>
          <nav className="flex items-center gap-1 flex-wrap">
            {navItems.map((n) => (
              <Link key={n.to} to={n.to}>
                <Button variant="ghost" size="sm"><n.icon className="size-4 mr-1.5" />{n.label}</Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4 mr-1.5" />Sign out
            </Button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
