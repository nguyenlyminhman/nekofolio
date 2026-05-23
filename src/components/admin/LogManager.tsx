"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  RefreshCw, 
  Trash2, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  TriangleAlert 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- FAKE DATA GENERATOR (Mô phỏng NestJS + PM2 Logs) ---
const MOCK_LOGS = [
  { timestamp: "2026-05-23 10:14:02", type: "info", context: "PM2", message: "App [nestjs-api:0] starting in cluster_mode" },
  { timestamp: "2026-05-23 10:14:05", type: "info", context: "NestFactory", message: "Starting Nest application..." },
  { timestamp: "2026-05-23 10:14:05", type: "info", context: "InstanceLoader", message: "AppModule dependencies initialized" },
  { timestamp: "2026-05-23 10:14:05", type: "info", context: "InstanceLoader", message: "PrismaModule dependencies initialized" },
  { timestamp: "2026-05-23 10:14:05", type: "info", context: "InstanceLoader", message: "LogsModule dependencies initialized" },
  { timestamp: "2026-05-23 10:14:06", type: "info", context: "RoutesResolver", message: "LogsController {/admin/logs}:" },
  { timestamp: "2026-05-23 10:14:06", type: "info", context: "RouterExplorer", message: "Mapped {/admin/logs, GET} route" },
  { timestamp: "2026-05-23 10:14:06", type: "info", context: "NestApplication", message: "Nest application successfully started on port 3001" },
  { timestamp: "2026-05-23 10:15:22", type: "info", context: "Router", message: "GET /admin/logs?limit=50 200 OK - 42ms" },
  { timestamp: "2026-05-23 10:16:11", type: "warn", context: "CloudWatchService", message: "High latency detected on AWS endpoint ap-southeast-1. Retrying in 2s..." },
  { timestamp: "2026-05-23 10:16:13", type: "info", context: "CloudWatchService", message: "AWS CloudWatch connection re-established successfully." },
  { timestamp: "2026-05-23 10:18:45", type: "error", context: "AuthGuard", message: "Unauthorized access attempt to /admin/logs - IP: 113.161.44.12" },
  { timestamp: "2026-05-23 10:20:01", type: "error", context: "PrismaClient", message: "Query Timeout Error: Failed to fetch record from table 'cv_profiles' after 5000ms" },
  { timestamp: "2026-05-23 10:22:15", type: "warn", context: "ConfigService", message: "JWT_EXPIRATION is not set in environment. Falling back to default: 1d" },
  { timestamp: "2026-05-23 10:25:30", type: "info", context: "Router", message: "POST /admin/cv/upload 201 Created - 158ms" },
];

type LogType = "all" | "info" | "warn" | "error";

export function LogManager() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [filterType, setFilterType] = useState<LogType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống đáy Terminal khi có log mới
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Logic Giả lập Refresh / Fetch thêm log mới sinh ra
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newLog = {
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        type: Math.random() > 0.3 ? "info" : Math.random() > 0.5 ? "warn" : "error",
        context: "Router",
        message: `MOCK EVENT - Kiểm tra trạng thái hệ thống tự động: ${Math.floor(Math.random() * 100)}`,
      };
      setLogs((prev) => [...prev, newLog]);
      setIsRefreshing(false);
    }, 1000);
  };

  // Logic xóa màn hình console tạm thời
  const handleClear = () => {
    setLogs([]);
  };

  // Xử lý bộ lọc cấp cao (Filter & Search)
  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === "all" || log.type === filterType;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.context.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full space-y-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            System Live Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi log thời gian thực của NestJS quản lý bởi PM2 đồng bộ từ CloudWatch.
          </p>
        </div>

        {/* CÁC NÚT THAO TÁC NHANH */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button 
            onClick={handleClear} 
            variant="outline" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Clear Console
          </Button>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing} 
            size="sm" 
            className="gap-1.5"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh Log
          </Button>
        </div>
      </div>

      {/* FILTER BAR SECTION */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center bg-card p-3 rounded-lg border border-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tin nhắn, context..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-background/50"
          />
        </div>

        {/* Tab Filter Levels */}
        <div className="flex bg-muted p-1 rounded-md text-sm shrink-0">
          {(["all", "info", "warn", "error"] as LogType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-3 py-1 rounded-sm font-medium capitalize transition-all",
                filterType === type 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* TERMINAL VIEW CONSOLE */}
      <div className="w-full h-[550px] overflow-y-auto rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-200 border border-zinc-800 shadow-2xl flex flex-col justify-between">
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="h-[480px] flex flex-col items-center justify-center text-zinc-500 gap-2">
              <CheckCircle2 className="h-8 w-8 text-zinc-600 animate-pulse" />
              <p className="italic">Không tìm thấy bản ghi log nào phù hợp.</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              // Phân định màu sắc dựa theo Level Log
              const isInfo = log.type === "info";
              const isWarn = log.type === "warn";
              const isError = log.type === "error";

              return (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start gap-2 py-1 px-2 rounded transition-colors duration-150 whitespace-pre-wrap leading-relaxed",
                    isInfo && "hover:bg-zinc-900/50",
                    isWarn && "text-amber-300 bg-amber-950/10 hover:bg-amber-950/20 border-l-2 border-amber-500 pl-1.5",
                    isError && "text-red-400 bg-red-950/20 hover:bg-red-950/30 border-l-2 border-red-500 pl-1.5"
                  )}
                >
                  {/* Timestamp */}
                  <span className="text-zinc-500 shrink-0 select-none">
                    [{log.timestamp}]
                  </span>

                  {/* Icon chỉ định nhanh trạng thái */}
                  <span className="shrink-0 pt-0.5 select-none">
                    {isInfo && <Info className="h-3.5 w-3.5 text-blue-400" />}
                    {isWarn && <TriangleAlert className="h-3.5 w-3.5 text-amber-400" />}
                    {isError && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
                  </span>

                  {/* Context (Module NestJS) */}
                  <span className={cn(
                    "font-bold shrink-0",
                    isInfo && "text-emerald-400",
                    isWarn && "text-amber-400",
                    isError && "text-red-500"
                  )}>
                    [{log.context}]
                  </span>

                  {/* Nội dung Log thật */}
                  <span className={cn(isInfo && "text-zinc-300")}>{log.message}</span>
                </div>
              );
            })
          )}
          {/* Điểm neo để tự động cuộn màn hình */}
          <div ref={terminalEndRef} />
        </div>

        {/* Dòng trạng thái cuối Terminal */}
        <div className="mt-4 pt-2 border-t border-zinc-900 text-zinc-600 flex justify-between items-center text-[10px] select-none">
          <span>Process: nestjs-api-production | Cluster Mode [CPU: 0%]</span>
          <span>Showing {filteredLogs.length} / {logs.length} logs</span>
        </div>
      </div>
    </div>
  );
}