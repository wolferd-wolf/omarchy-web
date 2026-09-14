"use client";

import React from "react";
import { useWindowStore } from "@/store/windowStore";

export const WorkspacePills: React.FC = () => {
  const { workspaces, activeWorkspaceId, windows, switchWorkspace } = useWindowStore();

  const getWindowCount = (wsId: number) => {
    return Object.values(windows).filter((w) => w.workspaceId === wsId).length;
  };

  return (
    <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full quickshell-pill">
      {[1, 2, 3, 4, 5].map((id) => {
        const isActive = activeWorkspaceId === id;
        const count = getWindowCount(id);

        return (
          <button
            key={id}
            onClick={() => switchWorkspace(id)}
            className={`relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-medium transition-all duration-150 ${
              isActive
                ? "bg-omarchy-accent text-omarchy-950 font-bold shadow-lg shadow-omarchy-accent/30 scale-105"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
            title={`Workspace ${id} (Super+${id})`}
          >
            <span>{id}</span>
            {count > 0 && !isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-omarchy-cyan" />
            )}
          </button>
        );
      })}
    </div>
  );
};
