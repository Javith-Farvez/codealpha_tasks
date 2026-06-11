// Default seed data for chat, files, team. Persisted to localStorage so user CRUD works.

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "away" | "offline";
  email: string;
};

export type ChatMessage = {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  body: string;
  createdAt: string;
};

export type Channel = {
  id: string;
  name: string;
  kind: "channel" | "dm";
  unread?: number;
};

export type FileItem = {
  id: string;
  name: string;
  size: string;
  folder: string;
  owner: string;
  ownerAvatar: string;
  updatedAt: string;
  kind: "pdf" | "video" | "design" | "doc" | "image" | "other";
  starred?: boolean;
};

export const TEAM: TeamMember[] = [
  { id: "u-sarah", name: "Sarah Johnson", role: "Product Designer", avatar: "👩‍💼", status: "online", email: "sarah@alpha.team" },
  { id: "u-michael", name: "Michael Chen", role: "Engineering Lead", avatar: "👨‍💻", status: "online", email: "michael@alpha.team" },
  { id: "u-emily", name: "Emily Davis", role: "Marketing Manager", avatar: "👩‍🎨", status: "away", email: "emily@alpha.team" },
  { id: "u-john", name: "John Smith", role: "CEO", avatar: "👨‍💼", status: "online", email: "john@alpha.team" },
  { id: "u-priya", name: "Priya Patel", role: "Data Scientist", avatar: "👩‍🔬", status: "offline", email: "priya@alpha.team" },
  { id: "u-david", name: "David Kim", role: "Frontend Engineer", avatar: "🧑‍💻", status: "online", email: "david@alpha.team" },
  { id: "u-lisa", name: "Lisa Wong", role: "Customer Success", avatar: "👩‍💻", status: "away", email: "lisa@alpha.team" },
  { id: "u-omar", name: "Omar Ali", role: "Backend Engineer", avatar: "👨‍🔧", status: "online", email: "omar@alpha.team" },
];

export const CHANNELS: Channel[] = [
  { id: "c-general", name: "general", kind: "channel", unread: 3 },
  { id: "c-engineering", name: "engineering", kind: "channel" },
  { id: "c-design", name: "design", kind: "channel", unread: 5 },
  { id: "c-marketing", name: "marketing", kind: "channel" },
  { id: "c-product", name: "product", kind: "channel", unread: 2 },
  { id: "dm-sarah", name: "Sarah Johnson", kind: "dm", unread: 2 },
  { id: "dm-michael", name: "Michael Chen", kind: "dm" },
  { id: "dm-emily", name: "Emily Davis", kind: "dm", unread: 1 },
  { id: "dm-john", name: "John Smith", kind: "dm" },
];

const t = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();

