"use client";

import { useCallback, useEffect, useState } from "react";

import { Plus } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createCvCms, fetchCvCms, updateCvCms } from "@/services/cvService";
import type { CvCmsRecord } from "@/types/cv";

export function CVManager() {
  const { toast } = useToast();
  const [record, setRecord] = useState<CvCmsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [cvContentJson, setCvContentJson] = useState("{}");
  const [statusActive, setStatusActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [createName, setCreateName] = useState("");
  const [createContentJson, setCreateContentJson] = useState("{}");
  const [creating, setCreating] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const applyRecord = useCallback((r: CvCmsRecord | null) => {
    setRecord(r);
    if (r) {
      setName(r.name);
      setCvContentJson(JSON.stringify(r.cv_content ?? {}, null, 2));
      setStatusActive(r.is_active);
    } else {
      setName("");
      setCvContentJson("{}");
      setStatusActive(true);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCvCms();
      applyRecord(data);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Không tải được CV",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
      applyRecord(null);
    } finally {
      setLoading(false);
    }
  }, [applyRecord, toast]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const parseContentObject = (json: string, fieldLabel: string): Record<string, unknown> => {
    const trimmed = json.trim();
    if (!trimmed) {
      return {};
    }
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`${fieldLabel} phải là một object JSON (không phải mảng hay primitive).`);
    }
    return parsed as Record<string, unknown>;
  };

  const handleSave = async () => {
    if (!record?.id) {
      toast({ variant: "destructive", title: "Chưa có CV để lưu" });
      return;
    }
    let content: Record<string, unknown>;
    try {
      content = parseContentObject(cvContentJson, "content");
    } catch (e) {
      toast({
        variant: "destructive",
        title: "JSON không hợp lệ",
        description: e instanceof Error ? e.message : undefined,
      });
      return;
    }
    setSaving(true);
    try {
      const updated = await updateCvCms({
        id: record.id,
        name: name.trim() || record.name,
        content,
        status: statusActive,
      });
      applyRecord(updated);
      toast({ title: "Đã lưu CV" });
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
    if (!record?.id) {
      toast({ variant: "destructive", title: "Chưa có CV để publish" });
      return;
    }
    let content: Record<string, unknown>;
    try {
      content = parseContentObject(cvContentJson, "content");
    } catch (e) {
      toast({
        variant: "destructive",
        title: "JSON không hợp lệ",
        description: e instanceof Error ? e.message : undefined,
      });
      return;
    }
    setPublishing(true);
    try {
      const updated = await updateCvCms({
        id: record.id,
        name: name.trim() || record.name,
        content,
        status: true,
      });
      applyRecord(updated);
      toast({ title: "Đã publish", description: "status = true" });
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

  const openCreateDialog = () => {
    setCreateName("");
    setCreateContentJson("{}");
    setCreateDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!createName.trim()) {
      toast({ variant: "destructive", title: "Nhập tên CV (name)" });
      return;
    }
    let content: Record<string, unknown>;
    try {
      content = parseContentObject(createContentJson, "content");
    } catch (e) {
      toast({
        variant: "destructive",
        title: "JSON không hợp lệ",
        description: e instanceof Error ? e.message : undefined,
      });
      return;
    }
    setCreating(true);
    try {
      const created = await createCvCms({ name: createName.trim(), content });
      applyRecord(created);
      setCreateDialogOpen(false);
      setCreateName("");
      setCreateContentJson("{}");
      toast({ title: "Đã tạo CV" });
      await refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Tạo CV thất bại",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý CV</h1>
          <p className="text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1 text-xs">GET /cms/cv/fetch</code> — chỉnh{" "}
            <code className="rounded bg-muted px-1 text-xs">name</code>,{" "}
            <code className="rounded bg-muted px-1 text-xs">content</code> (JSON),{" "}
            <code className="rounded bg-muted px-1 text-xs">status</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Tạo CV mới
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
            {loading ? "Đang tải…" : "Tải lại"}
          </Button>
          <Button type="button" size="sm" onClick={() => void handleSave()} disabled={loading || !record || saving}>
            {saving ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => void handlePublish()}
            disabled={loading || !record || publishing}
          >
            {publishing ? "Đang publish…" : "Publish"}
          </Button>
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo CV mới</DialogTitle>
            <DialogDescription>
              <code className="rounded bg-muted px-1 text-xs">POST /cms/cv/create</code> —{" "}
              <code className="rounded bg-muted px-1 text-xs">{"{ name, content }"}</code>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cv-create-name">Tên (name)</Label>
              <Input
                id="cv-create-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Tên hiển thị CV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-create-json">content (JSON object)</Label>
              <Textarea
                id="cv-create-json"
                className="min-h-[180px] font-mono text-xs leading-relaxed"
                spellCheck={false}
                value={createContentJson}
                onChange={(e) => setCreateContentJson(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={creating}>
              Hủy
            </Button>
            <Button type="button" onClick={() => void handleCreate()} disabled={creating}>
              {creating ? "Đang tạo…" : "Tạo CV"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!loading && !record && (
        <Card>
          <CardHeader>
            <CardTitle>Chưa có CV (fetch)</CardTitle>
            <CardDescription>
              Không có <code className="rounded bg-muted px-1 text-xs">payload.data</code> từ fetch. Bấm{" "}
              <strong>Tạo CV mới</strong> hoặc <strong>Tải lại</strong>.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {record && (
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle>CV hiện tại</CardTitle>
              <CardDescription className="font-mono text-xs">id: {record.id}</CardDescription>
            </div>
            <Badge variant={record.is_active ? "default" : "secondary"}>{record.is_active ? "active" : "inactive"}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-name">Tên (name)</Label>
              <Input id="cv-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2">
              <div className="space-y-0.5">
                <Label htmlFor="cv-status">Kích hoạt (status)</Label>
                <p className="text-xs text-muted-foreground">Gửi lên API field boolean <code className="text-xs">status</code></p>
              </div>
              <Switch id="cv-status" checked={statusActive} onCheckedChange={setStatusActive} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-json">content (JSON object)</Label>
              <Textarea
                id="cv-json"
                className="min-h-[240px] font-mono text-xs leading-relaxed"
                spellCheck={false}
                value={cvContentJson}
                onChange={(e) => setCvContentJson(e.target.value)}
              />
            </div>
            <Separator />
            <dl className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              <div>
                <dt className="font-medium text-foreground/80">created_at</dt>
                <dd>{record.created_at ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground/80">updated_at</dt>
                <dd>{record.updated_at ?? "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      <Separator />
      <p className="text-xs text-muted-foreground">
        Cập nhật: <code className="rounded bg-muted px-1">POST /cms/cv/update</code> với{" "}
        <code className="rounded bg-muted px-1">{"{ id, name, content, status }"}</code>. Tạo mới:{" "}
        <code className="rounded bg-muted px-1">POST /cms/cv/create</code> với{" "}
        <code className="rounded bg-muted px-1">{"{ name, content }"}</code>.
      </p>
    </div>
  );
}
