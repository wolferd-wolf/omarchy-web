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
  Sliders,
  Camera,
  Bell,
} from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { useWindowStore } from "@/store/windowStore";
import { playTactileClick } from "@/core/audio/soundEffects";

export const SystemStatus: React.FC = () => {
  const {
    cpuUsage,
    memoryUsage,
    batteryLevel,
    isMuted,
    toggleMute,
    soundEffects,
    updateMetrics,
    isControlCenterOpen,
    setControlCenterOpen,
    triggerScreenshot,
    notifications,
  } = useSystemStore();

  const { setCommandPaletteOpen, setHotkeysModalOpen } = useWindowStore();

  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) +
          "  " +
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
    <div className="flex items-center space-x-1.5 text-xs font-mono-os select-none">
      {/* Search Launcher Button */}
      <button
        onClick={() => {
          if (soundEffects) playTactileClick();
          setCommandPaletteOpen(true);
        }}
        className="flex items-center space-x-1 px-2 py-1 rounded-md waybar-module hover:border-white/20 text-slate-300 transition-colors"
        title="Launcher (Super + Space)"
      >
        <Search className="w-3 h-3 text-emerald-400" />
        <span className="hidden lg:inline text-[11px]">Wofi</span>
      </button>

      {/* Hardware Telemetry Module */}
      <div className="hidden sm:flex items-center space-x-3 px-2.5 py-1 rounded-md waybar-module text-slate-300 text-[11px] tabular-nums">
        <div className="flex items-center space-x-1" title="CPU Load">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>{cpuUsage}%</span>
        </div>
        <div className="flex items-center space-x-1" title="RAM Usage">
          <HardDrive className="w-3 h-3 text-purple-400" />
          <span>{memoryUsage}%</span>
        </div>
      </div>

      {/* Network & Audio & Battery Module */}
      <div className="flex items-center space-x-2 px-2 py-1 rounded-md waybar-module text-slate-300 text-[11px]">
        <div className="flex items-center space-x-1 text-slate-400" title="Network: wlan0 connected">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span className="hidden xl:inline text-[10px]">wlan0</span>
        </div>

        <button
          onClick={() => {
            if (soundEffects) playTactileClick();
            toggleMute();
          }}
          className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
          title={isMuted ? "Unmute" : "Mute (80%)"}
        >
          {isMuted ? (
            <VolumeX className="w-3 h-3 text-rose-400" />
          ) : (
            <Volume2 className="w-3 h-3 text-slate-300" />
          )}
        </button>

        <div className="flex items-center space-x-1 tabular-nums" title={`Battery: ${batteryLevel}%`}>
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px]">{batteryLevel}%</span>
        </div>
      </div>

      {/* Screenshot Quick Button */}
      <button
        onClick={triggerScreenshot}
        className="p-1 rounded-md waybar-module hover:border-white/20 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Capture Screenshot (Super+Shift+S)"
      >
        <Camera className="w-3.5 h-3.5" />
      </button>

      {/* Clock Module */}
      <div className="px-2.5 py-1 rounded-md waybar-module font-semibold text-slate-200 text-[11px] tabular-nums">
        {timeStr || "12:00"}
      </div>

      {/* Quick Settings & Control Center Button */}
      <button
        onClick={() => {
          if (soundEffects) playTactileClick();
          setControlCenterOpen(!isControlCenterOpen);
        }}
        className={`relative flex items-center justify-center px-2 py-1 rounded-md waybar-module transition-colors ${
          isControlCenterOpen ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "hover:border-white/20 text-slate-300 hover:text-white"
        }`}
        title="Quick Settings & Notifications"
      >
        <Sliders className="w-3.5 h-3.5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>

      {/* Keybindings Cheat Sheet */}
      <button
        onClick={() => {
          if (soundEffects) playTactileClick();
          setHotkeysModalOpen(true);
        }}
        className="flex items-center justify-center w-6 h-6 rounded-md waybar-module hover:border-white/20 text-slate-400 hover:text-slate-100 transition-colors"
        title="Keybindings (Super + ?)"
      >
        <HelpCircle className="w-3 h-3" />
      </button>
    </div>
  );
};
