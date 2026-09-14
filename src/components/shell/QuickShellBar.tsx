"use client";

import React from "react";
import { Zap, Columns, Rows } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { WorkspacePills } from "./WorkspacePills";
import { SystemStatus } from "./SystemStatus";

export const QuickShellBar: React.FC = () => {
  const {
    windows,
    focusedWindowId,
    defaultSplitDirection,
    toggleSplitDirection,
  } = useWindowStore();

  const activeWindow = focusedWindowId ? windows[focusedWindowId] : null;

  return (
    <header className="h-10 w-full px-3 flex items-center justify-between z-30 select-none bg-omarchy-950/80 backdrop-blur-md border-b border-white/5">
      {/* Left: Branding & Workspaces */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-mono text-xs font-black tracking-wider text-slate-100 px-2 py-1 rounded-full quickshell-pill">
          <Zap className="w-3.5 h-3.5 text-omarchy-accent fill-omarchy-accent animate-pulse" />
          <span className="bg-gradient-to-r from-omarchy-accent to-omarchy-cyan bg-clip-text text-transparent font-bold">
            OMARCHY
          </span>
          <span className="text-[10px] text-slate-400 font-normal">v4.0</span>
        </div>

        <WorkspacePills />
      </div>

      {/* Center: Focused Window Title & Split Mode Indicator */}
      <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
        {activeWindow ? (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full quickshell-pill text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-omarchy-accent animate-ping" />
            <span className="font-semibold text-slate-200 truncate max-w-xs">
              {activeWindow.title}
            </span>
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full quickshell-pill text-slate-500 italic">
            No active window
          </div>
        )}

        {/* Split Mode Badge (clickable to toggle) */}
        <button
          onClick={toggleSplitDirection}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full quickshell-pill text-slate-400 hover:text-omarchy-cyan hover:border-omarchy-cyan/40 transition-colors"
          title="Click to toggle split mode (Super+V)"
        >
          {defaultSplitDirection === "horizontal" ? (
            <>
              <Columns className="w-3 h-3 text-omarchy-cyan" />
              <span className="text-[10px] font-bold">H-SPLIT</span>
            </>
          ) : (
            <>
              <Rows className="w-3 h-3 text-omarchy-violet" />
              <span className="text-[10px] font-bold">V-SPLIT</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Controls, Stats, Clock */}
      <SystemStatus />
    </header>
  );
};
