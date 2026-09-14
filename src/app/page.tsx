"use client";

import React, { useEffect, useRef } from "react";
import { QuickShellBar } from "@/components/shell/QuickShellBar";
import { Desktop } from "@/components/wm/Desktop";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { HotkeysModal } from "@/components/shell/HotkeysModal";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { playTactileClick, playWindowSwitch } from "@/core/audio/soundEffects";

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

  const { soundEffects } = useSystemStore();
  const initializedRef = useRef(false);

  // Initialize startup layout (Terminal + Neovim tiled side by side on Workspace 1)
  useEffect(() => {
    if (!initializedRef.current && Object.keys(windows).length === 0) {
      initializedRef.current = true;
      openWindow("terminal", "alacritty // zsh");
      openWindow("editor", "Neovim - main.rs", { filePath: "/home/user/projects/main.rs" });
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
        if (soundEffects) playTactileClick();
        setCommandPaletteOpen(!isCommandPaletteOpen);
        return;
      }

      // Super + Enter: Terminal
      if (isSuper && e.key === "Enter") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        openWindow("terminal", "alacritty // zsh");
        return;
      }

      // Super + A: Agent Hub
      if (isSuper && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        openWindow("agent", "omarchy-agent daemon");
        return;
      }

      // Super + E: Editor
      if (isSuper && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        openWindow("editor", "Neovim - main.rs", { filePath: "/home/user/projects/main.rs" });
        return;
      }

      // Super + Q: Close active window
      if (isSuper && e.key.toLowerCase() === "q") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        if (focusedWindowId) {
          closeWindow(focusedWindowId);
        }
        return;
      }

      // Super + F: Fullscreen / Maximize
      if (isSuper && e.key.toLowerCase() === "f") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        if (focusedWindowId) {
          toggleMaximize(focusedWindowId);
        }
        return;
      }

      // Super + V: Toggle Split direction
      if (isSuper && e.key.toLowerCase() === "v") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        toggleSplitDirection();
        return;
      }

      // Super + Shift + Space: Toggle Floating
      if (isSuper && e.shiftKey && e.code === "Space") {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        if (focusedWindowId) {
          toggleFloating(focusedWindowId);
        }
        return;
      }

      // Super + ? / / : Hotkeys modal
      if (isSuper && (e.key === "?" || e.key === "/")) {
        e.preventDefault();
        if (soundEffects) playTactileClick();
        setHotkeysModalOpen(!isHotkeysModalOpen);
        return;
      }

      // Super + 1..5: Switch Workspace
      if (isSuper && !e.shiftKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        if (soundEffects) playWindowSwitch();
        switchWorkspace(parseInt(e.key, 10));
        return;
      }

      // Super + Shift + 1..5: Move Window to Workspace
      if (isSuper && e.shiftKey && ["1", "2", "3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        if (soundEffects) playWindowSwitch();
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
    soundEffects,
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
    <div className="flex flex-col w-screen h-screen overflow-hidden select-none bg-[#06080e] font-sans">
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
