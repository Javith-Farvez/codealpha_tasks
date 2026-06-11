import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Activity, ColumnId, Comment, Member, Notification, Priority, Project, Task } from "./types";
import { supabase } from "@/integrations/supabase/client";

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

// ────────────────────────────────────────────────────────────────────────────
// DB <-> domain row mappers
// ────────────────────────────────────────────────────────────────────────────
const toMember = (r: any): Member => ({
  id: r.id, name: r.name, email: r.email, role: r.role,
  avatarColor: r.avatar_color, online: r.online ?? false,
});
const fromMember = (m: Member) => ({
  id: m.id, name: m.name, email: m.email, role: m.role,
  avatar_color: m.avatarColor, online: m.online ?? false,
});

const toProject = (r: any): Project => ({
  id: r.id, name: r.name, description: r.description ?? "", color: r.color,
  memberIds: Array.isArray(r.member_ids) ? r.member_ids : [],
  createdAt: r.created_at, dueDate: r.due_date ?? undefined, status: r.status,
});
const fromProject = (p: Project) => ({
  id: p.id, name: p.name, description: p.description, color: p.color,
  member_ids: p.memberIds, due_date: p.dueDate ?? null, status: p.status,
});

const toTask = (r: any): Task => ({
  id: r.id, projectId: r.project_id, title: r.title, description: r.description ?? "",
  column: r.column, priority: r.priority, dueDate: r.due_date ?? undefined,
  assigneeIds: Array.isArray(r.assignee_ids) ? r.assignee_ids : [],
  labels: Array.isArray(r.labels) ? r.labels : [],
  checklist: Array.isArray(r.checklist) ? r.checklist : [],
  createdAt: r.created_at, order: r.order ?? 0,
});
const fromTask = (t: Task) => ({
  id: t.id, project_id: t.projectId, title: t.title, description: t.description ?? "",
  column: t.column, priority: t.priority, due_date: t.dueDate ?? null,
  assignee_ids: t.assigneeIds, labels: t.labels, checklist: t.checklist as any,
  order: t.order,
});

const toComment = (r: any): Comment => ({
  id: r.id, taskId: r.task_id, authorId: r.author_id, text: r.text, createdAt: r.created_at,
});

// Local-only seed for ephemeral UI surfaces (activity/notifications)
const seedActivity: Activity[] = [];
const seedNotifications: Notification[] = [
  { id: uid(), title: "Welcome to TaskForge Pro", body: "Your live database is connected. Try editing any project!", read: false, createdAt: now(), type: "update" },
];

interface State {
  hydrated: boolean;
  currentUserId: string;
  isAuthenticated: boolean;
  members: Member[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  activity: Activity[];
  notifications: Notification[];
  theme: "dark" | "light";

  hydrate: () => Promise<void>;
  setTheme: (t: "dark" | "light") => void;

  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<Member>) => void;

  addProject: (p: Omit<Project, "id" | "createdAt" | "status"> & { status?: Project["status"] }) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTask: (t: Omit<Task, "id" | "createdAt" | "order" | "checklist">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, column: ColumnId, order: number) => void;
  deleteTask: (id: string) => void;

  addComment: (taskId: string, text: string) => void;

  addMember: (m: Omit<Member, "id">) => void;
  removeMember: (id: string) => void;

  markAllRead: () => void;
}

