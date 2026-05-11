"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { createCV, getCV, listCVs, publishCV, updateCV } from "@/services/cvService";
import type { CVDetail, CVSummary } from "@/types/cv";

export function CVManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<CVSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [insertTitle, setInsertTitle] = useState("");
  const [insertUrl, setInsertUrl] = useState("");
  const [insertFile, setInsertFile] = useState<File | null>(null);
  const [inserting, setInserting] = useState(false);

  const [selectedId, setSelectedId] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const refreshList = useCallback(async () => {
    setLoadingList(true);
    try {
      const list = await listCVs();
      setItems(list);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Không tải được danh sách CV",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setLoadingList(false);
    }
  }, [toast]);

  useEffect(() => {
    void refreshList();
  }, [refreshList]);

  useEffect(() => {
    if (!selectedId) {
      setEditTitle("");
      setEditUrl("");
      setEditFile(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void getCV(selectedId)
      .then((d: CVDetail) => {
        if (cancelled) {
          return;
        }
        setEditTitle(d.title ?? "");
        setEditUrl(d.sourceUrl ?? "");
        setEditFile(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          toast({
            variant: "destructive",
            title: "Không tải chi tiết CV",
            description: e instanceof Error ? e.message : "Lỗi không xác định",
          });
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

  const handleInsert = async () => {
    if (!insertTitle.trim()) {
      toast({ variant: "destructive", title: "Nhập tiêu đề CV" });
      return;
    }
    if (!insertFile && !insertUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Chọn file (PDF/DOCX) hoặc nhập URL",
      });
      return;
    }
    setInserting(true);
    try {
      await createCV({
        title: insertTitle.trim(),
        file: insertFile,
        sourceUrl: insertUrl.trim() || undefined,
      });
      toast({ title: "Đã thêm CV" });
      setInsertTitle("");
      setInsertUrl("");
      setInsertFile(null);
      await refreshList();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Thêm CV thất bại",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setInserting(false);
    }
  };

  const handleSave = async () => {
    if (!selectedId) {
      return;
    }
    setSaving(true);
    try {
      await updateCV(selectedId, {
        title: editTitle.trim() || undefined,
        sourceUrl: editUrl.trim() || undefined,
        file: editFile,
      });
      toast({ title: "Đã lưu thay đổi" });
      setEditFile(null);
      await refreshList();
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

  const handlePublish = async () => {
    if (!selectedId) {
      toast({ variant: "destructive", title: "Chọn một CV để publish" });
      return;
    }
    setPublishing(true);
    try {
      await publishCV(selectedId);
      toast({ title: "Đã publish CV lên portfolio công khai" });
      await refreshList();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Publish thất bại",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý CV</h1>
        <p className="text-sm text-muted-foreground">
          Thêm CV từ file hoặc URL, chỉnh sửa bản đã có, và publish lên trang công khai.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chọn CV</CardTitle>
          <CardDescription>CV đang chọn dùng cho cập nhật và Publish.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-2">
            <Label>CV hiện có</Label>
            <Select
              value={selectedId || undefined}
              onValueChange={(v) => setSelectedId(v)}
              disabled={loadingList || items.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingList ? "Đang tải…" : "Chọn CV"} />
              </SelectTrigger>
              <SelectContent>
                {items.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={() => void handlePublish()} disabled={!selectedId || publishing}>
            {publishing ? "Đang publish…" : "Publish"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thêm CV mới</CardTitle>
            <CardDescription>Upload PDF/DOCX hoặc dùng URL nguồn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-new-title">Tiêu đề</Label>
              <Input
                id="cv-new-title"
                value={insertTitle}
                onChange={(e) => setInsertTitle(e.target.value)}
                placeholder="Ví dụ: CV 2025 — Full Stack"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-new-file">File (PDF / DOCX)</Label>
              <Input
                id="cv-new-file"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setInsertFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-new-url">Hoặc URL</Label>
              <Input
                id="cv-new-url"
                value={insertUrl}
                onChange={(e) => setInsertUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <Button type="button" onClick={() => void handleInsert()} disabled={inserting}>
              {inserting ? "Đang tải lên…" : "Thêm CV"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cập nhật CV</CardTitle>
            <CardDescription>
              {detailLoading ? "Đang tải chi tiết…" : selectedId ? "Chỉnh sửa và lưu." : "Chọn một CV ở trên."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-edit-title">Tiêu đề</Label>
              <Input
                id="cv-edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={!selectedId || detailLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-edit-url">URL nguồn</Label>
              <Input
                id="cv-edit-url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                disabled={!selectedId || detailLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-edit-file">Thay file (tùy chọn)</Label>
              <Input
                id="cv-edit-file"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
                disabled={!selectedId || detailLoading}
              />
            </div>
            <Button type="button" variant="secondary" onClick={() => void handleSave()} disabled={!selectedId || saving || detailLoading}>
              {saving ? "Đang lưu…" : "Lưu thay đổi"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <p className="text-xs text-muted-foreground">
        API: <code className="rounded bg-muted px-1">/admin/cvs</code> — đảm bảo backend khớp payload multipart/JSON
        và CORS có credentials nếu dùng cookie kèm Bearer.
      </p>
    </div>
  );
}
