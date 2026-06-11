import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay,
  isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — TaskForge Pro" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { tasks, projects } = useStore();
  const [cursor, setCursor] = useState(new Date());

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const tasksForDay = (d: Date) =>
    tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), d));

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground text-sm">Deadlines & milestones across your workspace.</p>
        </div>
        <div className="flex items-center gap-2 glass rounded-xl px-2 py-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="font-semibold min-w-[140px] text-center">{format(cursor, "MMMM yyyy")}</div>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => setCursor(new Date())}>Today</Button>
        </div>
      </div>

      <Card className="glass border-border/50 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border/40">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((d, i) => {
            const inMonth = isSameMonth(d, cursor);
            const dayTasks = tasksForDay(d);
            const today = isSameDay(d, new Date());
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.005 }}
                className={`min-h-[110px] p-2 border-b border-r border-border/30 ${inMonth ? "" : "opacity-40"}`}>
                <div className={`text-xs font-semibold w-7 h-7 grid place-items-center rounded-full ${today ? "bg-gradient-brand text-white shadow-glow" : ""}`}>
                  {format(d, "d")}
                </div>
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 3).map(t => {
                    const p = projects.find(x => x.id === t.projectId);
                    return (
                      <div key={t.id} className={`text-[10px] truncate px-1.5 py-0.5 rounded bg-gradient-to-r ${p?.color} text-white font-medium`}>
                        {t.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
