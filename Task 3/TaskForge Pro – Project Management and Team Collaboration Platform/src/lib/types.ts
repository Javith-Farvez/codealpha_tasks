export type Role = "Admin" | "Project Manager" | "Team Member";
export type Priority = "low" | "medium" | "high" | "urgent";
export type ColumnId = "backlog" | "todo" | "in_progress" | "review" | "testing" | "completed";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  online?: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface ChecklistItem { id: string; text: string; done: boolean; }

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  column: ColumnId;
  priority: Priority;
  dueDate?: string;
  assigneeIds: string[];
  labels: string[];
  checklist: ChecklistItem[];
  createdAt: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
  createdAt: string;
  dueDate?: string;
  status: "active" | "on_hold" | "completed" | "archived";
}

export interface Activity {
  id: string;
  type: string;
  text: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "assigned" | "comment" | "deadline" | "mention" | "invite" | "update";
}

export const COLUMNS: { id: ColumnId; title: string; accent: string }[] = [
  { id: "backlog", title: "Backlog", accent: "from-slate-500 to-slate-700" },
  { id: "todo", title: "To Do", accent: "from-indigo-500 to-violet-600" },
  { id: "in_progress", title: "In Progress", accent: "from-cyan-500 to-blue-600" },
  { id: "review", title: "Review", accent: "from-amber-500 to-orange-600" },
  { id: "testing", title: "Testing", accent: "from-pink-500 to-rose-600" },
  { id: "completed", title: "Completed", accent: "from-emerald-500 to-teal-600" },
];
