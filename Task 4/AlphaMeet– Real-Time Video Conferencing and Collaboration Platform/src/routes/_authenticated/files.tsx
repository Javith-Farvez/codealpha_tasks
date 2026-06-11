import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Star, Filter, Grid3x3, List, FileText, Video, Image as ImageIcon, FolderOpen, Trash2 } from "lucide-react";
import { SEED_FILES, FOLDERS, loadLS, saveLS, type FileItem } from "@/lib/seed-data";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/files")({
  head: () => ({ meta: [{ title: "Files — Alpha Meet" }] }),
  component: FilesPage,
});

const ICONS = {
  pdf: { Icon: FileText, color: "text-red-400 bg-red-500/10" },
  video: { Icon: Video, color: "text-violet-400 bg-violet-500/10" },
  design: { Icon: FileText, color: "text-pink-400 bg-pink-500/10" },
  doc: { Icon: FileText, color: "text-blue-400 bg-blue-500/10" },
  image: { Icon: ImageIcon, color: "text-emerald-400 bg-emerald-500/10" },
  other: { Icon: FileText, color: "text-muted-foreground bg-secondary" },
};

function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(() => loadLS("am.files", SEED_FILES));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [folder, setFolder] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const persist = (next: FileItem[]) => { setFiles(next); saveLS("am.files", next); };

  const upload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = () => {
      const list = Array.from(input.files ?? []);
      if (!list.length) return;
      const added: FileItem[] = list.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: (f.size / 1024 / 1024 < 1 ? `${Math.round(f.size / 1024)} KB` : `${(f.size / 1024 / 1024).toFixed(1)} MB`),
        folder: folder ?? "Product Development",
        owner: "You",
        ownerAvatar: "🧑",
        updatedAt: new Date().toISOString(),
        kind: detect(f.name),
      }));
      persist([...added, ...files]);
      toast.success(`${added.length} file(s) uploaded`);
    };
    input.click();
  };

  const toggleStar = (id: string) => persist(files.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)));
  const remove = (id: string) => persist(files.filter((f) => f.id !== id));

  const filtered = files.filter(
    (f) => (!folder || f.folder === folder) && f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">File Sharing</h1>
          <p className="text-muted-foreground mt-1">Access and share files with your team</p>
        </div>
        <Button onClick={upload} className="gradient-primary text-primary-foreground">
          <Upload className="size-4 mr-2" />Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FOLDERS.map((f) => {
          const count = files.filter((x) => x.folder === f.name).length;
          const active = folder === f.name;
          return (
            <button
              key={f.name}
              onClick={() => setFolder(active ? null : f.name)}
              className={`text-left rounded-2xl p-5 transition border ${
                active ? "border-primary" : "border-border/40"
              } bg-gradient-to-br ${f.color} hover:scale-[1.02]`}
            >
              <div className="size-12 rounded-xl bg-background/30 grid place-items-center text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{count} items</p>
            </button>
          );
        })}
      </div>

      <Card className="glass p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{folder ?? "Recent Files"}</h2>
            <div className="flex items-center gap-1 bg-secondary/60 rounded-lg px-2 py-1">
              <Filter className="size-3.5" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter…" className="h-7 border-0 bg-transparent w-40 px-1" />
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")} className={view === "grid" ? "gradient-primary text-primary-foreground" : ""}>
              <Grid3x3 className="size-4" />
            </Button>
            <Button size="icon" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className={view === "list" ? "gradient-primary text-primary-foreground" : ""}>
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No files here yet.</p>}

        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((f) => {
              const { Icon, color } = ICONS[f.kind];
              return (
                <div key={f.id} className="bg-secondary/40 hover:bg-secondary/70 transition rounded-xl p-4 group">
                  <div className="flex items-start justify-between">
                    <div className={`size-12 rounded-xl grid place-items-center ${color}`}><Icon className="size-6" /></div>
                    <button onClick={() => toggleStar(f.id)}>
                      <Star className={`size-4 ${f.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <h4 className="font-medium mt-3 truncate">{f.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.size} · {formatDistanceToNow(new Date(f.updatedAt), { addSuffix: true })}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <span className="text-sm flex items-center gap-1.5"><span>{f.ownerAvatar}</span>{f.owner}</span>
                    <button onClick={() => remove(f.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filtered.map((f) => {
              const { Icon, color } = ICONS[f.kind];
              return (
                <div key={f.id} className="flex items-center gap-4 py-3">
                  <div className={`size-10 rounded-lg grid place-items-center ${color}`}><Icon className="size-5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.folder} · {f.size}</p>
                  </div>
                  <span className="text-sm text-muted-foreground hidden md:block">{f.ownerAvatar} {f.owner}</span>
                  <span className="text-xs text-muted-foreground hidden md:block w-32 text-right">{formatDistanceToNow(new Date(f.updatedAt), { addSuffix: true })}</span>
                  <button onClick={() => toggleStar(f.id)}>
                    <Star className={`size-4 ${f.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  </button>
                  <button onClick={() => remove(f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function detect(name: string): FileItem["kind"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["fig", "sketch", "xd"].includes(ext)) return "design";
  if (["doc", "docx", "ppt", "pptx", "txt", "md"].includes(ext)) return "doc";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  return "other";
}
