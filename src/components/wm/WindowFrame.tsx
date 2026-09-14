"use client";

import React, { useRef } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  Maximize,
  Pin,
  Terminal,
  Bot,
  Code2,
  Folder,
  Activity,
  Cpu,
  Settings,
} from "lucide-react";
import { AppId, WindowInstance } from "@/types/os";
import { useWindowStore } from "@/store/windowStore";

interface WindowFrameProps {
  window: WindowInstance;
  children: React.ReactNode;
}

const APP_ICONS: Record<AppId, React.ReactNode> = {
  terminal: <Terminal className="w-3.5 h-3.5 text-omarchy-accent" />,
  agent: <Bot className="w-3.5 h-3.5 text-omarchy-cyan" />,
  editor: <Code2 className="w-3.5 h-3.5 text-omarchy-violet" />,
  files: <Folder className="w-3.5 h-3.5 text-amber-400" />,
  monitor: <Activity className="w-3.5 h-3.5 text-rose-400" />,
  settings: <Settings className="w-3.5 h-3.5 text-slate-300" />,
  v86: <Cpu className="w-3.5 h-3.5 text-emerald-400" />,
};

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const {
    focusedWindowId,
    focusWindow,
    closeWindow,
    toggleFloating,
    toggleMaximize,
    updateFloatingRect,
  } = useWindowStore();

  const isFocused = focusedWindowId === win.id;
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  const handleMouseDown = () => {
    if (!isFocused) {
      focusWindow(win.id);
    }
  };

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!win.isFloating || win.isMaximized) return;
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: win.floatingRect.x,
      startY: win.floatingRect.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = moveEvent.clientX - dragStart.current.mouseX;
      const dy = moveEvent.clientY - dragStart.current.mouseY;
      updateFloatingRect(win.id, {
        x: Math.max(10, dragStart.current.startX + dx),
        y: Math.max(45, dragStart.current.startY + dy),
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const floatingStyle: React.CSSProperties = win.isFloating
    ? win.isMaximized
      ? { position: "fixed", inset: "40px 0 0 0", zIndex: 40 }
      : {
          position: "fixed",
          left: `${win.floatingRect.x}px`,
          top: `${win.floatingRect.y}px`,
          width: `${win.floatingRect.width}px`,
          height: `${win.floatingRect.height}px`,
          zIndex: isFocused ? 35 : 30,
        }
    : {
        width: "100%",
        height: "100%",
      };

  return (
    <div
      style={floatingStyle}
      onMouseDown={handleMouseDown}
      className={`flex flex-col rounded-xl overflow-hidden bg-omarchy-900 shadow-2xl transition-shadow duration-200 ${
        isFocused ? "hyprland-active-border" : "hyprland-inactive-border"
      }`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        className={`h-8 px-3 flex items-center justify-between border-b select-none transition-colors ${
          isFocused
            ? "bg-omarchy-850 border-white/10"
            : "bg-omarchy-950/80 border-white/5 opacity-80"
        } ${win.isFloating && !win.isMaximized ? "cursor-move" : "cursor-default"}`}
      >
        <div className="flex items-center space-x-2 truncate">
          <span>{APP_ICONS[win.appId] || <Terminal className="w-3.5 h-3.5 text-slate-400" />}</span>
          <span className="text-xs font-mono font-medium text-slate-200 truncate">
            {win.title}
          </span>
          {win.isFloating && (
            <span className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-slate-400 font-mono">
              floating
            </span>
          )}
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-1 font-mono">
          {/* Toggle Floating / Tiled */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFloating(win.id);
            }}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-omarchy-cyan transition-colors"
            title={win.isFloating ? "Tile window (Super+Shift+Space)" : "Float window"}
          >
            <Pin className={`w-3 h-3 ${win.isFloating ? "text-omarchy-cyan fill-omarchy-cyan" : ""}`} />
          </button>

          {/* Maximize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(win.id);
            }}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-colors"
            title="Maximize (Super+F)"
          >
            {win.isMaximized ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Close (Super+Q)"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 w-full h-[calc(100%-32px)] overflow-hidden bg-omarchy-950/70">
        {children}
      </div>
    </div>
  );
};
