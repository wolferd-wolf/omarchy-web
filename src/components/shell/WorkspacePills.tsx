"use client";

import React from "react";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { playWindowSwitch } from "@/core/audio/soundEffects";

export const WorkspacePills: React.FC = () => {
  const { activeWorkspaceId, windows, switchWorkspace } = useWindowStore();
  const { soundEffects } = useSystemStore();

  const getWindowCount = (wsId: number) => {
    return Object.values(windows).filter((w) => w.workspaceId === wsId).length;
  };

  const handleSwitch = (id: number) => {
    if (soundEffects) playWindowSwitch();
    switchWorkspace(id);
  };

  return (
    <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md waybar-module">
      {[1, 2, 3, 4, 5].map((id) => {
        const isActive = activeWorkspaceId === id;
        const count = getWindowCount(id);

        return (
          <button
            key={id}
            onClick={() => handleSwitch(id)}
            className={`relative flex items-center justify-center w-6 h-6 rounded text-xs font-mono-os transition-all duration-100 ${
              isActive
                ? "bg-emerald-400 text-slate-950 font-black shadow-sm"
                : count > 0
                ? "text-slate-200 hover:bg-white/10"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
            title={`Workspace ${id} (Super+${id})`}
          >
            <span>{id}</span>
            {count > 0 && !isActive && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cyan-400/80" />
            )}
          </button>
        );
      })}
    </div>
  );
};
