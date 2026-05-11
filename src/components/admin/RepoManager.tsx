"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createRepo, deleteRepo, getRepo, listRepos, updateRepo } from "@/services/repoService";
import type { RepoCreateInput, RepoDetail, RepoStatus, RepoSummary } from "@/types/repo";

const emptyForm: RepoCreateInput = {
  name: "",
  description: "",
  techStack: [],
  link: "",
  thumbnailUrl: "",
  status: "active",
};

function parseTechStack(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function RepoManager() {
  const { toast } = useToast();
  const [repos, setRepos] = useState<RepoSummary[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<RepoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<RepoCreateInput>(emptyForm);
  const [techRaw, setTechRaw] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refreshList = useCallback(async () => {
    setListLoading(true);
    try {
      const list = await listRepos();
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
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void getRepo(selectedId)
      .then((d) => {
        if (!cancelled) {
          setDetail(d);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast({
            variant: "destructive",
            title: "Không tải chi tiết repo",
            description: e instanceof Error ? e.message : "Lỗi không xác định",
          });
          setDetail(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId, toast]);

  const openCreate = () => {
    setDialogMode("create");
    setForm({ ...emptyForm, status: "active" });
    setTechRaw("");
    setDialogOpen(true);
  };

  const openEdit = () => {
    if (!detail) {
      return;
    }
    setDialogMode("edit");
    setForm({
      name: detail.name,
      description: detail.description,
      techStack: detail.techStack,
      link: detail.link,
      thumbnailUrl: detail.thumbnailUrl ?? "",
      status: detail.status,
    });
    setTechRaw(detail.techStack.join(", "));
    setDialogOpen(true);
  };

  const submitDialog = async () => {
    if (!form.name.trim()) {
      toast({ variant: "destructive", title: "Nhập tên repo" });
      return;
    }
    const payload: RepoCreateInput = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
      thumbnailUrl: form.thumbnailUrl?.trim() || undefined,
      techStack: parseTechStack(techRaw),
    };
    setSaving(true);
    try {
      if (dialogMode === "create") {
        const created = await createRepo(payload);
        toast({ title: "Đã thêm repo" });
        setDialogOpen(false);
        await refreshList();
        setSelectedId(created.id);
      } else if (detail) {
        await updateRepo(detail.id, payload);
        toast({ title: "Đã cập nhật repo" });
        setDialogOpen(false);
        await refreshList();
        void getRepo(detail.id).then(setDetail);
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

  const confirmDelete = async () => {
    if (!detail) {
      return;
    }
    setDeleting(true);
    try {
      await deleteRepo(detail.id);
      toast({ title: "Đã xóa repo" });
      setDeleteOpen(false);
      setSelectedId(null);
      setDetail(null);
      await refreshList();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Xóa thất bại",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý Repo</h1>
        <p className="text-sm text-muted-foreground">Danh sách bên trái, chi tiết và thao tác bên phải.</p>
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
                        <span className="font-medium leading-tight">{r.name}</span>
                        <Badge variant={r.status === "active" ? "default" : "secondary"} className="w-fit text-[10px]">
                          {r.status === "active" ? "active" : "hidden"}
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
                {selectedId && detailLoading && "Đang tải…"}
                {selectedId && !detailLoading && !detail && "Không có dữ liệu."}
              </CardDescription>
            </div>
            {detail && !detailLoading && (
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" className="gap-1" onClick={openEdit}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button type="button" size="sm" variant="destructive" className="gap-1" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {detail && !detailLoading && (
              <>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Tên</p>
                  <p className="text-base font-semibold">{detail.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Mô tả</p>
                  <p className="leading-relaxed text-muted-foreground">{detail.description || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Tech stack</p>
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
                  <p className="text-xs font-medium uppercase text-muted-foreground">Link</p>
                  {detail.link ? (
                    <a href={detail.link} className="text-primary underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
                      {detail.link}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Thumbnail</p>
                  {detail.thumbnailUrl ? (
                    <a
                      href={detail.thumbnailUrl}
                      className="break-all text-primary underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {detail.thumbnailUrl}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Trạng thái</p>
                  <Badge variant={detail.status === "active" ? "default" : "secondary"}>{detail.status}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Thêm repo mới" : "Chỉnh sửa repo"}</DialogTitle>
            <DialogDescription>Điền thông tin và lưu. Tech stack: phân tách bằng dấu phẩy.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="repo-name">Tên</Label>
              <Input id="repo-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-desc">Mô tả</Label>
              <Textarea
                id="repo-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-tech">Tech stack</Label>
              <Input
                id="repo-tech"
                value={techRaw}
                onChange={(e) => setTechRaw(e.target.value)}
                placeholder="Next.js, TypeScript, PostgreSQL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-link">Link</Label>
              <Input id="repo-link" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo-thumb">Thumbnail URL</Label>
              <Input
                id="repo-thumb"
                value={form.thumbnailUrl ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as RepoStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="hidden">hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa repo?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác{detail ? ` (“${detail.name}”).` : "."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? "Đang xóa…" : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
