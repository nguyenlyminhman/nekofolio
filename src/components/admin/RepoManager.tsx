"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createRepoCms, fetchReposCms, updateRepoCms } from "@/services/repoService";
import type { RepoCmsFormValues, RepoCmsRecord } from "@/types/repo";

const emptyForm: RepoCmsFormValues = {
  repoName: "",
  highlights: "",
  description: "",
  markdown: "",
  githubUrl: "",
  liveUrl: "",
  techStack: [],
  sortOrder: 0,
  isActive: true,
};

function parseTechStack(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function recordToForm(r: RepoCmsRecord): RepoCmsFormValues {
  return {
    repoName: r.repoName,
    highlights: r.highlights,
    description: r.description,
    markdown: r.markdown,
    githubUrl: r.githubUrl,
    liveUrl: r.liveUrl,
    techStack: [...r.techStack],
    sortOrder: r.sortOrder,
    isActive: r.is_active,
  };
}

export function RepoManager() {
  const { toast } = useToast();
  const [repos, setRepos] = useState<RepoCmsRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  /** Cố định id khi mở dialog sửa — không phụ thuộc `detail` lúc bấm Lưu. */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RepoCmsFormValues>(emptyForm);
  const [techRaw, setTechRaw] = useState("");
  const [saving, setSaving] = useState(false);

  const detail = useMemo(
    () => (selectedId ? repos.find((r) => r.id === selectedId) ?? null : null),
    [repos, selectedId],
  );

  const refreshList = useCallback(async () => {
    setListLoading(true);
    try {
      const list = await fetchReposCms();
      setRepos(list);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Không tải được danh sách repo",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void refreshList();
  }, [refreshList]);

  useEffect(() => {
    if (selectedId && !repos.some((r) => r.id === selectedId)) {
      setSelectedId(null);
    }
  }, [repos, selectedId]);

  const openCreate = () => {
    setDialogMode("create");
    setEditingId(null);
    setForm({ ...emptyForm });
    setTechRaw("");
    setDialogOpen(true);
  };

  const openEdit = () => {
    if (!detail) {
      return;
    }
    setDialogMode("edit");
    setEditingId(detail.id);
    setForm(recordToForm(detail));
    setTechRaw(detail.techStack.join(", "));
    setDialogOpen(true);
  };

  const submitDialog = async () => {
    if (!form.repoName.trim()) {
      toast({ variant: "destructive", title: "Nhập repoName" });
      return;
    }
    const payload: RepoCmsFormValues = {
      ...form,
      repoName: form.repoName.trim(),
      highlights: form.highlights.trim(),
      description: form.description.trim(),
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      techStack: parseTechStack(techRaw),
      sortOrder: Number.isFinite(form.sortOrder) ? form.sortOrder : 0,
      isActive: dialogMode === "edit" ? form.isActive : true,
    };
    setSaving(true);
    try {
      if (dialogMode === "create") {
        const created = await createRepoCms(payload);
        toast({ title: "Đã tạo repo" });
        setEditingId(null);
        setDialogOpen(false);
        await refreshList();
        setSelectedId(created.id);
      } else if (dialogMode === "edit") {
        if (!editingId) {
          toast({ variant: "destructive", title: "Thiếu id repo để cập nhật" });
          return;
        }
        await updateRepoCms({ ...payload, id: editingId });
        toast({ title: "Đã cập nhật repo" });
        setEditingId(null);
        setDialogOpen(false);
        await refreshList();
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Lưu thất bại",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Repo</h1>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 text-xs">GET /cms/repo/fetch</code> — tạo:{" "}
            <code className="rounded bg-muted px-1 text-xs">POST /cms/repo/create</code> — sửa:{" "}
            <code className="rounded bg-muted px-1 text-xs">POST /cms/repo/update</code>.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void refreshList()} disabled={listLoading}>
          {listLoading ? "Đang tải…" : "Tải lại"}
        </Button>
      </div>

      <div className="grid min-h-[480px] gap-4 lg:grid-cols-[minmax(0,280px)_1fr]">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Danh sách Repo</CardTitle>
              <CardDescription>{listLoading ? "Đang tải…" : `${repos.length} repo`}</CardDescription>
            </div>
            <Button type="button" size="sm" className="gap-1" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Thêm
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[420px] px-4 pb-4">
              <ul className="space-y-1 pr-3">
                {repos.map((r) => {
                  const active = selectedId === r.id;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className={`flex w-full flex-col gap-1 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60 ${
                          active ? "border-primary/50 bg-primary/10" : "border-transparent bg-muted/30"
                        }`}
                      >
                        <span className="font-medium leading-tight">{r.repoName || r.id}</span>
                        <Badge variant={r.is_active ? "default" : "secondary"} className="w-fit text-[10px]">
                          {r.is_active ? "active" : "inactive"}
                        </Badge>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">Chi tiết Repo</CardTitle>
              <CardDescription>
                {!selectedId && "Chọn một repo trong danh sách."}
                {selectedId && !detail && !listLoading && "Không tìm thấy trong danh sách."}
                {selectedId && detail && "Dữ liệu từ fetch (cùng mục đã chọn)."}
              </CardDescription>
            </div>
            {detail && (
              <Button type="button" size="sm" variant="secondary" className="gap-1" onClick={openEdit}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {detail && (
              <>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">repoName</p>
                  <p className="text-base font-semibold">{detail.repoName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">highlights</p>
                  <p className="leading-relaxed text-muted-foreground">{detail.highlights || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">description</p>
                  <p className="leading-relaxed text-muted-foreground">{detail.description || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">markdown</p>
                  <pre className="mt-1 max-h-40 overflow-auto rounded-md border bg-muted/40 p-2 text-xs">{detail.markdown || "—"}</pre>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">githubUrl</p>
                    {detail.githubUrl ? (
                      <a
                        href={detail.githubUrl}
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {detail.githubUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">liveUrl</p>
                    {detail.liveUrl ? (
                      <a
                        href={detail.liveUrl}
                        className="text-primary underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {detail.liveUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">techStack</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {detail.techStack?.length ? (
                      detail.techStack.map((t) => (
                        <Badge key={t} variant="outline" className="font-normal">
                          {t}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">sort_order</p>
                  <p>{detail.sortOrder}</p>
                </div>
                <div className="flex flex-wrap gap-2 border-t pt-3 text-xs text-muted-foreground">
                  <span>id: {detail.id}</span>
                  <span>·</span>
                  <span>created_at: {detail.created_at ?? "—"}</span>
                  <span>·</span>
                  <span>updated_at: {detail.updated_at ?? "—"}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">created_by</span> {detail.created_by ?? "—"} ·{" "}
                  <span className="font-medium text-foreground/80">updated_by</span> {detail.updated_by ?? "—"}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">is_active</p>
                  <Badge variant={detail.is_active ? "default" : "secondary"}>{detail.is_active ? "true" : "false"}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingId(null);
          }
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Thêm repo mới" : "Chỉnh sửa repo"}</DialogTitle>
            <DialogDescription>
              Tech stack nhập cách nhau bằng dấu phẩy. Thêm mới → <code className="rounded bg-muted px-1 text-xs">POST …/create</code>
              ; chỉnh sửa → <code className="rounded bg-muted px-1 text-xs">POST …/update</code> kèm <code className="text-xs">id</code>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="repo-repoName">repoName</Label>
              <Input
                id="repo-repoName"
                value={form.repoName}
                onChange={(e) => setForm((f) => ({ ...f, repoName: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="repo-highlights">highlights</Label>
              <Input
                id="repo-highlights"
                value={form.highlights}
                onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="repo-desc">description</Label>
              <Textarea
                id="repo-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="repo-md">markdown</Label>
              <Textarea
                id="repo-md"
                rows={8}
                className="font-mono text-xs"
                spellCheck={false}
                value={form.markdown}
                onChange={(e) => setForm((f) => ({ ...f, markdown: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-gh">githubUrl</Label>
              <Input id="repo-gh" value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-live">liveUrl</Label>
              <Input id="repo-live" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="repo-tech">techStack</Label>
              <Input
                id="repo-tech"
                value={techRaw}
                onChange={(e) => setTechRaw(e.target.value)}
                placeholder="Java, TypeScript, Next.js"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-sort">sortOrder</Label>
              <Input
                id="repo-sort"
                type="number"
                value={Number.isFinite(form.sortOrder) ? form.sortOrder : 0}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
              />
            </div>
            {dialogMode === "edit" && (
              <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-3 sm:col-span-2">
                <div className="space-y-0.5">
                  <Label htmlFor="repo-is-active" className="text-base">
                    isActive
                  </Label>
                  <p className="text-xs text-muted-foreground">Trạng thái hiển thị / kích hoạt repo (gửi field isActive trong body).</p>
                </div>
                <Switch
                  id="repo-is-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="button" onClick={() => void submitDialog()} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
