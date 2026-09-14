"use client";

import React from "react";
import { Terminal, Bot, Search, Zap, Code2, Cpu } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { TilingContainer } from "./TilingContainer";
import { WindowFrame } from "./WindowFrame";
import { AppRenderer } from "./AppRenderer";

export const Desktop: React.FC = () => {
  const {
    workspaces,
    activeWorkspaceId,
    windows,
    openWindow,
    setCommandPaletteOpen,
  } = useWindowStore();

  const currentWs = workspaces[activeWorkspaceId] || {
    id: 1,
    name: "1",
    tilingRoot: null,
    activeWindowId: null,
  };

  // Filter windows in this workspace
  const wsWindows = Object.values(windows).filter(
    (w) => w.workspaceId === activeWorkspaceId
  );
  const floatingWindows = wsWindows.filter((w) => w.isFloating);
  const hasTiledWindows = currentWs.tilingRoot !== null;

  return (
    <main className="relative flex-1 w-full h-[calc(100vh-40px)] overflow-hidden p-2 bg-omarchy-950">
      {/* Background aesthetic grid / ambient texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-omarchy-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-omarchy-cyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Tiling Area */}
      {hasTiledWindows ? (
        <div className="relative w-full h-full min-w-0 min-h-0 z-10">
          <TilingContainer node={currentWs.tilingRoot} windows={windows} />
        </div>
      ) : floatingWindows.length === 0 ? (
        /* Empty Workspace Prompt */
        <div className="relative w-full h-full flex flex-col items-center justify-center z-10 select-none animate-fade-in">
          <div className="flex items-center space-x-2 text-omarchy-accent mb-3">
            <Zap className="w-8 h-8 animate-pulse" />
            <h1 className="text-3xl font-black font-mono tracking-wider bg-gradient-to-r from-omarchy-accent via-omarchy-cyan to-omarchy-violet bg-clip-text text-transparent">
              OMARCHY 4.0
            </h1>
          </div>
          <p className="text-slate-400 font-mono text-xs mb-8 text-center max-w-md">
            Malleable Web Operating System for the Age of AI Agents. Powered by Hyprland tiling & Quickshell.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl font-mono text-xs">
            <button
              onClick={() => openWindow("terminal")}
              className="flex flex-col items-center p-4 rounded-2xl quickshell-pill hover:border-omarchy-accent/50 hover:bg-white/5 transition-all group"
            >
              <Terminal className="w-6 h-6 text-omarchy-accent mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-slate-200">Terminal</span>
              <span className="text-[10px] text-slate-500 mt-1">Super + Enter</span>
            </button>

            <button
              onClick={() => openWindow("agent")}
              className="flex flex-col items-center p-4 rounded-2xl quickshell-pill hover:border-omarchy-cyan/50 hover:bg-white/5 transition-all group"
            >
              <Bot className="w-6 h-6 text-omarchy-cyan mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-slate-200">Agent Hub</span>
              <span className="text-[10px] text-slate-500 mt-1">Super + A</span>
            </button>

            <button
              onClick={() => openWindow("editor")}
              className="flex flex-col items-center p-4 rounded-2xl quickshell-pill hover:border-omarchy-violet/50 hover:bg-white/5 transition-all group"
            >
              <Code2 className="w-6 h-6 text-omarchy-violet mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-slate-200">Neovim</span>
              <span className="text-[10px] text-slate-500 mt-1">Super + E</span>
            </button>

            <button
              onClick={() => openWindow("v86")}
              className="flex flex-col items-center p-4 rounded-2xl quickshell-pill hover:border-emerald-400/50 hover:bg-white/5 transition-all group"
            >
              <Cpu className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-slate-200">Alpine VM</span>
              <span className="text-[10px] text-slate-500 mt-1">Real x86 Linux</span>
            </button>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full quickshell-pill hover:bg-white/10 text-slate-300 transition-colors font-mono text-xs border border-white/10"
            >
              <Search className="w-3.5 h-3.5 text-omarchy-accent" />
              <span>Search apps & commands</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-slate-400">
                Super+Space
              </kbd>
            </button>
          </div>
        </div>
      ) : null}

      {/* Floating Windows in this workspace */}
      {floatingWindows.map((win) => (
        <WindowFrame key={win.id} window={win}>
          <AppRenderer window={win} />
        </WindowFrame>
      ))}
    </main>
  );
};
