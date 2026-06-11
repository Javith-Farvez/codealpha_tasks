import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { useStore } from "@/lib/store";
import { COLUMNS, type ColumnId, type Priority, type Task } from "@/lib/types";
import { AvatarStack } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, MessageSquare, CalendarDays, Tag, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { PriorityBadge } from "./index";
import { toast } from "sonner";

export const Route = createFileRoute("/board")({
  head: () => ({ meta: [{ title: "Kanban — TaskForge Pro" }] }),
  component: Board,
});

function Board() {
  const { projects, tasks, moveTask, addTask, deleteTask, comments, addComment, members } = useStore();
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [newTaskCol, setNewTaskCol] = useState<ColumnId | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const projectTasks = useMemo(() => tasks.filter(t => t.projectId === projectId), [tasks, projectId]);
  const project = projects.find(p => p.id === projectId);
  const activeTask = activeId ? projectTasks.find(t => t.id === activeId) : null;

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const taskId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId) return;
    const col = COLUMNS.find(c => c.id === overId);
    if (!col) return;
    const colTasks = projectTasks.filter(t => t.column === col.id);
    moveTask(taskId, col.id, colTasks.length);
  };

  const handleAdd = () => {
    if (!newTitle.trim() || !newTaskCol) return;
    addTask({
      projectId, title: newTitle, description: "", column: newTaskCol,
      priority: newPriority, assigneeIds: project ? project.memberIds.slice(0, 2) : [],
      labels: [], dueDate: undefined,
    });
    setNewTitle(""); setNewTaskCol(null);
    toast.success("Task added");
  };

  const taskComments = openTask ? comments.filter(c => c.taskId === openTask.id) : [];

  return (
    <div className="space-y-4 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground text-sm">{project?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-[220px] bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {project && <AvatarStack ids={project.memberIds} />}
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 -mx-4 px-4">
          {COLUMNS.map(col => {
            const colTasks = projectTasks.filter(t => t.column === col.id).sort((a, b) => a.order - b.order);
            return (
              <Column key={col.id} col={col} count={colTasks.length} onAdd={() => setNewTaskCol(col.id)}>
                {colTasks.map(t => (
                  <TaskCard key={t.id} task={t} onClick={() => setOpenTask(t)} />
                ))}
              </Column>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && <div className="rotate-3 scale-105"><TaskCardInner task={activeTask} /></div>}
        </DragOverlay>
      </DndContext>

      {/* Add task dialog */}
      <Dialog open={!!newTaskCol} onOpenChange={(o) => !o && setNewTaskCol(null)}>
        <DialogContent className="glass">
          <DialogHeader><DialogTitle>Add task to {COLUMNS.find(c => c.id === newTaskCol)?.title}</DialogTitle></DialogHeader>
          <Input placeholder="What needs to be done?" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
          <Select value={newPriority} onValueChange={(v) => setNewPriority(v as Priority)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter><Button onClick={handleAdd} className="bg-gradient-brand border-0">Add Task</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task detail */}
      <Dialog open={!!openTask} onOpenChange={(o) => !o && setOpenTask(null)}>
        <DialogContent className="glass max-w-2xl">
          {openTask && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <PriorityBadge p={openTask.priority} />
                  {openTask.labels.map(l => <Badge key={l} variant="outline" className="text-[10px]"><Tag className="h-2.5 w-2.5 mr-1" />{l}</Badge>)}
                </div>
                <DialogTitle className="text-2xl mt-2">{openTask.title}</DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Assignees</div>
                  <AvatarStack ids={openTask.assigneeIds} max={6} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Due</div>
                  <div className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{openTask.dueDate ? format(parseISO(openTask.dueDate), "MMM d, yyyy") : "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div className="capitalize">{openTask.column.replace("_", " ")}</div>
                </div>
              </div>
              {openTask.description && <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3">{openTask.description}</p>}
              <div>
                <div className="font-semibold text-sm mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Comments ({taskComments.length})</div>
                <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
                  {taskComments.map(c => {
                    const u = members.find(m => m.id === c.authorId);
                    return (
                      <div key={c.id} className="flex gap-2 text-sm">
                        <div className={`h-7 w-7 shrink-0 rounded-full bg-gradient-to-br ${u?.avatarColor} grid place-items-center text-[10px] font-bold text-white`}>{u?.name.split(" ").map(s=>s[0]).join("")}</div>
                        <div className="flex-1 glass rounded-lg p-2">
                          <div className="text-xs font-medium">{u?.name}</div>
                          <div className="text-sm">{c.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <CommentInput onSend={(text) => addComment(openTask.id, text)} />
              </div>
              <DialogFooter>
                <Button variant="ghost" className="text-rose-400" onClick={() => { deleteTask(openTask.id); setOpenTask(null); toast("Task deleted"); }}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CommentInput({ onSend }: { onSend: (t: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2 mt-3">
      <Textarea value={v} onChange={e => setV(e.target.value)} placeholder="Write a comment… use @ to mention" className="min-h-[60px]" />
      <Button onClick={() => { if (v.trim()) { onSend(v); setV(""); } }} className="bg-gradient-brand border-0 self-end">Send</Button>
    </div>
  );
}

function Column({ col, count, children, onAdd }: { col: typeof COLUMNS[number]; count: number; children: React.ReactNode; onAdd: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  return (
    <div ref={setNodeRef}
      className={`w-[300px] shrink-0 glass rounded-2xl p-3 flex flex-col gap-3 transition-all ${isOver ? "ring-2 ring-primary shadow-glow" : ""}`}>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${col.accent}`} />
          <div className="font-semibold text-sm">{col.title}</div>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-white/5">{count}</Badge>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onAdd}><Plus className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="flex-1 space-y-2 min-h-[100px]">
        <AnimatePresence>{children}</AnimatePresence>
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <motion.div layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
      ref={setNodeRef} {...attributes} {...listeners} onClick={onClick}>
      <TaskCardInner task={task} />
    </motion.div>
  );
}

function TaskCardInner({ task }: { task: Task }) {
  const { comments, projects } = useStore();
  const cmts = comments.filter(c => c.taskId === task.id).length;
  const project = projects.find(p => p.id === task.projectId);
  return (
    <Card className="glass border-border/50 p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all">
      <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${project?.color} mb-2`} />
      <div className="font-medium text-sm leading-snug">{task.title}</div>
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <PriorityBadge p={task.priority} />
        {task.labels.slice(0,2).map(l => <Badge key={l} variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-white/10">{l}</Badge>)}
      </div>
      <div className="flex items-center justify-between mt-3">
        <AvatarStack ids={task.assigneeIds} max={3} />
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {cmts > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{cmts}</span>}
          {task.dueDate && <span className="flex items-center gap-0.5"><CalendarDays className="h-3 w-3" />{format(parseISO(task.dueDate), "MMM d")}</span>}
        </div>
      </div>
    </Card>
  );
}
