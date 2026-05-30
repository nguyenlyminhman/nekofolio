"use client";

import React, { useState } from "react";
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Server,
  Wifi,
  RefreshCw,
  Square,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Download,
  MessageSquare,
  Users,
  FolderGit2,
  FileText
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Brush } from "recharts";
import { Button } from "../ui/button";

// Data giả lập lịch sử cho các card nhỏ
const cpuHistory = [{ v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 42 }];
const ramHistory = [{ v: 2.1 }, { v: 2.4 }, { v: 2.6 }, { v: 2.7 }, { v: 2.8 }];
const diskHistory = [{ v: 38 }, { v: 38 }, { v: 38 }, { v: 38 }, { v: 38 }];

// Data biểu đồ chính
const trafficData = [
  { time: "10:00", requests: 120 },
  { time: "10:05", requests: 240 },
  { time: "10:10", requests: 190 },
  { time: "10:15", requests: 380 },
  { time: "10:20", requests: 410 },
  { time: "10:25", requests: 320 },
  { time: "10:30", requests: 510 },
  { time: "10:35", requests: 460 },
  { time: "10:40", requests: 300 },
  { time: "10:45", requests: 340 },
  { time: "10:50", requests: 650 },
  { time: "10:55", requests: 420 },
];

const metrics = {
  cpu: 42,
  ramUsed: 2.8,
  ramTotal: 8,
  diskUsed: 38,
  diskTotal: 80,
  uptime: "12d 4h 21m",
};

// Kiểu dữ liệu cho trạng thái Confirm Modal
interface ConfirmState {
  isOpen: boolean;
  appName: string;
  actionType: "restart" | "stop" | null;
}

