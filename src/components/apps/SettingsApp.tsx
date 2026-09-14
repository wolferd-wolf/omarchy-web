"use client";

import React from "react";
import { Palette, Layers, Terminal, Sparkles, ExternalLink, Check } from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { ThemeId } from "@/types/os";

interface SettingsAppProps {
  windowId: string;
}

export const SettingsApp: React.FC<SettingsAppProps> = () => {
  const { theme, setTheme } = useSystemStore();

  const themes: { id: ThemeId; name: string; desc: string; colors: string[] }[] = [
    {
      id: "omarchy",
      name: "Omarchy Charcoal",
      desc: "Default DHH & Omarchy dark aesthetic with emerald and cyan neon highlights",
      colors: ["#0a0c13", "#161b2c", "#22c55e", "#06b6d4"],
    },
    {
      id: "tokyonight",
      name: "Tokyo Night",
      desc: "Calm dark blue theme celebrating the lights of downtown Tokyo",
      colors: ["#1a1b26", "#24283b", "#7aa2f7", "#bb9af7"],
    },
    {
      id: "catppuccin",
      name: "Catppuccin Mocha",
      desc: "Warm and cozy pastel palette tailored for developers",
      colors: ["#1e1e2e", "#313244", "#cba6f7", "#89b4fa"],
    },
    {
      id: "gruvbox",
      name: "Gruvbox Dark",
      desc: "Retro groove with warm golden yellow and earthy accents",
      colors: ["#1d2021", "#3c3836", "#fabd2f", "#fe8019"],
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-omarchy-950 font-sans text-xs text-slate-200 select-none overflow-y-auto p-4 space-y-6">
      {/* Themes Section */}
      <div>
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-100 mb-3">
          <Palette className="w-4 h-4 text-omarchy-accent" />
          <span>Desktop Themes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {themes.map((t) => {
            const isSelected = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-omarchy-accent bg-omarchy-900 shadow-lg shadow-omarchy-accent/10"
                    : "border-white/5 bg-omarchy-900/40 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{t.name}</span>
                  {isSelected && (
                    <span className="flex items-center text-omarchy-accent text-[11px] font-medium">
                      <Check className="w-3.5 h-3.5 mr-1" /> Active
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 mt-1 mb-3">
                  {t.desc}
                </p>

                {/* Color swatches */}
                <div className="flex space-x-1.5 mt-auto">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-100 mb-3">
          <Sparkles className="w-4 h-4 text-omarchy-cyan" />
          <span>About Omarchy Web OS</span>
        </div>

        <div className="p-4 rounded-xl bg-omarchy-900/60 border border-white/5 space-y-2 text-slate-300 leading-relaxed text-[11px]">
          <p>
            <strong>Omarchy Web OS 4.0 (Quattro)</strong> is an in-browser operating system inspired by David Heinemeier Hansson’s (DHH) Omarchy Linux distribution.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Compositor:</strong> Hyprland-inspired dynamic binary-split tiling window manager</li>
            <li><strong>Desktop Shell:</strong> Quickshell top bar with live metrics, workspaces 1..5, and search</li>
            <li><strong>AI Agent:</strong> Integrated autonomous coding assistant with direct virtual disk access</li>
            <li><strong>Kernel:</strong> Dual-mode (instant POSIX shell + v86 real x86 Linux WebAssembly VM)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
