export type AppId =
  | "terminal"
  | "agent"
  | "editor"
  | "files"
  | "monitor"
  | "settings"
  | "v86"
  | "browser"
  | "player"
  | "calculator"
  | "doom"
  | "paint";

export type SplitDirection = "horizontal" | "vertical";

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  workspaceId: number; // 1 to 5
  isFloating: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  floatingRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  customProps?: Record<string, any>;
}

export type TilingNode =
  | {
      type: "window";
      id: string; // windowId
      flex: number;
    }
  | {
      type: "split";
      id: string;
      direction: SplitDirection;
      flex: number;
      children: TilingNode[];
    };

export interface Workspace {
  id: number;
  name: string;
  tilingRoot: TilingNode | null;
  activeWindowId: string | null;
}

export interface FileEntry {
  name: string;
  type: "file" | "dir";
  content?: string;
  size: number;
  modified: number; // timestamp
  children?: Record<string, FileEntry>;
}

export interface VirtualProcess {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: "running" | "sleeping" | "idle";
  startedAt: number;
}

export interface AgentMessage {
  id: string;
  sender: "user" | "agent" | "system";
  content: string;
  timestamp: number;
  toolCall?: {
    name: string;
    args: Record<string, any>;
    result?: string;
  };
}

export type ThemeId = "omarchy" | "tokyonight" | "catppuccin" | "gruvbox";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: "info" | "success" | "warning" | "agent";
  icon?: string;
}