export function ServerDashboard() {
  const [apps, setApps] = useState([
    { name: "portfolio-be", status: "online", cpu: "3.2%", memory: "220 MB", type: "NestJS", ports: "3000" },
    { name: "portfolio-fe", status: "online", cpu: "1.1%", memory: "145 MB", type: "Next.js", ports: "3001" },
  ]);

  // Quản lý trạng thái đóng/mở của Modal Xác nhận
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    isOpen: false,
    appName: "",
    actionType: null,
  });
  const [isBackupcribing, setIsBackupcribing] = useState(false);

  const ramPercent = Math.round((metrics.ramUsed / metrics.ramTotal) * 100);
  const diskPercent = Math.round((metrics.diskUsed / metrics.diskTotal) * 100);

  // Hàm kích hoạt mở Modal khi nhấn nút ở Action
  const triggerAction = (appName: string, actionType: "restart" | "stop") => {
    setConfirmModal({
      isOpen: true,
      appName,
      actionType,
    });
  };

  // Hàm xử lý khi người dùng nhấn "Confirm" trên Modal
  const handleConfirmAction = () => {
    const { appName, actionType } = confirmModal;

    if (actionType === "restart") {
      console.log(`[PM2] Đang khởi động lại ứng dụng: ${appName}`);
      // Bạn có thể fetch API hoặc cập nhật state thực tế ở đây
    } else if (actionType === "stop") {
      console.log(`[PM2] Đang dừng ứng dụng: ${appName}`);
      // Ví dụ: Cập nhật status của app thành 'stopped'
      setApps(prev => prev.map(app => app.name === appName ? { ...app, status: "stopped", cpu: "0%", memory: "0 MB" } : app));
    }

    // Đóng modal sau khi thực hiện xong
    setConfirmModal({ isOpen: false, appName: "", actionType: null });
  };

  const handleBackupAndDownload = async () => {
    setIsBackupcribing(true);

    try {
      // Giả lập gọi API xuống BE xử lý pg_dump & upload S3 trong 2 giây
      await new Promise((resolve) => setTimeout(resolve, 2000));



    } catch (error) {
      console.error("Backup failed:", error);
    } finally {
      setIsBackupcribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(6,182,212,0.12),transparent_40%),radial-gradient(circle_at_15%_80%,rgba(99,102,241,0.08),transparent_40%)]" />

      <div className="relative z-10 mx-auto">

        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Infrastructure Live Monitor
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent sm:text-4xl">
              Node Cluster Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              AWS EC2 i-039f82d · Node v20.11.0 · Tokyo Region (ap-northeast-1)
            </p>
          </div>

          <div className="flex items-center self-start sm:self-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-xs font-medium text-emerald-400 backdrop-blur shadow-sm">
              <Wifi size={14} className="animate-pulse" />
              WS Gateway Connected
            </div>
            <button className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 transition duration-200">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        {/*  */}
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

        {/* METRICS CARDS GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-5">
          <MetricCard
            icon={<Cpu size={20} />}
            title="CPU Load"
            value={`${metrics.cpu}%`}
            subtext="Core usage allocation"
            chartData={cpuHistory}
            color="#22d3ee"
          />
          <MetricCard
            icon={<MemoryStick size={20} />}
            title="Memory Usage"
            value={`${metrics.ramUsed} GB`}
            subtext={`of ${metrics.ramTotal} GB total (${ramPercent}%)`}
            chartData={ramHistory}
            color="#6366f1"
          />
          <MetricCard
            icon={<HardDrive size={20} />}
            title="NVMe Storage"
            value={`${metrics.diskUsed} GB`}
            subtext={`Available: ${metrics.diskTotal - metrics.diskUsed} GB`}
            chartData={diskHistory}
            color="#38bdf8"
          />
          <MetricCard
            icon={<Server size={20} />}
            title="System Uptime"
            value={metrics.uptime}
            subtext="Last restart: Apr 12"
            isStatic
          />
        </div>

        {/* MAIN INTERFACE: CHARTS & APPS */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* TRAFFIC & REQUESTS CHART WITH BRUSH */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">Network Throughput</h3>
                  <p className="text-xs text-slate-400">HTTP requests processed per minute</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-md">
                Avg 380 req/m <ArrowUpRight size={12} />
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                  <Brush
                    dataKey="time"
                    height={22}
                    stroke="#334155"
                    fill="#0b0f19"
                    gap={10}
                    startIndex={3}
                    endIndex={11}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* POSTGRESQL STATS */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
            {/* Header Container: Đẩy button qua bên phải */}
            <div className="mb-6 flex items-start justify-between gap-4">
              {/* Khối bên trái: Icon + Tiêu đề */}
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">PostgreSQL Instance</h3>
                  <p className="text-xs text-slate-400">Internal DB Health</p>
                </div>
              </div>

              {/* Khối bên phải: Button đã được mang lên đây */}
              <Button
                onClick={handleBackupAndDownload}
                disabled={isBackupcribing}
                variant="outline"
                size="sm"
                className="gap-2 h-9 shrink-0" /* Thêm shrink-0 để nút không bị méo chữ khi màn hình nhỏ */
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

            {/* Phần thông tin bên dưới */}
            <div className="space-y-3">
              <InfoRow label="Cluster Status" value="Healthy" type="success" />
              <InfoRow label="Active Connections" value="12 / 100" />
              <InfoRow label="Database Size" value="248.4 MB" />
              <InfoRow label="Cache Hit Rate" value="99.8%" />
              <InfoRow label="Slow Queries (&gt;500ms)" value="0" type="normal" />
            </div>
          </div>

          {/* PM2 PROCESSES LIST */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">PM2 Process Manager</h3>
                  <p className="text-xs text-slate-400">Active Node.js applications lifecycle</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">Total processes: {apps.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Application Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Port</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">CPU</th>
                    <th className="pb-3 text-right">Memory</th>
                    <th className="pb-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                  {apps.map((app) => (
                    <tr key={app.name} className="group hover:bg-slate-800/20 transition duration-150">
                      <td className="py-4 pl-2 font-semibold text-white">{app.name}</td>
                      <td className="py-4 text-slate-400 text-xs"><span className="bg-slate-800 px-2 py-0.5 rounded-md">{app.type}</span></td>
                      <td className="py-4 text-mono text-xs text-slate-400">{app.ports}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${app.status === "online"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/10"
                          }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${app.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono text-cyan-400 font-medium">{app.cpu}</td>
                      <td className="py-4 text-right font-mono text-slate-300">{app.memory}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Nút Restart */}
                          <button
                            onClick={() => triggerAction(app.name, "restart")}
                            title="Restart Process"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition"
                          >
                            <RefreshCw size={13} />
                          </button>
                          {/* Nút Stop */}
                          <button
                            onClick={() => triggerAction(app.name, "stop")}
                            disabled={app.status === "stopped"}
                            title="Stop Process"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                          >
                            <Square size={13} fill="currentColor" className="text-transparent hover:text-rose-400 group-disabled:hover:text-slate-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* COMPONENT MODAL CONFIRMATION (HIỆN KHI CLICK ACTIONS) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop tối mờ phía sau */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setConfirmModal({ isOpen: false, appName: "", actionType: null })}
          />

          {/* Khung nội dung Modal */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Nút đóng góc phải */}
            <button
              onClick={() => setConfirmModal({ isOpen: false, appName: "", actionType: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${confirmModal.actionType === 'restart' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'}`}>
                <AlertTriangle size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white capitalize">
                  Confirm Process {confirmModal.actionType}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Are you sure you want to <span className="font-semibold text-slate-200">{confirmModal.actionType}</span> the application{" "}
                  <span className="font-mono font-semibold text-cyan-400">"{confirmModal.appName}"</span>? This may temporarily interrupt server traffic.
                </p>
              </div>
            </div>

            {/* Các nút bấm thao tác */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, appName: "", actionType: null })}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-lg transition duration-150 ${confirmModal.actionType === "restart"
                  ? "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/10"
                  : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/10"
                  }`}
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENT: CARD HIỂN THỊ METRIC KÈM MINI CHART
function MetricCard({
  icon,
  title,
  value,
  subtext,
  chartData,
  color = "#22d3ee",
  isStatic = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtext: string;
  chartData?: { v: number }[];
  color?: string;
  isStatic?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg backdrop-blur-md hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-400 group-hover:text-white group-hover:border-slate-700 transition duration-300">
            {icon}
          </div>
          {!isStatic && (
            <span className="flex items-center gap-1 rounded-md bg-cyan-500/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-400 border border-cyan-500/10">
              LIVE
            </span>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</h3>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
        <p className="text-xs text-slate-500 truncate">{subtext}</p>

        {!isStatic && chartData && (
          <div className="h-8 w-20 opacity-70 group-hover:opacity-100 transition duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill="transparent" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENT: ROW THÔNG TIN CHI TIẾT
function InfoRow({
  label,
  value,
  type = "normal",
}: {
  label: string;
  value: string;
  type?: "normal" | "success" | "warning";
}) {
  const valueColor = {
    normal: "text-slate-200 font-mono",
    success: "text-emerald-400 font-medium inline-flex items-center gap-1",
    warning: "text-amber-400 font-medium"
  }[type];

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800/40 bg-slate-950/40 px-4 py-3 text-xs">
      <span className="text-slate-400">{label}</span>
      <span className={valueColor}>
        {type === "success" && <CheckCircle2 size={12} />}
        {value}
      </span>
    </div>
  );
}
