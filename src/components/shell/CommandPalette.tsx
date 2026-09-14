"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Bot,
  Code2,
  Folder,
  Activity,
  Cpu,
  Settings,
  Palette,
  Columns,
  HelpCircle,
  Search,
  Globe,
  Disc,
  Calculator,
  Gamepad2,
  Paintbrush,
  Lock,
  Camera,
  Moon,
  Sliders,
} from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { AppId, ThemeId } from "@/types/os";
import { playTactileClick } from "@/core/audio/soundEffects";

interface CommandItem {
  id: string;
  title: string;
  category: "Applications" | "System Tools" | "Themes" | "Actions";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    openWindow,
    toggleSplitDirection,
    setHotkeysModalOpen,
  } = useWindowStore();

  const {
    setTheme,
    lockDesktop,
    triggerScreenshot,
    toggleNightLight,
    setControlCenterOpen,
    soundEffects,
  } = useSystemStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Applications
    {
      id: "app-terminal",
      title: "Terminal (alacritty // zsh)",
      category: "Applications",
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      shortcut: "Super + Enter",
      action: () => openWindow("terminal"),
    },
    {
      id: "app-browser",
      title: "Zen Web Browser",
      category: "Applications",
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      shortcut: "Super + B",
      action: () => openWindow("browser"),
    },
    {
      id: "app-editor",
      title: "Neovim Code Editor",
      category: "Applications",
      icon: <Code2 className="w-4 h-4 text-purple-400" />,
      shortcut: "Super + E",
      action: () => openWindow("editor"),
    },
    {
      id: "app-agent",
      title: "Omarchy Autonomous Agent Hub",
      category: "Applications",
      icon: <Bot className="w-4 h-4 text-cyan-400" />,
      shortcut: "Super + A",
      action: () => openWindow("agent"),
    },
    {
      id: "app-files",
      title: "Files (Yazi File Manager)",
      category: "Applications",
      icon: <Folder className="w-4 h-4 text-amber-400" />,
      action: () => openWindow("files"),
    },
    {
      id: "app-player",
      title: "Lo-Fi Audio Station & Visualizer",
      category: "Applications",
      icon: <Disc className="w-4 h-4 text-purple-400" />,
      shortcut: "Super + M",
      action: () => openWindow("player"),
    },
    {
      id: "app-calc",
      title: "Programmer Calculator (HEX/DEC/BIN)",
      category: "Applications",
      icon: <Calculator className="w-4 h-4 text-amber-400" />,
      shortcut: "Super + C",
      action: () => openWindow("calculator"),
    },
    {
      id: "app-monitor",
      title: "System Monitor (btop)",
      category: "Applications",
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      action: () => openWindow("monitor"),
    },
    {
      id: "app-doom",
      title: "Retro WASM Arena (DOOM)",
      category: "Applications",
      icon: <Gamepad2 className="w-4 h-4 text-rose-400" />,
      action: () => openWindow("doom"),
    },
    {
      id: "app-paint",
      title: "Pixel Art Studio",
      category: "Applications",
      icon: <Paintbrush className="w-4 h-4 text-emerald-400" />,
      action: () => openWindow("paint"),
    },
    {
      id: "app-v86",
      title: "Alpine Linux Real x86 Kernel (v86 WASM)",
      category: "Applications",
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      action: () => openWindow("v86"),
    },
    {
      id: "app-settings",
      title: "Settings & System Preferences",
      category: "Applications",
      icon: <Settings className="w-4 h-4 text-slate-300" />,
      action: () => openWindow("settings"),
    },

    // System Tools & Actions
    {
      id: "action-lock",
      title: "Lock Desktop",
      category: "System Tools",
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      shortcut: "Super + L",
      action: () => lockDesktop(),
    },
    {
      id: "action-screenshot",
      title: "Take Screenshot",
      category: "System Tools",
      icon: <Camera className="w-4 h-4 text-cyan-400" />,
      shortcut: "Super + Shift + S",
      action: () => triggerScreenshot(),
    },
    {
      id: "action-settings-panel",
      title: "Toggle Quick Settings Control Center",
      category: "System Tools",
      icon: <Sliders className="w-4 h-4 text-emerald-400" />,
      action: () => setControlCenterOpen(true),
    },
    {
      id: "action-nightlight",
      title: "Toggle Night Light (Warm Mode)",
      category: "System Tools",
      icon: <Moon className="w-4 h-4 text-amber-400" />,
      action: () => toggleNightLight(),
    },
    {
      id: "action-split",
      title: "Toggle Window Tiling Split (H/V)",
      category: "Actions",
      icon: <Columns className="w-4 h-4 text-cyan-400" />,
      shortcut: "Super + V",
      action: () => toggleSplitDirection(),
    },
    {
      id: "action-hotkeys",
      title: "View All Keyboard Shortcuts",
      category: "Actions",
      icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
      shortcut: "Super + ?",
      action: () => setHotkeysModalOpen(true),
    },

    // Themes
    {
      id: "theme-omarchy",
      title: "Theme: Omarchy Charcoal (Default)",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-emerald-400" />,
      action: () => setTheme("omarchy"),
    },
    {
      id: "theme-tokyonight",
      title: "Theme: Tokyo Night",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-blue-400" />,
      action: () => setTheme("tokyonight"),
    },
    {
      id: "theme-catppuccin",
      title: "Theme: Catppuccin Mocha",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-purple-400" />,
      action: () => setTheme("catppuccin"),
    },
    {
      id: "theme-gruvbox",
      title: "Theme: Gruvbox Dark",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-amber-400" />,
      action: () => setTheme("gruvbox"),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setCommandPaletteOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      if (soundEffects) playTactileClick();
      filteredCommands[selectedIndex].action();
      setCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-[#0c0f18] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono-os text-xs animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#080912]">
          <Search className="w-4 h-4 text-emerald-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type an app name, theme, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder:text-slate-500 font-sans"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 text-slate-400 rounded">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-84 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No matching commands found</div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    if (soundEffects) playTactileClick();
                    cmd.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isSelected ? "text-slate-950" : ""}>{cmd.icon}</span>
                    <span>{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd
                      className={`px-1.5 py-0.5 text-[10px] rounded ${
                        isSelected ? "bg-black/20 text-slate-950" : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
