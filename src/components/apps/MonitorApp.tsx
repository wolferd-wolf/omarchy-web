"use client";

import React, { useState } from "react";
import { Cpu, HardDrive, Activity, Wifi, XCircle, RefreshCw } from "lucide-react";
import { useSystemStore } from "@/store/systemStore";

interface MonitorAppProps {
  windowId: string;
}

export const MonitorApp: React.FC<MonitorAppProps> = () => {
  const { cpuUsage, memoryUsage, processes } = useSystemStore();
  const [selectedPid, setSelectedPid] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full w-full bg-[#08090f] font-mono-os text-xs text-slate-200 select-none overflow-hidden p-2 space-y-2">
      {/* Top 3 Btop TUI Panels: CPU, MEM, DISK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-shrink-0">
        {/* CPU Panel */}
        <div className="p-2.5 rounded-lg bg-[#0d101a] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-omarchy-accent">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>CPU 5.70 GHz</span>
            </span>
            <span className="tabular-nums">{cpuUsage}%</span>
          </div>

          <div className="mt-2 space-y-1 text-[10px] tabular-nums text-slate-400">
            <div className="flex items-center justify-between">
              <span>Core 0..3:</span>
              <span className="text-emerald-400 font-mono">[||||||||||          ]</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Core 4..7:</span>
              <span className="text-cyan-400 font-mono">[||||||              ]</span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-black/60 rounded-full mt-2 overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 rounded-full"
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
        </div>

        {/* MEM Panel */}
        <div className="p-2.5 rounded-lg bg-[#0d101a] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-omarchy-cyan">
            <span className="flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              <span>MEM 32.0 GiB</span>
            </span>
            <span className="tabular-nums">{memoryUsage}%</span>
          </div>

          <div className="mt-2 text-[10px] space-y-0.5 text-slate-400 tabular-nums">
            <div className="flex justify-between">
              <span>Used: <strong className="text-slate-200">5.9 GiB</strong></span>
              <span>Free: <strong className="text-slate-200">18.4 GiB</strong></span>
            </div>
            <div className="flex justify-between">
              <span>Cache: <strong className="text-slate-200">7.1 GiB</strong></span>
              <span>Swap: <strong className="text-slate-200">0.0 GiB</strong></span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-black/60 rounded-full mt-2 overflow-hidden border border-white/5">
            <div
              className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
              style={{ width: `${memoryUsage}%` }}
            />
          </div>
        </div>

        {/* DISK & NET Panel */}
        <div className="p-2.5 rounded-lg bg-[#0d101a] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-omarchy-violet">
            <span className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>IO & NETWORK</span>
            </span>
            <span className="text-[10px] text-emerald-400">ONLINE</span>
          </div>

          <div className="mt-2 text-[10px] space-y-0.5 text-slate-400 tabular-nums">
            <div className="flex justify-between">
              <span>NVMe Disk:</span>
              <span className="text-slate-200">64G / 512G (13%)</span>
            </div>
            <div className="flex justify-between">
              <span>wlan0 TX/RX:</span>
              <span className="text-purple-400">▲ 42KB/s  ▼ 1.8MB/s</span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-black/60 rounded-full mt-2 overflow-hidden border border-white/5">
            <div className="h-full bg-purple-500 w-[13%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Process Tree Table */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#0a0c14] border border-white/[0.08] rounded-lg overflow-hidden">
        <div className="h-7 px-3 bg-[#111422] border-b border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-slate-400">
          <div className="grid grid-cols-12 gap-2 w-full">
            <span className="col-span-2">PID</span>
            <span className="col-span-4">COMMAND</span>
            <span className="col-span-2 text-right">CPU%</span>
            <span className="col-span-2 text-right">MEM%</span>
            <span className="col-span-2 text-center">STAT</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {processes.map((proc) => {
            const isSelected = selectedPid === proc.pid;
            return (
              <div
                key={proc.pid}
                onClick={() => setSelectedPid(proc.pid)}
                className={`px-3 py-1.5 grid grid-cols-12 gap-2 items-center text-xs tabular-nums cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-omarchy-accent/15 text-white font-medium"
                    : "hover:bg-white/[0.04] text-slate-300"
                }`}
              >
                <span className="col-span-2 text-slate-500 font-bold">{proc.pid}</span>
                <span className="col-span-4 text-slate-200 truncate font-semibold">
                  {proc.name}
                </span>
                <span className="col-span-2 text-right text-emerald-400">
                  {proc.cpu.toFixed(1)}%
                </span>
                <span className="col-span-2 text-right text-slate-400">
                  {proc.memory.toFixed(1)}MB
                </span>
                <span className="col-span-2 text-center">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      proc.status === "running"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {proc.status}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="h-7 px-3 bg-[#0c0e18] border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
          <span>Selected PID: {selectedPid || "None"}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPid(null)}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
            >
              SIGTERM (15)
            </button>
            <button
              onClick={() => setSelectedPid(null)}
              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold"
            >
              SIGKILL (9)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
