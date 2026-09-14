"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShellInterpreter } from "@/core/shell/Interpreter";
import { useFSStore } from "@/store/fsStore";

interface TerminalLine {
  id: string;
  type: "input" | "output";
  prompt?: string;
  text: string;
  error?: boolean;
}

interface TerminalAppProps {
  windowId: string;
}

// Simple ANSI color code parser to styled HTML spans
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
      else if (part.includes("34m")) currentColor = "text-blue-400";
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
  const interpreterRef = useRef<ShellInterpreter | null>(null);

  if (!interpreterRef.current) {
    interpreterRef.current = new ShellInterpreter();
  }

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "line-welcome",
      type: "output",
      text: "⚡ Omarchy Web OS 4.0 (zsh 5.9)\nType 'omafetch' for system info, or 'help' for available commands.\n",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const getPrompt = () => {
    const displayCwd = cwd === "/home/user" ? "~" : cwd.replace("/home/user", "~");
    return `user@omarchy:${displayCwd}$`;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = inputVal;
      const currentPrompt = getPrompt();

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
          prompt: currentPrompt,
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
        .map((f) => f.name)
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
      className="w-full h-full p-3 font-terminal text-xs text-slate-200 overflow-y-auto bg-black/85 select-text cursor-text"
    >
      {lines.map((line) => (
        <div key={line.id} className="mb-1 leading-relaxed">
          {line.type === "input" ? (
            <div className="flex items-center space-x-2">
              <span className="text-omarchy-accent font-bold">{line.prompt}</span>
              <span className="text-slate-100">{line.text}</span>
            </div>
          ) : (
            <div
              className={`whitespace-pre-wrap ${
                line.error ? "text-rose-400" : "text-slate-300"
              }`}
            >
              {parseAnsi(line.text)}
            </div>
          )}
        </div>
      ))}

      {/* Input line */}
      <div className="flex items-center space-x-2">
        <span className="text-omarchy-accent font-bold select-none">{getPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent border-none outline-none text-slate-100 font-terminal text-xs p-0 focus:ring-0"
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
};