export const SEED_MESSAGES: ChatMessage[] = [
  { id: "m1", channelId: "c-general", authorId: "u-sarah", authorName: "Sarah Johnson", authorAvatar: "👩‍💼", body: "Hey team! Just finished the new design mockups for the dashboard. 🎨", createdAt: t(45) },
  { id: "m2", channelId: "c-general", authorId: "u-michael", authorName: "Michael Chen", authorAvatar: "👨‍💻", body: "Looks great! Can you share the Figma link?", createdAt: t(43) },
  { id: "m3", channelId: "c-general", authorId: "u-sarah", authorName: "Sarah Johnson", authorAvatar: "👩‍💼", body: "Sure! Here it is: https://figma.com/dashboard-mockups", createdAt: t(42) },
  { id: "m4", channelId: "c-general", authorId: "u-john", authorName: "John Smith", authorAvatar: "👨‍💼", body: "This is looking fantastic! Love the color scheme. 🔥", createdAt: t(40) },
  { id: "m5", channelId: "c-general", authorId: "u-emily", authorName: "Emily Davis", authorAvatar: "👩‍🎨", body: "Marketing assets will be ready by EOD!", createdAt: t(20) },
  { id: "m6", channelId: "c-engineering", authorId: "u-michael", authorName: "Michael Chen", authorAvatar: "👨‍💻", body: "Deploy is green ✅ — v2.4.1 is live in prod.", createdAt: t(90) },
  { id: "m7", channelId: "c-engineering", authorId: "u-omar", authorName: "Omar Ali", authorAvatar: "👨‍🔧", body: "Nice. Migrating the meetings table tonight after standup.", createdAt: t(85) },
  { id: "m8", channelId: "c-engineering", authorId: "u-david", authorName: "David Kim", authorAvatar: "🧑‍💻", body: "I'll pair on it. Pinging you at 8.", createdAt: t(80) },
  { id: "m9", channelId: "c-design", authorId: "u-sarah", authorName: "Sarah Johnson", authorAvatar: "👩‍💼", body: "Updated the component library — new Button variants are in.", createdAt: t(120) },
  { id: "m10", channelId: "c-design", authorId: "u-emily", authorName: "Emily Davis", authorAvatar: "👩‍🎨", body: "The hover state is chef's kiss 👌", createdAt: t(115) },
  { id: "m11", channelId: "c-marketing", authorId: "u-emily", authorName: "Emily Davis", authorAvatar: "👩‍🎨", body: "Launch post draft is in Notion — please review by Friday.", createdAt: t(200) },
  { id: "m12", channelId: "c-product", authorId: "u-john", authorName: "John Smith", authorAvatar: "👨‍💼", body: "Roadmap reviewed. Shipping the realtime layer next sprint.", createdAt: t(300) },
  { id: "m13", channelId: "dm-sarah", authorId: "u-sarah", authorName: "Sarah Johnson", authorAvatar: "👩‍💼", body: "Hey! Got a sec to look at the new onboarding flow?", createdAt: t(15) },
  { id: "m14", channelId: "dm-sarah", authorId: "u-sarah", authorName: "Sarah Johnson", authorAvatar: "👩‍💼", body: "It's in the Figma file I shared earlier.", createdAt: t(14) },
  { id: "m15", channelId: "dm-michael", authorId: "u-michael", authorName: "Michael Chen", authorAvatar: "👨‍💻", body: "PR is up for review whenever you're ready 🙏", createdAt: t(60) },
  { id: "m16", channelId: "dm-emily", authorId: "u-emily", authorName: "Emily Davis", authorAvatar: "👩‍🎨", body: "Did you get the campaign brief?", createdAt: t(10) },
  { id: "m17", channelId: "dm-john", authorId: "u-john", authorName: "John Smith", authorAvatar: "👨‍💼", body: "Great work this week 🎉", createdAt: t(500) },
];

export const SEED_FILES: FileItem[] = [
  { id: "f1", name: "Q2 Roadmap.pdf", size: "2.4 MB", folder: "Product Development", owner: "Sarah Johnson", ownerAvatar: "👩‍💼", updatedAt: t(60), kind: "pdf", starred: true },
  { id: "f2", name: "Product Demo.mp4", size: "45.2 MB", folder: "Marketing Materials", owner: "Michael Chen", ownerAvatar: "👨‍💻", updatedAt: t(60 * 24), kind: "video" },
  { id: "f3", name: "Design Mockups.fig", size: "8.1 MB", folder: "Design Assets", owner: "Emily Davis", ownerAvatar: "👩‍🎨", updatedAt: t(60 * 24 * 3), kind: "design", starred: true },
  { id: "f4", name: "Meeting Notes.docx", size: "156 KB", folder: "Product Development", owner: "John Smith", ownerAvatar: "👨‍💼", updatedAt: t(60 * 24 * 4), kind: "doc" },
  { id: "f5", name: "Brand Guidelines.pdf", size: "3.8 MB", folder: "Design Assets", owner: "Sarah Johnson", ownerAvatar: "👩‍💼", updatedAt: t(60 * 24 * 7), kind: "pdf" },
  { id: "f6", name: "Hero Banner.png", size: "1.2 MB", folder: "Marketing Materials", owner: "Emily Davis", ownerAvatar: "👩‍🎨", updatedAt: t(60 * 12), kind: "image" },
  { id: "f7", name: "Customer Pitch.pptx", size: "12 MB", folder: "Customer Presentations", owner: "John Smith", ownerAvatar: "👨‍💼", updatedAt: t(60 * 24 * 2), kind: "doc", starred: true },
  { id: "f8", name: "API Spec.pdf", size: "920 KB", folder: "Product Development", owner: "Michael Chen", ownerAvatar: "👨‍💻", updatedAt: t(60 * 5), kind: "pdf" },
];

export const FOLDERS = [
  { name: "Product Development", color: "from-violet-500/30 to-violet-500/10", icon: "📁" },
  { name: "Design Assets", color: "from-pink-500/30 to-pink-500/10", icon: "🎨" },
  { name: "Marketing Materials", color: "from-cyan-500/30 to-cyan-500/10", icon: "📣" },
  { name: "Customer Presentations", color: "from-emerald-500/30 to-emerald-500/10", icon: "📊" },
];

// localStorage helpers
export function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
export function saveLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}
