import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, Users, Briefcase, LogIn, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TaskForge Pro" }] }),
  component: LoginPage,
});

const QUICK = [
  { email: "aarav@taskforge.io", role: "Admin", icon: ShieldCheck, color: "indigo" },
  { email: "priya@taskforge.io", role: "Project Manager", icon: Briefcase, color: "fuchsia" },
  { email: "rohan@taskforge.io", role: "Team Member", icon: Users, color: "sky" },
];

const colorMap: Record<string, { iconBg: string; iconText: string; hoverBorder: string; hoverBg: string }> = {
  indigo: { iconBg: "bg-indigo-500/10", iconText: "text-indigo-400", hoverBorder: "hover:border-indigo-500/30", hoverBg: "hover:bg-indigo-500/5" },
  fuchsia: { iconBg: "bg-fuchsia-500/10", iconText: "text-fuchsia-400", hoverBorder: "hover:border-fuchsia-500/30", hoverBg: "hover:bg-fuchsia-500/5" },
  sky: { iconBg: "bg-sky-500/10", iconText: "text-sky-400", hoverBorder: "hover:border-sky-500/30", hoverBg: "hover:bg-sky-500/5" },
};

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useStore();
  const [email, setEmail] = useState("aarav@taskforge.io");
  const [password, setPassword] = useState("demo1234");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const r = login(email, password);
    if (!r.ok) { setErr(r.error || "Login failed"); return; }
    toast.success("Welcome back!");
    navigate({ to: "/" });
  };

  const quick = (em: string) => {
    setEmail(em); setPassword("demo1234");
    const r = login(em, "demo1234");
    if (r.ok) { toast.success(`Signed in as ${em}`); navigate({ to: "/" }); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 selection:bg-indigo-500/30 overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-fuchsia-600/10 blur-[120px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <main className="relative w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Branding & Value Prop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 grid place-items-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">TaskForge</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase leading-none">Pro Edition</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Plan. Track. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-400">Collaborate.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Premium project management for modern teams — kanban boards, analytics, calendar, and real-time collaboration.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Badge className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800/50">Kanban</Badge>
            <Badge className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800/50">Analytics</Badge>
            <Badge className="bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800/50">Real-time</Badge>
          </div>

          <div className="pt-12 text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} TaskForge Pro
          </div>
        </motion.div>

        {/* Right: Sign-in Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/40">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">Sign in</h2>
              <p className="text-slate-400 text-sm mt-1">Welcome back — pick a role to explore the demo.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErr(null); }}
                  placeholder="aarav@taskforge.io"
                  className="w-full bg-slate-800/50 border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/40 focus-visible:ring-2 focus-visible:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors uppercase tracking-tight">Forgot?</a>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErr(null); }}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/40 focus-visible:ring-2 focus-visible:border-indigo-500 transition-all"
                />
              </div>
              {err && <p className="text-xs text-rose-400">{err}</p>}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group border-0"
              >
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center">
                <span className="bg-[#111827] px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Quick Demo Access</span>
              </div>
            </div>

            <div className="space-y-3">
              {QUICK.map(q => {
                const Icon = q.icon;
                const c = colorMap[q.color];
                return (
                  <button
                    key={q.email}
                    onClick={() => quick(q.email)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 ${c.hoverBorder} ${c.hoverBg} transition-all group text-left`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${c.iconBg} grid place-items-center ${c.iconText}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{q.role}</p>
                        <p className="text-[11px] text-slate-500">{q.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">demo1234</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
