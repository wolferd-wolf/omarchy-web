"use client";

import React, { useState } from "react";
import {
  Palette,
  Sliders,
  Keyboard,
  Info,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Layout,
  ExternalLink,
  Shield,
  Monitor,
} from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { WALLPAPERS } from "../wm/wallpapers";
import { ThemeId } from "@/types/os";
import { playTactileClick } from "@/core/audio/soundEffects";

interface SettingsAppProps {
  windowId: string;
}

export const SettingsApp: React.FC<SettingsAppProps> = () => {
  const { theme, setTheme, soundEffects, toggleSoundEffects, volume, setVolume, isMuted, toggleMute } =
    useSystemStore();

  const [activeTab, setActiveTab] = useState<"appearance" | "hyprland" | "shortcuts" | "about">("appearance");

  const themes: { id: ThemeId; name: string; desc: string; colors: string[] }[] = [
    {
      id: "omarchy",
      name: "Omarchy Charcoal (Default)",
      desc: "Nordic obsidian with emerald and cyan neon gradient borders",
      colors: ["#06080e", "#101420", "#22c55e", "#06b6d4"],
    },
    {
      id: "tokyonight",
      name: "Tokyo Night",
      desc: "Deep indigo celebrating the neon lights of downtown Tokyo",
      colors: ["#0d0f18", "#1f2335", "#7aa2f7", "#bb9af7"],
    },
    {
      id: "catppuccin",
      name: "Catppuccin Mocha",
      desc: "Warm pastel palette tailored for developers and programmers",
      colors: ["#11111b", "#1e1e2e", "#cba6f7", "#89b4fa"],
    },
    {
      id: "gruvbox",
      name: "Gruvbox Dark",
      desc: "Retro groove with warm golden yellow and earthy tones",
      colors: ["#141617", "#282828", "#fabd2f", "#fe8019"],
    },
  ];

  const shortcuts = [
    { key: "Super + Enter", desc: "Open Terminal" },
    { key: "Super + Space / D", desc: "Application Launcher (Wofi)" },
    { key: "Super + A", desc: "AI Agent Daemon Hub" },
    { key: "Super + E", desc: "Neovim Code Editor" },
    { key: "Super + Q", desc: "Kill Active Window" },
    { key: "Super + F", desc: "Toggle Fullscreen / Maximize" },
    { key: "Super + V", desc: "Toggle Tiling Split (H/V)" },
    { key: "Super + Shift + Space", desc: "Toggle Float / Tiled Mode" },
    { key: "Super + 1..5", desc: "Switch Workspaces 1..5" },
    { key: "Right-Click Desktop", desc: "Quick Action Context Menu" },
  ];

  return (
    <div className="flex h-full w-full bg-[#080a10] font-mono-os text-xs text-slate-200 select-none overflow-hidden">
      {/* Settings Navigation Sidebar */}
      <div className="w-48 border-r border-white/[0.08] bg-[#0c0f18] flex flex-col py-3 px-2 space-y-1 flex-shrink-0">
        <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          Settings
        </div>

        <button
          onClick={() => {
            playTactileClick();
            setActiveTab("appearance");
          }}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[11px] transition-colors ${
            activeTab === "appearance"
              ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => {
            playTactileClick();
            setActiveTab("hyprland");
          }}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[11px] transition-colors ${
            activeTab === "hyprland"
              ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Compositor</span>
        </button>

        <button
          onClick={() => {
            playTactileClick();
            setActiveTab("shortcuts");
          }}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[11px] transition-colors ${
            activeTab === "shortcuts"
              ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Keybindings</span>
        </button>

        <button
          onClick={() => {
            playTactileClick();
            setActiveTab("about");
          }}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[11px] transition-colors ${
            activeTab === "about"
              ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>System Info</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-sm font-bold text-slate-100 mb-1">Color Themes</h2>
              <p className="text-[11px] text-slate-400 mb-3">
                Select your preferred desktop palette. Adjusts Waybar, Neovim, and window borders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {themes.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        playTactileClick();
                        setTheme(t.id);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                          : "border-white/[0.06] bg-[#0d101c] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-[11px]">{t.name}</span>
                        {isSelected && (
                          <span className="flex items-center text-emerald-400 text-[10px] font-bold">
                            <Check className="w-3 h-3 mr-0.5" /> ACTIVE
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-slate-400 my-2">{t.desc}</p>

                      <div className="flex space-x-1.5 mt-auto">
                        {t.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audio Feedback Toggle */}
            <div className="pt-4 border-t border-white/[0.08]">
              <h2 className="text-sm font-bold text-slate-100 mb-1">Audio & Tactile Effects</h2>
              <p className="text-[11px] text-slate-400 mb-3">
                Tactile synthesized mechanical clicks and window focus cues via Web Audio API.
              </p>

              <div className="p-3 rounded-xl bg-[#0d101c] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200 text-[11px]">Tactile Feedback Sounds</div>
                    <div className="text-[10px] text-slate-500">Play subtle sound on window switch and button click</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playTactileClick();
                    toggleSoundEffects();
                  }}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    soundEffects
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-white/10 text-slate-400 hover:bg-white/20"
                  }`}
                >
                  {soundEffects ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hyprland Compositor Tab */}
        {activeTab === "hyprland" && (
          <div className="space-y-5 max-w-xl">
            <div>
              <h2 className="text-sm font-bold text-slate-100 mb-1">Hyprland Compositor Tuning</h2>
              <p className="text-[11px] text-slate-400 mb-3">
                Parameters matching ~/.config/hypr/hyprland.conf
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0d101c] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200 text-[11px]">Binary-Split Tiling (BSP)</div>
                  <div className="text-[10px] text-slate-500">Automatic spiral window subdivision</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  dwindle
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d101c] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200 text-[11px]">Window Gaps</div>
                  <div className="text-[10px] text-slate-500">Inner gaps: 4px | Outer margins: 8px</div>
                </div>
                <span className="text-[10px] text-slate-300 font-mono">gaps_in=4 / gaps_out=8</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0d101c] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200 text-[11px]">Active Border Glow</div>
                  <div className="text-[10px] text-slate-500">Dual-gradient 45° angle animated outline</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                  45deg gradient
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Shortcuts Tab */}
        {activeTab === "shortcuts" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h2 className="text-sm font-bold text-slate-100 mb-1">Keyboard Shortcuts</h2>
              <p className="text-[11px] text-slate-400 mb-3">
                Super key is Command (⌘) on macOS or Windows key on PC.
              </p>
            </div>

            <div className="space-y-1.5">
              {shortcuts.map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0d101c] border border-white/[0.05] text-[11px]"
                >
                  <span className="text-slate-300">{sc.desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 text-emerald-400 font-bold text-[10px] shadow">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-5 max-w-xl">
            <div>
              <h2 className="text-sm font-bold text-slate-100 mb-1">Omarchy Web OS 4.0 (Quattro)</h2>
              <p className="text-[11px] text-slate-400">
                Inspired by David Heinemeier Hansson’s (DHH) Omarchy Linux distribution.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0d101c] border border-white/[0.06] space-y-3 text-[11px]">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Distribution</span>
                <span className="font-semibold text-slate-200">Arch Linux x86_64</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Compositor</span>
                <span className="font-semibold text-slate-200">Hyprland 0.44.1 (Wayland)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">Shell Bar</span>
                <span className="font-semibold text-slate-200">Quickshell 0.0.8</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-slate-400">WASM Kernel</span>
                <span className="font-semibold text-emerald-400">Alpine Linux 3.19 (v86)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Deployment</span>
                <span className="font-semibold text-cyan-400">Vercel Edge Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
