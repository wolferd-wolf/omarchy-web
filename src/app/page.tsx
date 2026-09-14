"use client";

import React, { useEffect, useRef } from "react";
import { QuickShellBar } from "@/components/shell/QuickShellBar";
import { Desktop } from "@/components/wm/Desktop";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { HotkeysModal } from "@/components/shell/HotkeysModal";
import { useWindowStore } from "@/store/windowStore";

export default function Home() {
  const {
    openWindow,
    closeWindow,
    toggleMaximize,
    toggleFloating,
    toggleSplitDirection,
    switchWorkspace,
    moveWindowToWorkspace,
    focusedWindowId,
    setCommandPaletteOpen,
    setHotkeysModalOpen,
    isCommandPaletteOpen,
    isHotkeysModalOpen,
    windows,
  } = useWindowStore();

  const initializedRef = useRef(false);

  // Initialize startup layout (Terminal + Agent Hub tiled side by side)
  useEffect(() => {
    if (!initializedRef.current && Object.keys(windows).length === 0) {
      initializedRef.current = true;
      // Launch initial developer apps on Workspace 1
      openWindow("terminal", "Terminal (zsh)");
      openWindow("agent", "Omarchy Agent ⚡");
    }
  }, [openWindow, windows]);

  // Global Keyboard Shortcuts (Hyprland / Omarchy defaults)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Super key (Meta on Mac, or Windows key on PC, or Alt as fallback)
      const isSuper = e.metaKey || e.altKey || (e.ctrlKey && e.shiftKey);

      // Super + Space or Super + D: Launcher
      if (isSuper && (e.code === "Space" || e.key.toLowerCase() === "d")) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      // Super + Enter: Terminal
      if (isSuper && e.key === "Enter") {
        e.preventDefault();
        openWindow("terminal");
        return;
      }

      // Super + A: Agent Hub
      if (isSuper && e.key.toLowerCase() === "a") {
        e.preventDefault();
        openWindow("agent");
        return;
      }

      // Super + E: Editor
      if (isSuper && e.key.toLowerCase() === "e") {
        e.preventDefault();
        openWindow("editor");
        return;
      }

      // Super + Q: Close active window
      if (isSuper && e.key.toLowerCase() === "q") {
        e.preventDefault();
        if (focusedWindowId) {
          closeWindow(focusedWindowId);
        }
        return;
      }

      // Super + F: Fullscreen / Maximize
      if (isSuper && e.key.toLowerCase() === "f") {
        e.preventDefault();
        if (focusedWindowId) {
          toggleMaximize(focusedWindowId);
        }
        return;
      }

      // Super + V: Toggle Split direction
      if (isSuper && e.key.toLowerCase() === "v") {
        e.preventDefault();
        toggleSplitDirection();
        return;
      }

      // Super + Shift + Space: Toggle Floating
      if (isSuper && e.shiftKey && e.code === "Space") {
        e.preventDefault();
        if (focusedWindowId) {
          toggleFloating(focusedWindowId);
        }
        return;
      }

      // Super + ? / / : Hotkeys modal
      if (isSuper && (e.key === "?" || e.key === "/")) {
        e.preventDefault();
        setHotkeysModalOpen(!isHotkeysModalOpen);
        return;
      }

      // Super + 1..5: Switch Workspace
      if (isSuper && !e.shiftKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        switchWorkspace(parseInt(e.key, 10));
        return;
      }

      // Super + Shift + 1..5: Move Window to Workspace
      if (isSuper && e.shiftKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        if (focusedWindowId) {
          moveWindowToWorkspace(focusedWindowId, parseInt(e.key, 10));
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isHotkeysModalOpen,
    focusedWindowId,
    openWindow,
    closeWindow,
    toggleMaximize,
    toggleFloating,
    toggleSplitDirection,
    switchWorkspace,
    moveWindowToWorkspace,
    setCommandPaletteOpen,
    setHotkeysModalOpen,
  ]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden select-none bg-omarchy-950 font-sans">
      {/* Top Quickshell Bar */}
      <QuickShellBar />

      {/* Tiling Desktop Canvas */}
      <Desktop />

      {/* Global Modals */}
      <CommandPalette />
      <HotkeysModal />
    </div>
  );
}
