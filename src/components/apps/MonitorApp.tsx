"use client";

import React from "react";
import { Cpu, HardDrive, Activity, ShieldCheck, XCircle } from "lucide-react";
import { useSystemStore } from "@/store/systemStore";

interface MonitorAppProps {
  windowId: string;
}

export const MonitorApp: React.FC<MonitorAppProps> = () => {
  const { cpuUsage, memoryUsage, processes } = useSystemStore();

  return (
    <div className="flex flex-col h-full w-full bg-omarchy-950 font-mono text-xs text-slate-200 select-none overflow-hidden">
      {/* Top Metric Cards */}
      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-white/5 bg-omarchy-900/60">
        <div className="p-2.5 rounded-xl bg-omarchy-950 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>CPU USAGE</span>
            <Cpu className="w-3.5 h-3.5 text-omarchy-accent" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-omarchy-accent">{cpuUsage}%</span>
            <span className="text-[10px] text-slate-500">8 Cores (Sim)</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-omarchy-accent transition-all duration-300 rounded-full"
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-omarchy-950 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>RAM ALLOCATION</span>
            <HardDrive className="w-3.5 h-3.5 text-omarchy-cyan" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-omarchy-cyan">{memoryUsage}%</span>
            <span className="text-[10px] text-slate-500">6.2 / 16 GB</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-omarchy-cyan transition-all duration-300 rounded-full"
              style={{ width: `${memoryUsage}%` }}
            />
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-omarchy-950 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>KERNEL ARCH</span>
            <Activity className="w-3.5 h-3.5 text-omarchy-violet" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-sm font-bold text-omarchy-violet">x86_64</span>
            <span className="text-[10px] text-slate-500">WASM</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 truncate">
            Linux 6.12.0-omarchy
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-omarchy-950 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>AI AGENT DAEMON</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-sm font-bold text-emerald-400">ACTIVE</span>
            <span className="text-[10px] text-slate-500">PID 210</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 truncate">
            Autonomous Engine
          </span>
        </div>
      </div>

      {/* Process Table Header */}
      <div className="px-4 py-2 bg-omarchy-900/40 border-b border-white/5 text-[11px] font-semibold text-slate-400 grid grid-cols-12 gap-2">
        <span className="col-span-2">PID</span>
        <span className="col-span-4">PROCESS</span>
        <span className="col-span-2 text-right">CPU %</span>
        <span className="col-span-2 text-right">MEM MB</span>
        <span className="col-span-2 text-center">STATUS</span>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-1">
        {processes.map((proc) => (
          <div
            key={proc.pid}
            className="px-3 py-2 rounded-lg hover:bg-white/5 grid grid-cols-12 gap-2 items-center text-xs transition-colors"
          >
            <span className="col-span-2 text-slate-500 font-bold">{proc.pid}</span>
            <span className="col-span-4 font-semibold text-slate-200 truncate">
              {proc.name}
            </span>
            <span className="col-span-2 text-right text-omarchy-accent font-mono">
              {proc.cpu.toFixed(1)}%
            </span>
            <span className="col-span-2 text-right text-slate-300 font-mono">
              {proc.memory.toFixed(1)}
            </span>
            <span className="col-span-2 text-center">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  proc.status === "running"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : proc.status === "sleeping"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-slate-500/20 text-slate-400"
                }`}
              >
                {proc.status}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
