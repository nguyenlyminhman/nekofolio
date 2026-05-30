"use client";

import { useState } from "react";
import {
    Download,
    Database,
    Loader2,
    Users,
    MessageSquare,
    Globe,
    FileText,
    FolderGit2,
    ArrowUpRight
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function ServerDash() {
    const [isBackupcribing, setIsBackupcribing] = useState(false);

    // Logic giả lập download file backup
    const handleBackupAndDownload = async () => {
        setIsBackupcribing(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const mockSqlContent = `-- PostgreSQL Dump\n-- Date: ${new Date().toISOString()}\n`;
            const blob = new Blob([mockSqlContent], { type: "application/sql" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `backup_postgres_${new Date().toISOString().slice(0, 10)}.sql`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        } finally {
            setIsBackupcribing(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Hệ Thống Quản Trị</h1>
                <p className="text-sm text-muted-foreground">Theo dõi lưu lượng truy cập, dữ liệu CV, Repository và tài nguyên hệ thống.</p>
            </div>

            {/* 1. HÀNG THỐNG KÊ TỔNG QUAN (METRIC CARDS) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card Số lượng CV */}
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tổng Số CV</p>
                        <p className="text-2xl font-bold">128</p>
                    </div>
                    <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-500">
                        <FileText className="h-5 w-5" />
                    </div>
                </div>

                {/* Card Số lượng Repo */}
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Repositories</p>
                        <p className="text-2xl font-bold">45</p>
                    </div>
                    <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-500">
                        <FolderGit2 className="h-5 w-5" />
                    </div>
                </div>

                {/* Card Truy cập hôm nay */}
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Truy Cập Hôm Nay</p>
                        <p className="text-2xl font-bold">1,420</p>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Users className="h-5 w-5" />
                    </div>
                </div>

                {/* Card Tỷ lệ chuyển đổi nhắn tin */}
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tỷ Lệ Nhắn Tin</p>
                        <p className="text-2xl font-bold">32.4%</p>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* 2. KHU VỰC BIỂU ĐỒ TRUY CẬP VÀ ĐỊA LÝ */}
            <div className="grid gap-4 md:grid-cols-3">

                {/* BIỂU ĐỒ XU HƯỚNG TRUY CẬP TRONG THÁNG (Chiếm 2 cột) */}
                <div className="md:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-base">Xu Hướng Truy Cập Trong Tháng</h3>
                            <p className="text-xs text-muted-foreground">So sánh lượt truy cập tương tác (có tin nhắn) và vãng lai.</p>
                        </div>
                        {/* Chú thích biểu đồ */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                                <span className="text-muted-foreground">Có tin nhắn</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 bg-muted-foreground/30 rounded-full" />
                                <span className="text-muted-foreground">Chỉ xem (Không nhắn)</span>
                            </div>
                        </div>
                    </div>

                    {/* Giả lập biểu đồ cột (Fake Chart UI) */}
                    <div className="h-48 flex items-end justify-between gap-2 pt-4 border-b border-border select-none">
                        {/* Mỗi khối div đại diện cho 1 tuần hoặc cụm ngày trong tháng */}
                        {[
                            { label: "Ngày 01-05", msg: 40, noMsg: 60 },
                            { label: "Ngày 06-10", msg: 55, noMsg: 45 },
                            { label: "Ngày 11-15", msg: 70, noMsg: 30 },
                            { label: "Ngày 16-20", msg: 35, noMsg: 65 },
                            { label: "Ngày 21-25", msg: 80, noMsg: 20 },
                            { label: "Ngày 26-30", msg: 65, noMsg: 35 },
                        ].map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                <div className="w-full flex items-end gap-1 h-full max-w-[45px]">
                                    {/* Cột Có tin nhắn */}
                                    <div
                                        style={{ height: `${item.msg}%` }}
                                        className="w-1/2 bg-primary rounded-t-sm transition-all group-hover:brightness-110"
                                        title={`Có tin nhắn: ${item.msg}%`}
                                    />
                                    {/* Cột Không tin nhắn */}
                                    <div
                                        style={{ height: `${item.noMsg}%` }}
                                        className="w-1/2 bg-muted-foreground/20 rounded-t-sm transition-all group-hover:bg-muted-foreground/40"
                                        title={`Không nhắn tin: ${item.noMsg}%`}
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* THỐNG KÊ LƯỢT TRUY CẬP THEO VỊ TRÍ (IP LOCATION) (Chiếm 1 cột) */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-base flex items-center gap-1.5">
                            <Globe className="h-4 w-4 text-primary" />
                            Vị Trí Địa Lý (IP)
                        </h3>
                        <p className="text-xs text-muted-foreground">Phân tích lượng truy cập Trong nước vs Quốc tế.</p>
                    </div>

                    {/* Thanh Tiến Trình Tỷ Lệ (Progress Breakdown) */}
                    <div className="space-y-4 my-auto py-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-1">🇻🇳 Trong nước (Việt Nam)</span>
                                <span className="text-primary font-bold">78.5%</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: "78.5%" }} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-1">🌐 Ngoài nước (Quốc tế)</span>
                                <span className="text-muted-foreground font-bold">21.5%</span>
                            </div>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                <div className="bg-muted-foreground/40 h-full rounded-full" style={{ width: "21.5%" }} />
                            </div>
                        </div>
                    </div>

                    {/* Danh sách thống kê nhanh top quốc gia ngoài nước */}
                    <div className="pt-3 border-t border-border text-[11px] text-muted-foreground space-y-1.5">
                        <div className="flex justify-between"><span>1. United States (US)</span><span className="font-medium text-foreground">12.3%</span></div>
                        <div className="flex justify-between"><span>2. Japan (JP)</span><span className="font-medium text-foreground">4.5%</span></div>
                        <div className="flex justify-between"><span>3. Singapore (SG)</span><span className="font-medium text-foreground">2.7%</span></div>
                    </div>
                </div>
            </div>

            {/* 3. KHU VỰC QUẢN LÝ DATABASE (GIỮ LẠI TỪ FILE CŨ CỦA BẠN) */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">Cấu Hình Cơ Sở Dữ Liệu</h2>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                                <Database className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base leading-none tracking-tight">PostgreSQL Instance</h3>
                                <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Status: Online</span>
                                    <span className="text-border">|</span>
                                    <span>Port: 5432</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleBackupAndDownload}
                            disabled={isBackupcribing}
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9 shrink-0"
                        >
                            {isBackupcribing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang tạo backup...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Backup & Download
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}