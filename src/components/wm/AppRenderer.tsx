"use client";

import React from "react";
import { WindowInstance } from "@/types/os";
import { TerminalApp } from "../apps/TerminalApp";
import { AgentApp } from "../apps/AgentApp";
import { EditorApp } from "../apps/EditorApp";
import { FilesApp } from "../apps/FilesApp";
import { MonitorApp } from "../apps/MonitorApp";
import { SettingsApp } from "../apps/SettingsApp";
import { V86App } from "../apps/V86App";

interface AppRendererProps {
  window: WindowInstance;
}

export const AppRenderer: React.FC<AppRendererProps> = ({ window: win }) => {
  switch (win.appId) {
    case "terminal":
      return <TerminalApp windowId={win.id} />;
    case "agent":
      return <AgentApp windowId={win.id} />;
    case "editor":
      return <EditorApp windowId={win.id} customProps={win.customProps} />;
    case "files":
      return <FilesApp windowId={win.id} />;
    case "monitor":
      return <MonitorApp windowId={win.id} />;
    case "settings":
      return <SettingsApp windowId={win.id} />;
    case "v86":
      return <V86App windowId={win.id} />;
    default:
      return (
        <div className="p-4 text-slate-400 font-mono text-xs">
          Application {win.appId} not found.
        </div>
      );
  }
};
