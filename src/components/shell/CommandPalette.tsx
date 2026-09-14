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
} from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { AppId, ThemeId } from "@/types/os";

interface CommandItem {
  id: string;
  title: string;
  category: "Applications" | "Themes" | "Actions";
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

  const { setTheme } = useSystemStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: "app-terminal",
      title: "Terminal (zsh)",
      category: "Applications",
      icon: <Terminal className="w-4 h-4 text-omarchy-accent" />,
      shortcut: "Super + Enter",
      action: () => openWindow("terminal"),
    },
    {
      id: "app-agent",
      title: "AI Agent Hub",
      category: "Applications",
      icon: <Bot className="w-4 h-4 text-omarchy-cyan" />,
      shortcut: "Super + A",
      action: () => openWindow("agent"),
    },
    {
      id: "app-editor",
      title: "Neovim Code Editor",
      category: "Applications",
      icon: <Code2 className="w-4 h-4 text-omarchy-violet" />,
      shortcut: "Super + E",
      action: () => openWindow("editor"),
    },
    {
      id: "app-files",
      title: "Files (File Manager)",
      category: "Applications",
      icon: <Folder className="w-4 h-4 text-amber-400" />,
      action: () => openWindow("files"),
    },
    {
      id: "app-monitor",
      title: "System Monitor (btop)",
      category: "Applications",
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      action: () => openWindow("monitor"),
    },
    {
      id: "app-v86",
      title: "Alpine Linux Real x86 Kernel (WASM VM)",
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
    // Themes
    {
      id: "theme-omarchy",
      title: "Theme: Omarchy Charcoal (Default)",
      category: "Themes",
      icon: <Palette className="w-4 h-4 text-omarchy-accent" />,
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
      icon: <Palette className="w-4 h-4 text-yellow-500" />,
      action: () => setTheme("gruvbox"),
    },
    // Actions
    {
      id: "action-split",
      title: "Toggle Window Tiling Split (H/V)",
      category: "Actions",
      icon: <Columns className="w-4 h-4 text-omarchy-cyan" />,
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
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
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
        className="w-full max-w-xl bg-omarchy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-omarchy-950/60">
          <Search className="w-4 h-4 text-omarchy-accent mr-3" />
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
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No matching commands found</div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isSelected
                      ? "bg-omarchy-accent text-omarchy-950 font-semibold"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isSelected ? "text-omarchy-950" : ""}>{cmd.icon}</span>
                    <span>{cmd.title}</span>
                  </div>
                  {cmd.shortcut && (
                    <kbd
                      className={`px-1.5 py-0.5 text-[10px] rounded ${
                        isSelected ? "bg-black/20 text-omarchy-950" : "bg-white/10 text-slate-400"
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
