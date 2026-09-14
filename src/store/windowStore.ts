import { create } from "zustand";
import { AppId, SplitDirection, TilingNode, WindowInstance, Workspace } from "@/types/os";

interface WindowState {
  workspaces: Record<number, Workspace>;
  activeWorkspaceId: number;
  windows: Record<string, WindowInstance>;
  focusedWindowId: string | null;
  defaultSplitDirection: SplitDirection;
  isCommandPaletteOpen: boolean;
  isHotkeysModalOpen: boolean;

  // Actions
  openWindow: (appId: AppId, title?: string, customProps?: Record<string, any>) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  switchWorkspace: (workspaceId: number) => void;
  moveWindowToWorkspace: (windowId: string, targetWorkspaceId: number) => void;
  toggleSplitDirection: () => void;
  toggleFloating: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateFloatingRect: (id: string, rect: Partial<WindowInstance["floatingRect"]>) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setHotkeysModalOpen: (open: boolean) => void;
}

const APP_METADATA: Record<AppId, { title: string; defaultWidth: number; defaultHeight: number }> = {
  terminal: { title: "Terminal (zsh)", defaultWidth: 720, defaultHeight: 480 },
  agent: { title: "Agent Hub ⚡", defaultWidth: 680, defaultHeight: 560 },
  editor: { title: "Neovim", defaultWidth: 800, defaultHeight: 540 },
  files: { title: "Files (Yazi)", defaultWidth: 680, defaultHeight: 460 },
  monitor: { title: "System Monitor (btop)", defaultWidth: 700, defaultHeight: 450 },
  settings: { title: "Settings & Themes", defaultWidth: 560, defaultHeight: 440 },
  v86: { title: "Alpine Linux x86 (WASM VM)", defaultWidth: 720, defaultHeight: 480 },
  browser: { title: "Zen Browser", defaultWidth: 860, defaultHeight: 560 },
  player: { title: "Lo-Fi Audio Station", defaultWidth: 520, defaultHeight: 400 },
  calculator: { title: "Programmer Calculator", defaultWidth: 360, defaultHeight: 480 },
  doom: { title: "Retro WASM Arena", defaultWidth: 640, defaultHeight: 460 },
  paint: { title: "Pixel Studio", defaultWidth: 660, defaultHeight: 480 },
};

