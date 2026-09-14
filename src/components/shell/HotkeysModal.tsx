"use client";

import React from "react";
import { X, Command, Keyboard } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";

export const HotkeysModal: React.FC = () => {
  const { isHotkeysModalOpen, setHotkeysModalOpen } = useWindowStore();

  if (!isHotkeysModalOpen) return null;

  const shortcutGroups = [
    {
      group: "Window & Tiling Controls",
      shortcuts: [
        { key: "Super + Enter", desc: "Open new Terminal window" },
        { key: "Super + Space / D", desc: "Open Application Launcher / Palette" },
        { key: "Super + Q", desc: "Close focused window" },
        { key: "Super + F", desc: "Toggle window maximize / fullscreen" },
        { key: "Super + V", desc: "Toggle split direction (Horizontal / Vertical)" },
        { key: "Super + Shift + Space", desc: "Toggle tiled vs floating window mode" },
      ],
    },
    {
      group: "Workspaces (Hyprland)",
      shortcuts: [
        { key: "Super + 1..5", desc: "Switch to Workspace 1 through 5" },
        { key: "Super + Shift + 1..5", desc: "Move active window to Workspace 1..5" },
      ],
    },
    {
      group: "Omarchy Core Apps",
      shortcuts: [
        { key: "Super + A", desc: "Open AI Agent Hub" },
        { key: "Super + E", desc: "Open Neovim Code Editor" },
        { key: "Super + ?", desc: "Open this Keybindings Cheat Sheet" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={() => setHotkeysModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-omarchy-900 border border-white/10 rounded-2xl shadow-2xl p-6 font-mono text-xs animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <Keyboard className="w-5 h-5 text-omarchy-accent" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Omarchy & Hyprland Keybindings
            </h2>
          </div>
          <button
            onClick={() => setHotkeysModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {shortcutGroups.map((grp) => (
            <div key={grp.group}>
              <h3 className="text-slate-400 font-semibold mb-2.5 uppercase text-[11px] tracking-wider text-omarchy-cyan">
                {grp.group}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {grp.shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between p-2 rounded-xl bg-omarchy-950/60 border border-white/5"
                  >
                    <span className="text-slate-300 mr-2">{sc.desc}</span>
                    <kbd className="px-2 py-0.5 rounded bg-white/10 text-omarchy-accent font-bold text-[11px] whitespace-nowrap shadow">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-slate-500 text-[11px]">
          <span>Note: On Mac keyboards, "Super" is the Command (⌘) key. On Windows/Linux, it is the Windows key.</span>
          <button
            onClick={() => setHotkeysModalOpen(false)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
