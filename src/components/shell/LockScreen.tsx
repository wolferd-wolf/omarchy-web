"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock, ArrowRight, ShieldCheck, User } from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { playTactileClick } from "@/core/audio/soundEffects";

export const LockScreen: React.FC = () => {
  const { isLocked, unlockDesktop } = useSystemStore();
  const [password, setPassword] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDateStr(now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);
    playTactileClick();
    setTimeout(() => {
      unlockDesktop(password);
      setPassword("");
      setIsUnlocking(false);
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#06080e]/85 backdrop-blur-2xl font-mono-os text-slate-200 select-none transition-all duration-300 ${
        isUnlocking ? "opacity-0 scale-105" : "opacity-100 scale-100 animate-fade-in"
      }`}
    >
      {/* Top Bar Info */}
      <div className="flex items-center space-x-2 text-slate-400 text-xs">
        <Lock className="w-3.5 h-3.5 text-emerald-400" />
        <span className="tracking-widest uppercase text-[10px]">OMARCHY HYPRLAND // SYSTEM LOCKED</span>
      </div>

      {/* Center Clock & Unlock Form */}
      <div className="flex flex-col items-center max-w-sm w-full text-center space-y-6">
        <div>
          <div className="text-6xl md:text-7xl font-bold tracking-tight text-white tabular-nums drop-shadow-2xl">
            {timeStr || "12:00"}
          </div>
          <div className="text-sm text-slate-400 mt-2 font-medium">
            {dateStr}
          </div>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center space-y-3 w-full">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-xl">
            <div className="w-full h-full rounded-full bg-[#0d101b] flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-100 text-sm">user@omarchy</div>
            <div className="text-[10px] text-slate-500">Arch Linux 6.12 // Wayland</div>
          </div>

          <form onSubmit={handleUnlock} className="w-full relative mt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Press Enter or type password..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-center text-slate-100 text-xs focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-transform active:scale-95"
              title="Unlock"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-[10px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Enter</kbd> to unlock
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-[10px] text-slate-600 tracking-wider uppercase">
        Omarchy Web OS 4.0 Quattro
      </div>
    </div>
  );
};