function insertTilingNode(
  root: TilingNode | null,
  newWindowId: string,
  direction: SplitDirection
): TilingNode {
  if (!root) {
    return { type: "window", id: newWindowId, flex: 1 };
  }

  if (root.type === "window") {
    return {
      type: "split",
      id: `split-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      direction,
      flex: 1,
      children: [
        { ...root, flex: 1 },
        { type: "window", id: newWindowId, flex: 1 },
      ],
    };
  }

  // If root is a split, append or drill down to the active child
  return {
    ...root,
    children: [...root.children, { type: "window", id: newWindowId, flex: 1 }],
  };
}

function removeTilingNode(root: TilingNode | null, windowId: string): TilingNode | null {
  if (!root) return null;

  if (root.type === "window") {
    return root.id === windowId ? null : root;
  }

  const updatedChildren = root.children
    .map((c) => removeTilingNode(c, windowId))
    .filter((c): c is TilingNode => c !== null);

  if (updatedChildren.length === 0) return null;
  if (updatedChildren.length === 1) return updatedChildren[0];

  return {
    ...root,
    children: updatedChildren,
  };
}

const initialWorkspaces: Record<number, Workspace> = {
  1: { id: 1, name: "1", tilingRoot: null, activeWindowId: null },
  2: { id: 2, name: "2", tilingRoot: null, activeWindowId: null },
  3: { id: 3, name: "3", tilingRoot: null, activeWindowId: null },
  4: { id: 4, name: "4", tilingRoot: null, activeWindowId: null },
  5: { id: 5, name: "5", tilingRoot: null, activeWindowId: null },
};

export const useWindowStore = create<WindowState>((set, get) => ({
  workspaces: initialWorkspaces,
  activeWorkspaceId: 1,
  windows: {},
  focusedWindowId: null,
  defaultSplitDirection: "horizontal",
  isCommandPaletteOpen: false,
  isHotkeysModalOpen: false,

  openWindow: (appId, customTitle, customProps) => {
    const id = `win-${appId}-${Date.now()}`;
    const meta = APP_METADATA[appId];
    const { activeWorkspaceId, workspaces, windows, defaultSplitDirection } = get();
    const currentWs = workspaces[activeWorkspaceId];

    const newWindow: WindowInstance = {
      id,
      appId,
      title: customTitle || meta.title,
      workspaceId: activeWorkspaceId,
      isFloating: false,
      isMaximized: false,
      isMinimized: false,
      floatingRect: {
        x: Math.max(40, 80 + Object.keys(windows).length * 25),
        y: Math.max(50, 70 + Object.keys(windows).length * 25),
        width: meta.defaultWidth,
        height: meta.defaultHeight,
      },
      customProps,
    };

    const newTilingRoot = insertTilingNode(currentWs.tilingRoot, id, defaultSplitDirection);

    set({
      windows: { ...windows, [id]: newWindow },
      focusedWindowId: id,
      workspaces: {
        ...workspaces,
        [activeWorkspaceId]: {
          ...currentWs,
          tilingRoot: newTilingRoot,
          activeWindowId: id,
        },
      },
      isCommandPaletteOpen: false,
    });

    return id;
  },

  closeWindow: (id) => {
    const { windows, workspaces, focusedWindowId } = get();
    const win = windows[id];
    if (!win) return;

    const ws = workspaces[win.workspaceId];
    const newTilingRoot = removeTilingNode(ws.tilingRoot, id);

    const newWindows = { ...windows };
    delete newWindows[id];

    // Pick new focused window in workspace
    const remainingInWs = Object.values(newWindows).filter((w) => w.workspaceId === win.workspaceId);
    const nextFocused = remainingInWs.length > 0 ? remainingInWs[remainingInWs.length - 1].id : null;

    set({
      windows: newWindows,
      focusedWindowId: focusedWindowId === id ? nextFocused : focusedWindowId,
      workspaces: {
        ...workspaces,
        [win.workspaceId]: {
          ...ws,
          tilingRoot: newTilingRoot,
          activeWindowId: nextFocused,
        },
      },
    });
  },

  focusWindow: (id) => {
    const { windows, workspaces } = get();
    const win = windows[id];
    if (!win) return;

    set({
      focusedWindowId: id,
      activeWorkspaceId: win.workspaceId,
      workspaces: {
        ...workspaces,
        [win.workspaceId]: {
          ...workspaces[win.workspaceId],
          activeWindowId: id,
        },
      },
    });
  },

  switchWorkspace: (workspaceId) => {
    const { workspaces } = get();
    if (!workspaces[workspaceId]) return;

    const ws = workspaces[workspaceId];
    set({
      activeWorkspaceId: workspaceId,
      focusedWindowId: ws.activeWindowId,
    });
  },

  moveWindowToWorkspace: (windowId, targetWorkspaceId) => {
    const { windows, workspaces, defaultSplitDirection } = get();
    const win = windows[windowId];
    if (!win || win.workspaceId === targetWorkspaceId) return;

    const srcWs = workspaces[win.workspaceId];
    const dstWs = workspaces[targetWorkspaceId];

    const newSrcRoot = removeTilingNode(srcWs.tilingRoot, windowId);
    const newDstRoot = insertTilingNode(dstWs.tilingRoot, windowId, defaultSplitDirection);

    set({
      windows: {
        ...windows,
        [windowId]: { ...win, workspaceId: targetWorkspaceId },
      },
      workspaces: {
        ...workspaces,
        [win.workspaceId]: { ...srcWs, tilingRoot: newSrcRoot, activeWindowId: null },
        [targetWorkspaceId]: { ...dstWs, tilingRoot: newDstRoot, activeWindowId: windowId },
      },
      activeWorkspaceId: targetWorkspaceId,
      focusedWindowId: windowId,
    });
  },

  toggleSplitDirection: () => {
    set((state) => ({
      defaultSplitDirection: state.defaultSplitDirection === "horizontal" ? "vertical" : "horizontal",
    }));
  },

  toggleFloating: (id) => {
    const { windows, workspaces, defaultSplitDirection } = get();
    const win = windows[id];
    if (!win) return;

    const ws = workspaces[win.workspaceId];
    const willFloat = !win.isFloating;

    let newRoot = ws.tilingRoot;
    if (willFloat) {
      newRoot = removeTilingNode(ws.tilingRoot, id);
    } else {
      newRoot = insertTilingNode(ws.tilingRoot, id, defaultSplitDirection);
    }

    set({
      windows: {
        ...windows,
        [id]: { ...win, isFloating: willFloat, isMaximized: false },
      },
      workspaces: {
        ...workspaces,
        [win.workspaceId]: { ...ws, tilingRoot: newRoot },
      },
    });
  },

  toggleMaximize: (id) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;

    set({
      windows: {
        ...windows,
        [id]: { ...win, isMaximized: !win.isMaximized },
      },
    });
  },

  updateFloatingRect: (id, rect) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          floatingRect: { ...win.floatingRect, ...rect },
        },
      },
    });
  },

  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setHotkeysModalOpen: (open) => set({ isHotkeysModalOpen: open }),
}));