const logErr = (label: string) => (res: any) => {
  if (res?.error) console.error(`[supabase:${label}]`, res.error);
  return res;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      currentUserId: "u1",
      isAuthenticated: false,
      members: [],
      projects: [],
      tasks: [],
      comments: [],
      activity: seedActivity,
      notifications: seedNotifications,
      theme: "dark",

      hydrate: async () => {
        if (get().hydrated) return;
        try {
          const [m, p, t, c] = await Promise.all([
            supabase.from("members").select("*").order("created_at", { ascending: true }),
            supabase.from("projects").select("*").order("created_at", { ascending: false }),
            supabase.from("tasks").select("*").order("order", { ascending: true }),
            supabase.from("task_comments").select("*").order("created_at", { ascending: true }),
          ]);
          set({
            members: (m.data ?? []).map(toMember),
            projects: (p.data ?? []).map(toProject),
            tasks: (t.data ?? []).map(toTask),
            comments: (c.data ?? []).map(toComment),
            hydrated: true,
          });
        } catch (e) {
          console.error("[store] hydrate failed", e);
          set({ hydrated: true });
        }
      },

      setTheme: (t) => set({ theme: t }),

      login: (email, password) => {
        const m = get().members.find((x) => x.email.toLowerCase() === email.toLowerCase().trim());
        if (!m) return { ok: false, error: "No account found with that email." };
        if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters." };
        set({ isAuthenticated: true, currentUserId: m.id });
        return { ok: true };
      },
      logout: () => set({ isAuthenticated: false }),
      updateProfile: (patch) => {
        const id = get().currentUserId;
        const next = get().members.map((m) => (m.id === id ? { ...m, ...patch } : m));
        set({ members: next });
        const updated = next.find((m) => m.id === id);
        if (updated) supabase.from("members").update(fromMember(updated)).eq("id", id).then(logErr("updateProfile"));
      },

      addProject: (p) => {
        const project: Project = { ...p, id: uid(), createdAt: now(), status: p.status ?? "active" };
        set({ projects: [project, ...get().projects] });
        set({
          activity: [
            { id: uid(), type: "project_created", text: `created project "${project.name}"`, userId: get().currentUserId, projectId: project.id, createdAt: now() },
            ...get().activity,
          ].slice(0, 50),
        });
        supabase.from("projects").insert(fromProject(project)).then(logErr("addProject"));
      },
      updateProject: (id, patch) => {
        const next = get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
        set({ projects: next });
        const updated = next.find((p) => p.id === id);
        if (updated) supabase.from("projects").update(fromProject(updated)).eq("id", id).then(logErr("updateProject"));
      },
      deleteProject: (id) => {
        set({
          projects: get().projects.filter((p) => p.id !== id),
          tasks: get().tasks.filter((t) => t.projectId !== id),
        });
        supabase.from("projects").delete().eq("id", id).then(logErr("deleteProject"));
      },

      addTask: (t) => {
        const sameCol = get().tasks.filter((x) => x.projectId === t.projectId && x.column === t.column);
        const task: Task = { ...t, id: uid(), createdAt: now(), checklist: [], order: sameCol.length };
        set({ tasks: [task, ...get().tasks] });
        set({
          activity: [
            { id: uid(), type: "task_created", text: `created "${task.title}"`, userId: get().currentUserId, projectId: task.projectId, taskId: task.id, createdAt: now() },
            ...get().activity,
          ].slice(0, 50),
        });
        supabase.from("tasks").insert(fromTask(task)).then(logErr("addTask"));
      },
      updateTask: (id, patch) => {
        const next = get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
        set({ tasks: next });
        const updated = next.find((t) => t.id === id);
        if (updated) supabase.from("tasks").update(fromTask(updated)).eq("id", id).then(logErr("updateTask"));
      },
      moveTask: (id, column, order) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, column, order } : t)) });
        if (task.column !== column) {
          set({
            activity: [
              { id: uid(), type: "task_moved", text: `moved "${task.title}" to ${column.replace("_", " ")}`, userId: get().currentUserId, projectId: task.projectId, taskId: id, createdAt: now() },
              ...get().activity,
            ].slice(0, 50),
          });
        }
        supabase.from("tasks").update({ column, order }).eq("id", id).then(logErr("moveTask"));
      },
      deleteTask: (id) => {
        set({
          tasks: get().tasks.filter((t) => t.id !== id),
          comments: get().comments.filter((c) => c.taskId !== id),
        });
        supabase.from("tasks").delete().eq("id", id).then(logErr("deleteTask"));
      },

      addComment: (taskId, text) => {
        const c: Comment = { id: uid(), taskId, authorId: get().currentUserId, text, createdAt: now() };
        set({ comments: [...get().comments, c] });
        set({
          activity: [
            { id: uid(), type: "comment", text: `commented on a task`, userId: get().currentUserId, taskId, createdAt: now() },
            ...get().activity,
          ].slice(0, 50),
        });
        supabase.from("task_comments").insert({
          id: c.id, task_id: c.taskId, author_id: c.authorId, text: c.text,
        }).then(logErr("addComment"));
      },

      addMember: (m) => {
        const member: Member = { ...m, id: uid() };
        set({ members: [...get().members, member] });
        supabase.from("members").insert(fromMember(member)).then(logErr("addMember"));
      },
      removeMember: (id) => {
        set({ members: get().members.filter((m) => m.id !== id) });
        supabase.from("members").delete().eq("id", id).then(logErr("removeMember"));
      },

      markAllRead: () => set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
    }),
    {
      name: "taskforge-pro-v2",
      // Persist only UI/session state — never cached DB collections.
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as any))),
      partialize: (s) => ({
        currentUserId: s.currentUserId,
        isAuthenticated: s.isAuthenticated,
        theme: s.theme,
      }) as any,
    }
  )
);

export const initials = (name: string) =>
  name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
