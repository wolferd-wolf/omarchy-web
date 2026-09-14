"use client";

import React from "react";
import { Zap, Columns, Rows, Power } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { WorkspacePills } from "./WorkspacePills";
import { SystemStatus } from "./SystemStatus";

export const QuickShellBar: React.FC = () => {
  const {
    windows,
    focusedWindowId,
    defaultSplitDirection,
    toggleSplitDirection,
    setCommandPaletteOpen,
  } = useWindowStore();

  const activeWindow = focusedWindowId ? windows[focusedWindowId] : null;

  return (
    <header className="h-9 w-full px-2 flex items-center justify-between z-30 select-none bg-[#090b12]/90 backdrop-blur-xl border-b border-white/[0.08] text-xs font-mono-os">
      {/* Left Modules */}
      <div className="flex items-center space-x-2">
        {/* Omarchy Arch Logo */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md waybar-module hover:border-omarchy-accent/40 text-slate-100 transition-colors"
          title="Omarchy App Menu (Super+Space)"
        >
          <Zap className="w-3.5 h-3.5 text-omarchy-accent fill-omarchy-accent" />
          <span className="font-bold tracking-wider text-[11px] text-slate-100">
            OMARCHY
          </span>
        </button>

        {/* Workspaces 1..5 */}
        <WorkspacePills />
      </div>

      {/* Center Module: Focused Window & Tiling Mode */}
      <div className="hidden md:flex items-center space-x-2">
        {activeWindow ? (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-md waybar-module text-slate-300 max-w-sm truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-omarchy-accent animate-pulse" />
            <span className="font-medium text-slate-200 text-[11px] truncate">
              {activeWindow.title}
            </span>
          </div>
        ) : (
          <div className="px-3 py-1 rounded-md waybar-module text-slate-500 text-[11px] italic">
            ~ empty workspace ~
          </div>
        )}

        {/* Split Mode Badge */}
        <button
          onClick={toggleSplitDirection}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-md waybar-module hover:border-omarchy-cyan/40 text-slate-400 hover:text-slate-200 transition-colors"
          title="Click to toggle tiling split direction (Super+V)"
        >
          {defaultSplitDirection === "horizontal" ? (
            <>
              <Columns className="w-3 h-3 text-omarchy-cyan" />
              <span className="text-[10px] font-semibold text-omarchy-cyan">H-SPLIT</span>
            </>
          ) : (
            <>
              <Rows className="w-3 h-3 text-omarchy-violet" />
              <span className="text-[10px] font-semibold text-omarchy-violet">V-SPLIT</span>
            </>
          )}
        </button>
      </div>

      {/* Right Modules */}
      <SystemStatus />
    </header>
  );
};
