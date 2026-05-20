"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Settings2, Star } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  fetchConversationList,
  fetchConversationMessages,
  updateConversationComment,
  updateConversationUserAgent,
} from "@/services/conversationService";
import type { ConversationMessageRow, ConversationVisitorRow } from "@/types/conversation";

function listItemLabel(row: ConversationVisitorRow): string {
  if (row.user_agent && row.user_agent.trim()) {
    return row.user_agent.trim();
  }
  return row.cookie_token || row.id;
}

export function ConversationManager() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ConversationVisitorRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ConversationMessageRow[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [commentDraft, setCommentDraft] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);

  const [configOpen, setConfigOpen] = useState(false);
  const [configUserAgent, setConfigUserAgent] = useState("");
  const [configInteresting, setConfigInteresting] = useState<boolean>(false);
  const [configCompanyHintPreview, setConfigCompanyHintPreview] = useState("");
  const [configSaving, setConfigSaving] = useState(false);
  const [totalConv, setTotalConv] = useState(0);
  const [totalConvHasMsg, setTotalConvHasMsg] = useState(0);
  const [totalConvNoMsg, setTotalConvNoMsg] = useState(0);
  const [dataMsgs, setDataMsgs] = useState<ConversationVisitorRow[]>([]);
  const [totalConvToday, setTotalConvToday] = useState(0);

  const selectedRow = useMemo(
    () => rows.find((r) => r.conversation?.id === selectedConversationId) ?? null,
    [rows, selectedConversationId],
  );

  const syncConfigFormFromRow = useCallback((row: ConversationVisitorRow) => {
    setConfigUserAgent(row.user_agent ?? "");
    setConfigInteresting(row.is_interesting === true);
    setConfigCompanyHintPreview(row.company_hint ?? "");
  }, []);

  useEffect(() => {
    if (configOpen && selectedRow) {
      syncConfigFormFromRow(selectedRow);
    }
  }, [configOpen, selectedRow, syncConfigFormFromRow]);

  const loadList = useCallback(async () => {
    setListLoading(true);
    const today = new Date().toISOString().split('T')[0]; // "2026-05-18"
    try {
      const dataMsg = await fetchConversationList();
      const data = dataMsg.filter(item => item.conversation.message_count > 0);

      const dataToday = dataMsgs.filter(item => {
        const lastMsg = item.conversation?.last_message_at;
        return lastMsg && lastMsg.split('T')[0] === today;
      })

      const hasMsg = data.length;
      const noMsg = dataMsg.length - hasMsg;

      setRows(data);

      setDataMsgs(dataMsg);
      setTotalConv(dataMsg.length);
      
      setTotalConvNoMsg(noMsg);
      setTotalConvHasMsg(hasMsg);
      setTotalConvToday(dataToday.length);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Không tải được danh sách hội thoại",
        description: e instanceof Error ? e.message : "Lỗi không xác định",
      });
      setRows([]);
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      setCommentDraft("");
      return;
    }

    let cancelled = false;
    const conv = rows.find((r) => r.conversation?.id === selectedConversationId)?.conversation;
    setCommentDraft(conv?.comment ?? "");

    setMessagesLoading(true);
    void fetchConversationMessages(selectedConversationId)
      .then((list) => {
        if (!cancelled) {
          setMessages(list);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setMessages([]);
          toast({
            variant: "destructive",
            title: "Không tải được nội dung chat",
            description: e instanceof Error ? e.message : "Lỗi không xác định",
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedConversationId, rows, toast]);

  const handleSaveComment = async () => {
    if (!selectedConversationId) {
      toast({ variant: "destructive", title: "Chọn một hội thoại" });
      return;
    }
    setCommentSaving(true);
    try {
      await updateConversationComment(selectedConversationId, commentDraft);
      toast({ title: "Đã cập nhật comment" });
      await loadList();
      setRows((prev) =>
        prev.map((r) =>
          r.conversation?.id === selectedConversationId ? { ...r, conversation: { ...r.conversation, comment: commentDraft } } : r,
        ),
      );
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Cập nhật comment thất bại",
        description: e instanceof Error ? e.message : "Kiểm tra API POST /cms/conv/comment",
      });
    } finally {
      setCommentSaving(false);
    }
  };

  const handleOpenConfig = () => {
    if (!selectedRow) {
      toast({ variant: "destructive", title: "Chọn một hội thoại trước" });
      return;
    }
    syncConfigFormFromRow(selectedRow);
    setConfigOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!selectedRow) {
      return;
    }
    const visitorId = selectedRow.id;
    setConfigSaving(true);
    try {
      await updateConversationUserAgent({
        id: visitorId,
        userAgent: configUserAgent.trim(),
        isInteresting: configInteresting,
      });
      toast({ title: "Đã cập nhật cấu hình hội thoại" });
      setConfigOpen(false);
      await loadList();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Cập nhật thất bại",
        description: e instanceof Error ? e.message : "Kiểm tra POST /cms/conv/user-agent",
      });
    } finally {
      setConfigSaving(false);
    }
  };

  const handleLoadConvHasMsg = () => {
    const data = dataMsgs.filter(item => item.conversation?.message_count > 0);
    setRows(data);
  }
  
  const handleLoadConvNoMsg = () => {
    const data = dataMsgs.filter(item => item.conversation?.message_count == 0);
    setRows(data);
  }

  const handleLoadAllConvMsg = async () => {
    await loadList();
  }

  const handleLoadTodayConvMsg = () => {
    const today = new Date().toISOString().split('T')[0]; // "2026-05-18"

    const dataToday = rows.filter(item => {
      const lastMsg = item.conversation?.last_message_at;
      return lastMsg && lastMsg.split('T')[0] === today;
    })

    const dataMsgToday = dataToday.filter(item => item.conversation.message_count > 0);

    const hasMsgToday = dataMsgToday.length;
    const noMsgToday = dataToday.length - hasMsgToday;

    setDataMsgs(dataToday);
    setTotalConvNoMsg(noMsgToday);
    setTotalConvHasMsg(hasMsgToday);
  }


  const canConfigure = Boolean(selectedConversationId && selectedRow);

  return (
    <div className="flex min-h-0 flex-1 w-full flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Quản lý hội thoại
            </h1>

            <div
              className="
                rounded-full
                border border-cyan-500/30
                bg-cyan-500/15
                px-3 py-1
                text-sm
                cursor-pointer
                transition-all duration-200
                shadow-sm
                shadow-cyan-500/10
                hover:bg-cyan-500/20
                hover:border-cyan-500/50
                hover:shadow-sm
                active:scale-95
              "
              onClick={() => void handleLoadTodayConvMsg()}
            >
              <span className="text-cyan-300">Hôm nay: </span>
              <span className="ml-2 font-semibold text-white">
                { totalConvToday }
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="
                rounded-full
                border border-blue-500/20
                bg-blue-500/10
                px-3 py-1
                text-sm
                cursor-pointer
                transition-all duration-200
                hover:bg-blue-500/20
                hover:border-blue-500/40
                hover:shadow-sm
                active:scale-95
              "
              onClick={() => void handleLoadAllConvMsg()}
            >
              <span className="text-blue-300">Tổng</span>
              <span className="ml-2 font-semibold text-white">{totalConv}</span>
            </div>

            <div className=" 
              rounded-full
              border border-emerald-500/20
              bg-emerald-500/10
              px-3 py-1
              text-sm
              cursor-pointer
              transition-all duration-200
              hover:bg-emerald-500/20
              hover:border-emerald-500/40
              hover:shadow-sm
              active:scale-95
            "
              onClick={() => void handleLoadConvHasMsg()}>
              <span className="text-emerald-300">Có tin nhắn</span>
              <span className="ml-2 font-semibold text-white">
                {totalConvHasMsg}
              </span>
            </div>

            <div className="
              rounded-full
              border border-amber-500/20
              bg-amber-500/10
              px-3 py-1
              text-sm
              cursor-pointer
              transition-all duration-200
              hover:bg-amber-500/20
              hover:border-amber-500/40
              hover:shadow-sm
              active:scale-95
              "
              onClick={() => void handleLoadConvNoMsg()}>
              <span className="text-amber-300">Chưa có tin nhắn</span>
              <span className="ml-2 font-semibold text-white">
                {totalConvNoMsg}
              </span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 shrink-0"
          onClick={handleOpenConfig}
          disabled={!canConfigure || listLoading}
        >
          <Settings2 className="h-4 w-4" />
          Cấu hình
        </Button>
      </div>

      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Cấu hình hội thoại</DialogTitle>
            <DialogDescription>
              Cập nhật User Agent và Interesting. Company Hint chỉ xem.{selectedRow?.conversation?.id && (
                <>
                  {" "}
                  <span className="font-mono text-xs">conversation: {selectedRow.conversation.id}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="conv-config-ua">User Agent</Label>
              <Input
                id="conv-config-ua"
                value={configUserAgent}
                onChange={(e) => setConfigUserAgent(e.target.value)}
                placeholder="Hiển thị trong danh sách…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conv-config-company">Company Hint</Label>
              <Textarea
                id="conv-config-company"
                className="min-h-[96px] resize-none font-mono text-xs"
                readOnly
                value={configCompanyHintPreview || "—"}
                aria-readonly="true"
              />
              <p className="text-xs text-muted-foreground">Chỉ đọc, không gửi khi Save.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Interesting Status</p>
              <RadioGroup
                value={configInteresting ? "interesting" : "not"}
                onValueChange={(v) => setConfigInteresting(v === "interesting")}
                className="flex flex-col gap-2"
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                  <RadioGroupItem value="interesting" id="interesting-yes" />
                  <span>Interesting</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                  <RadioGroupItem value="not" id="interesting-no" />
                  <span>Not Interesting</span>
                </label>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfigOpen(false)} disabled={configSaving}>
              Hủy
            </Button>
            <Button type="button" onClick={() => void handleSaveConfig()} disabled={configSaving}>
              {configSaving ? "Đang lưu…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,6fr)_minmax(0,2fr)]">
        {/* 20% — danh sách */}
        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 py-3">
            <CardTitle className="text-base">Danh sách</CardTitle>
            <CardDescription>{listLoading ? "Đang tải…" : `${rows.length} mục`}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 p-0 pb-3">
            <ScrollArea className="h-[min(520px,calc(100vh-13rem))] px-4">
              <ul className="space-y-1 pr-3">
                {rows.map((row) => {
                  const cid = row.conversation?.id;
                  const lastSeen = row?.last_seen_at?.toString() ?? ''
                  if (!cid) {
                    return null;
                  }
                  const active = selectedConversationId === cid;
                  return (
                    <li key={`${row.id}-${cid}`}>
                      <button
                        type="button"
                        onClick={() => setSelectedConversationId(cid)}
                        className={`flex w-full gap-2 rounded-md border px-2 py-2 text-left text-sm transition-colors hover:bg-accent/60 ${active ? "border-primary/50 bg-primary/10" : "border-transparent bg-muted/30"
                          }`}
                      >
                        <Star
                          className={`mt-0.5 h-4 w-4 shrink-0 ${row.is_interesting === true
                            ? "fill-amber-400 text-amber-400"
                            : row.is_interesting === false
                              ? "fill-emerald-500 text-emerald-500"
                              : "fill-muted-foreground/35 text-muted-foreground/50"
                            }`}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 font-medium leading-tight">{listItemLabel(row)}</span>
                          <span className="mt-1 block truncate text-[10px] text-muted-foreground">{new Date(lastSeen).toLocaleString()}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 60% — nội dung chat */}
        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 py-3">
            <CardTitle className="text-base">Nội dung chat</CardTitle>
            <CardDescription>
              {!selectedConversationId && "Chọn một hội thoại bên trái."}
              {selectedConversationId && messagesLoading && "Đang tải tin nhắn…"}
              {selectedConversationId && !messagesLoading && `${messages.length} tin nhắn`}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 px-3 pb-3">
            <ScrollArea className="h-[min(520px,calc(100vh-13rem))] rounded-md border bg-muted/20 px-3 py-2">
              <div className="space-y-3 pr-3">
                {messages.map((m) => {
                  const isHr = m.role === "hr";
                  return (
                    <div key={m.id} className={`flex ${isHr ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${isHr ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground ring-1 ring-border"
                          }`}
                      >
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                        <time className="mt-1 block text-[10px] opacity-80">
                          {m.role?.toUpperCase()} · {m.created_at ? new Date(m.created_at).toLocaleString() : "—"}
                        </time>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 20% — comment */}
        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0 py-3">
            <CardTitle className="text-base">Ghi chú quản trị</CardTitle>
            <CardDescription>
              {!selectedConversationId
                ? "Chọn conversation."
                : selectedRow?.conversation
                  ? `Session: ${selectedRow.conversation.session_id}`
                  : "—"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4">
            <Textarea
              className="min-h-[160px] flex-1 resize-y text-sm"
              placeholder='Comment (conversation.comment)'
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              disabled={!selectedConversationId || messagesLoading}
            />
            <Button
              type="button"
              className="w-full"
              onClick={() => void handleSaveComment()}
              disabled={!selectedConversationId || commentSaving || messagesLoading}
            >
              {commentSaving ? "Đang lưu…" : "Cập nhật comment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
