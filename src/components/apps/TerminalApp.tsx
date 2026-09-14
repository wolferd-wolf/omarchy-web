"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShellInterpreter } from "@/core/shell/Interpreter";
import { useFSStore } from "@/store/fsStore";
import { useSystemStore } from "@/store/systemStore";
import { playKeyTick } from "@/core/audio/soundEffects";

interface TerminalLine {
  id: string;
  type: "input" | "output";
  cwd?: string;
  gitBranch?: string;
  text: string;
  error?: boolean;
}

interface TerminalAppProps {
  windowId: string;
}

const INITIAL_BANNER = `Last login: Mon Sep 14 13:42:01 2026 on tty1
Omarchy Linux 6.12.8-arch1-1-omarchy (x86_64)

\x1b[38;5;48m       /\\
\x1b[38;5;48m      /  \\         \x1b[1;38;5;48mOMARCHY LINUX 4.0\x1b[0m (Quattro)
\x1b[38;5;45m     / /\\ \\        \x1b[38;5;245m-----------------------\x1b[0m
\x1b[38;5;45m    / /__\\ \\       \x1b[1;38;5;45mOS:\x1b[0m Arch Linux x86_64
\x1b[38;5;141m   / /____\\ \\      \x1b[1;38;5;45mHost:\x1b[0m Hyprland Wayland Compositor
\x1b[38;5;141m  /_/      \\_\\     \x1b[1;38;5;141mKernel:\x1b[0m 6.12.8-arch1-1-omarchy
\x1b[38;5;141m                   \x1b[1;38;5;141mShell:\x1b[0m zsh 5.9 (x86_64-pc-linux-gnu)
                   \x1b[1;38;5;48mWM:\x1b[0m Hyprland v0.44.1 (Tiling BSP)
                   \x1b[1;38;5;45mTerminal:\x1b[0m alacritty
                   \x1b[1;38;5;141mMemory:\x1b[0m 5920MiB / 32098MiB (18%)

Type 'help' for commands, 'pacman -Syu' to upgrade, or 'open <app>' to launch.
`;

function parseAnsi(text: string): React.ReactNode[] {
  const parts = text.split(/(\x1b\[[0-9;]*m)/g);
  let currentColor = "";
  let isBold = false;

  return parts.map((part, index) => {
    if (part.startsWith("\x1b[")) {
      if (part === "\x1b[0m") {
        currentColor = "";
        isBold = false;
      } else if (part.includes("1;")) {
        isBold = true;
      }
      if (part.includes("38;5;48m")) currentColor = "text-emerald-400";
      else if (part.includes("38;5;45m")) currentColor = "text-cyan-400";
      else if (part.includes("38;5;141m")) currentColor = "text-purple-400";
      else if (part.includes("38;5;245m")) currentColor = "text-slate-500";
      else if (part.includes("34m")) currentColor = "text-blue-400 font-semibold";
      else if (part.includes("33m")) currentColor = "text-amber-400 font-mono";
      else if (part.includes("31m")) currentColor = "text-rose-400";
      return null;
    }

    if (!part) return null;

    return (
      <span
        key={index}
        className={`${currentColor} ${isBold ? "font-bold" : ""}`}
      >
        {part}
      </span>
    );
  }).filter(Boolean);
}

export const TerminalApp: React.FC<TerminalAppProps> = () => {
  const { cwd, listDir } = useFSStore();
  const { soundEffects } = useSystemStore();
  const interpreterRef = useRef<ShellInterpreter | null>(null);

  if (!interpreterRef.current) {
    interpreterRef.current = new ShellInterpreter();
  }

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "init-1",
      type: "output",
      text: INITIAL_BANNER,
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const getDisplayCwd = (path: string) => {
    return path === "/home/user" ? "~" : path.replace("/home/user", "~");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (soundEffects && e.key.length === 1) {
      playKeyTick();
    }

    if (e.key === "Enter") {
      const cmd = inputVal;
      const currentCwd = cwd;

      if (cmd.trim() === "clear") {
        setLines([]);
        setInputVal("");
        setHistoryIndex(-1);
        return;
      }

      const newLines: TerminalLine[] = [
        ...lines,
        {
          id: `in-${Date.now()}`,
          type: "input",
          cwd: currentCwd,
          gitBranch: "main",
          text: cmd,
        },
      ];

      if (cmd.trim()) {
        const res = interpreterRef.current!.execute(cmd);
        if (res.output) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: "output",
            text: res.output,
            error: res.error,
          });
        }
      }

      setLines(newLines);
      setInputVal("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const history = interpreterRef.current!.getHistory();
      if (history.length === 0) return;

      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const history = interpreterRef.current!.getHistory();
      if (historyIndex === -1) return;

      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = inputVal.split(" ");
      const lastWord = parts[parts.length - 1];
      if (!lastWord) return;

      const files = listDir(cwd) || [];
      const matches = files
        .map((f) => (f.type === "dir" ? `${f.name}/` : f.name))
        .filter((name) => name.startsWith(lastWord));

      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setInputVal(parts.join(" "));
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full h-full p-3 font-mono-os text-xs text-slate-200 overflow-y-auto bg-[#07090f]/95 select-text cursor-text relative"
    >
      {/* Subtle CRT scanline overlay */}
      <div className="absolute inset-0 w-full h-full crt-scanlines pointer-events-none opacity-40" />

      {lines.map((line) => (
        <div key={line.id} className="mb-1.5 leading-relaxed relative z-10">
          {line.type === "input" ? (
            <div>
              {/* Starship-style two-line prompt */}
              <div className="flex items-center space-x-1.5 text-[11px]">
                <span className="text-slate-500">╭─</span>
                <span className="text-emerald-400 font-semibold">user@omarchy</span>
                <span className="text-slate-600">:</span>
                <span className="text-cyan-400 font-medium">{getDisplayCwd(line.cwd || "/home/user")}</span>
                <span className="text-purple-400 font-medium">({line.gitBranch || "main"})</span>
              </div>
              <div className="flex items-center space-x-2 pl-3">
                <span className="text-emerald-400 font-bold">╰─❯</span>
                <span className="text-slate-100 font-medium">{line.text}</span>
              </div>
            </div>
          ) : (
            <div
              className={`whitespace-pre-wrap pl-3 ${
                line.error ? "text-rose-400" : "text-slate-300"
              }`}
            >
              {parseAnsi(line.text)}
            </div>
          )}
        </div>
      ))}

      {/* Active Input Line */}
      <div className="relative z-10">
        <div className="flex items-center space-x-1.5 text-[11px] select-none">
          <span className="text-slate-500">╭─</span>
          <span className="text-emerald-400 font-semibold">user@omarchy</span>
          <span className="text-slate-600">:</span>
          <span className="text-cyan-400 font-medium">{getDisplayCwd(cwd)}</span>
          <span className="text-purple-400 font-medium">(main)</span>
        </div>
        <div className="flex items-center space-x-2 pl-3">
          <span className="text-emerald-400 font-bold select-none">╰─❯</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono-os text-xs p-0 focus:ring-0"
          />
        </div>
      </div>

      <div ref={bottomRef} />
    </div>
  );
};
