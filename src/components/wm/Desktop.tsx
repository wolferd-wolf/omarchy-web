"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Bot,
  Code2,
  Cpu,
  Activity,
  Folder,
  Columns,
  HelpCircle,
  Image as ImageIcon,
  Settings,
  Globe,
  Disc,
  Calculator,
  Gamepad2,
  Paintbrush,
  Lock,
} from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { TilingContainer } from "./TilingContainer";
import { WindowFrame } from "./WindowFrame";
import { AppRenderer } from "./AppRenderer";
import { WALLPAPERS } from "./wallpapers";
import { playTactileClick } from "@/core/audio/soundEffects";

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

export const Desktop: React.FC = () => {
  const {
    workspaces,
    activeWorkspaceId,
    windows,
    openWindow,
    toggleSplitDirection,
    setCommandPaletteOpen,
    setHotkeysModalOpen,
  } = useWindowStore();

  const { soundEffects, lockDesktop, nightLight } = useSystemStore();

  const [wallpaperIdx, setWallpaperIdx] = useState(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });

  const currentWs = workspaces[activeWorkspaceId] || {
    id: 1,
    name: "1",
    tilingRoot: null,
    activeWindowId: null,
  };

  const wsWindows = Object.values(windows).filter(
    (w) => w.workspaceId === activeWorkspaceId
  );
  const floatingWindows = wsWindows.filter((w) => w.isFloating);
  const hasTiledWindows = currentWs.tilingRoot !== null;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soundEffects) playTactileClick();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 240),
      y: Math.min(e.clientY, window.innerHeight - 440),
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) setContextMenu((prev) => ({ ...prev, visible: false }));
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [contextMenu.visible]);

  const cycleWallpaper = () => {
    if (soundEffects) playTactileClick();
    setWallpaperIdx((prev) => (prev + 1) % WALLPAPERS.length);
  };

  const currentWallpaper = WALLPAPERS[wallpaperIdx];

  return (
    <main
      onContextMenu={handleContextMenu}
      className={`relative flex-1 w-full h-[calc(100vh-36px)] overflow-hidden select-none desktop-grid transition-all duration-300 ${
        nightLight ? "sepia-[0.25] brightness-95" : ""
      }`}
      style={{ background: currentWallpaper.gradient }}
    >
      {/* SVG Matte Film-Grain Microtexture Layer */}
      <div className="absolute inset-0 w-full h-full noise-overlay pointer-events-none" />

      {/* Atmospheric Procedural Vector Backgrounds */}
      {wallpaperIdx === 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <circle cx="120" cy="80" r="1" fill="#fff" opacity="0.6" />
          <circle cx="340" cy="140" r="1.5" fill="#a5f3fc" opacity="0.8" />
          <circle cx="680" cy="90" r="1" fill="#fff" opacity="0.5" />
          <circle cx="920" cy="110" r="1.2" fill="#86efac" opacity="0.7" />
          <circle cx="1240" cy="70" r="1" fill="#fff" opacity="0.6" />
          <circle cx="1100" cy="180" r="1" fill="#a5f3fc" opacity="0.4" />

          {/* Aurora Borealis Ribbon */}
          <path
            d="M 0 280 Q 360 170, 720 220 T 1440 170 L 1440 440 L 0 440 Z"
            fill="url(#auroraGradient)"
            opacity="0.28"
          />

          {/* Distant Mountain Silhouettes */}
          <polygon
            points="0,620 240,490 480,570 760,460 1020,540 1280,450 1440,520 1440,900 0,900"
            fill="#050811"
            opacity="0.7"
          />
          {/* Foreground Sharp Ridges */}
          <polygon
            points="0,700 180,600 420,680 680,570 940,650 1200,550 1440,630 1440,900 0,900"
            fill="#03050a"
          />

          <defs>
            <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {wallpaperIdx === 1 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <line x1="0" y1="450" x2="1440" y2="450" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.4" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.4" />
          <circle cx="720" cy="450" r="180" stroke="#06b6d4" strokeWidth="0.5" fill="none" opacity="0.2" strokeDasharray="6 6" />
          <circle cx="720" cy="450" r="320" stroke="#06b6d4" strokeWidth="0.5" fill="none" opacity="0.1" />
        </svg>
      )}

      {wallpaperIdx === 2 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <polygon
            points="0,680 120,680 120,540 180,540 180,680 260,680 260,490 320,490 320,680 440,680 440,580 500,580 500,680 620,680 620,460 680,460 680,680 820,680 820,520 890,520 890,680 1020,680 1020,470 1090,470 1090,680 1220,680 1220,560 1300,560 1300,680 1440,680 1440,900 0,900"
            fill="#090a14"
          />
        </svg>
      )}

      {/* Subtle Desktop Telemetry Watermark */}
      <div className="absolute bottom-4 right-5 text-right font-mono-os text-[10px] text-white/20 select-none pointer-events-none tracking-widest leading-tight">
        <div>OMARCHY OS // HYPRLAND</div>
        <div className="text-[9px] text-white/10">ARCH LINUX 6.12 // WAYLAND</div>
      </div>

      {/* Main Workspace Tiling Canvas */}
      <div className="relative w-full h-full p-2 z-10">
        {hasTiledWindows ? (
          <div className="w-full h-full min-w-0 min-h-0">
            <TilingContainer node={currentWs.tilingRoot} windows={windows} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-end items-center pb-6 pointer-events-none">
            <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full waybar-module text-[11px] font-mono-os text-slate-400 pointer-events-auto shadow-xl">
              <span>Super + Enter: Terminal</span>
              <span className="text-white/20">•</span>
              <span>Super + B: Browser</span>
              <span className="text-white/20">•</span>
              <span>Super + Space: Launcher</span>
              <span className="text-white/20">•</span>
              <span>Right-Click: Menu</span>
            </div>
          </div>
        )}

        {/* Floating Windows */}
        {floatingWindows.map((win) => (
          <WindowFrame key={win.id} window={win}>
            <AppRenderer window={win} />
          </WindowFrame>
        ))}
      </div>

      {/* Native-style Right-Click Desktop Context Menu */}
      {contextMenu.visible && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-60 rounded-xl waybar-module border border-white/10 p-1.5 font-mono-os text-xs text-slate-200 shadow-2xl animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-white/5 mb-1">
            Omarchy System Menu
          </div>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("terminal");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terminal</span>
            </div>
            <kbd className="text-[9px] text-slate-500">Super+Enter</kbd>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("browser");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zen Browser</span>
            </div>
            <kbd className="text-[9px] text-slate-500">Super+B</kbd>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("editor");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Neovim Editor</span>
            </div>
            <kbd className="text-[9px] text-slate-500">Super+E</kbd>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("agent");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Agent Hub</span>
            </div>
            <kbd className="text-[9px] text-slate-500">Super+A</kbd>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("files");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>Files (Yazi)</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("player");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Disc className="w-3.5 h-3.5 text-purple-400" />
            <span>Lo-Fi Audio Station</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("calculator");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Programmer Calculator</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("doom");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-rose-400" />
            <span>DOOM (WASM Arena)</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("paint");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Paintbrush className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pixel Art Studio</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("monitor");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>System Monitor (btop)</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("v86");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Alpine Linux VM (x86)</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              openWindow("settings");
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings & Themes</span>
          </button>

          <div className="h-px bg-white/5 my-1" />

          <button
            onClick={() => {
              cycleWallpaper();
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Cycle Wallpaper ({wallpaperIdx + 1}/{WALLPAPERS.length})</span>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              toggleSplitDirection();
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-white/10 text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Columns className="w-3.5 h-3.5 text-cyan-400" />
              <span>Toggle Split Direction</span>
            </div>
            <kbd className="text-[9px] text-slate-500">Super+V</kbd>
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              lockDesktop();
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-rose-500/20 text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock Desktop</span>
            </div>
            <kbd className="text-[9px] text-slate-500">Super+L</kbd>
          </button>
        </div>
      )}
    </main>
  );
};
