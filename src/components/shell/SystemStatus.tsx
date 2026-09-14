"use client";

import React, { useEffect, useState } from "react";
import {
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  HelpCircle,
  Search,
} from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { useWindowStore } from "@/store/windowStore";

export const SystemStatus: React.FC = () => {
  const { cpuUsage, memoryUsage, batteryLevel, isMuted, toggleMute, updateMetrics } =
    useSystemStore();
  const { setCommandPaletteOpen, setHotkeysModalOpen } = useWindowStore();

  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
          " " +
          now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
      );
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    const metricsInterval = setInterval(updateMetrics, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(metricsInterval);
    };
  }, [updateMetrics]);

  return (
    <div className="flex items-center space-x-2 text-xs font-mono">
      {/* App Launcher Button */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full quickshell-pill hover:bg-white/10 text-slate-300 transition-colors"
        title="Launcher (Super + Space)"
      >
        <Search className="w-3.5 h-3.5 text-omarchy-accent" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline px-1 text-[10px] bg-white/10 rounded text-slate-400">
          Super+Space
        </kbd>
      </button>

      {/* CPU & RAM Pill */}
      <div className="hidden lg:flex items-center space-x-3 px-3 py-1 rounded-full quickshell-pill text-slate-300">
        <div className="flex items-center space-x-1" title="CPU Usage">
          <Cpu className="w-3.5 h-3.5 text-omarchy-cyan" />
          <span>{cpuUsage}%</span>
        </div>
        <div className="flex items-center space-x-1" title="RAM Usage">
          <HardDrive className="w-3.5 h-3.5 text-omarchy-violet" />
          <span>{memoryUsage}%</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full quickshell-pill text-slate-300">
        <span title="Network: Connected">
          <Wifi className="w-3.5 h-3.5 text-omarchy-accent" />
        </span>
        <button
          onClick={toggleMute}
          className="hover:text-omarchy-accent transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-slate-300" />
          )}
        </button>
        <div className="flex items-center space-x-1" title={`Battery: ${batteryLevel}%`}>
          <Battery className="w-3.5 h-3.5 text-omarchy-accent" />
          <span className="hidden sm:inline">{batteryLevel}%</span>
        </div>
      </div>

      {/* Clock Pill */}
      <div className="px-3 py-1 rounded-full quickshell-pill font-medium text-slate-200">
        {timeStr || "12:00 PM"}
      </div>

      {/* Hotkeys Button */}
      <button
        onClick={() => setHotkeysModalOpen(true)}
        className="flex items-center justify-center w-7 h-7 rounded-full quickshell-pill hover:bg-white/10 text-slate-300 transition-colors"
        title="Keybindings Cheat Sheet (Super + ?)"
      >
        <HelpCircle className="w-3.5 h-3.5 text-slate-300 hover:text-omarchy-accent" />
      </button>
    </div>
  );
};
