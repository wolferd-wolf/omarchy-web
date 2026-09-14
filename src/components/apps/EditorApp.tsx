"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Folder,
  File,
  FileCode,
  FileText,
  Save,
  Check,
  Code2,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useFSStore } from "@/store/fsStore";

interface EditorAppProps {
  windowId: string;
  customProps?: {
    filePath?: string;
  };
}

export const EditorApp: React.FC<EditorAppProps> = ({ customProps }) => {
  const { readFile, writeFile, listDir } = useFSStore();

  const [currentPath, setCurrentPath] = useState<string>(
    customProps?.filePath || "/home/user/projects/demo.js"
  );
  const [content, setContent] = useState<string>("");
  const [isModified, setIsModified] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [commandNotice, setCommandNotice] = useState("");
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [cursorPos, setCursorPos] = useState({ row: 1, col: 1 });
  const [projectFiles, setProjectFiles] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loaded = readFile(currentPath);
    setContent(loaded !== null ? loaded : "// New buffer\n");
    setIsModified(false);

    const files = listDir("/home/user/projects") || [];
    setProjectFiles(files.map((f) => `/home/user/projects/${f.name}`));
  }, [currentPath, readFile, listDir]);

  const saveFile = () => {
    writeFile(currentPath, content);
    setIsModified(false);
    setCommandNotice(`"${currentPath}" ${content.split("\n").length}L, ${content.length}B written`);
    setTimeout(() => setCommandNotice(""), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveFile();
    }
    updateCursorPosition();
  };

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const val = textareaRef.current.value.substring(0, pos);
    const lines = val.split("\n");
    const row = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ row, col });
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    setCommandInput("");

    if (cmd === ":w" || cmd === ":write") {
      saveFile();
    } else if (cmd === ":q" || cmd === ":quit") {
      setCommandNotice("Buffer closed.");
    } else if (cmd === ":wq") {
      saveFile();
      setCommandNotice("Saved and quit.");
    } else if (cmd === ":help") {
      setCommandNotice("Neovim Commands: :w (write), :q (quit), :wq (write & quit)");
    } else {
      setCommandNotice(`Not an editor command: ${cmd}`);
    }
  };

  const lineCount = content.split("\n").length;
  const fileName = currentPath.split("/").pop() || "buffer";

  return (
    <div className="flex h-full w-full bg-[#0c0e15] font-mono-os text-xs text-slate-200 select-none">
      {/* Neo-tree Sidebar */}
      {treeExpanded && (
        <div className="w-52 border-r border-white/[0.08] bg-[#090b10] flex flex-col select-none">
          <div className="h-8 px-3 border-b border-white/[0.06] flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div className="flex items-center space-x-1">
              <ChevronDown className="w-3.5 h-3.5 text-omarchy-accent" />
              <span>EXPLORER</span>
            </div>
            <button
              onClick={() => {
                const files = listDir("/home/user/projects") || [];
                setProjectFiles(files.map((f) => `/home/user/projects/${f.name}`));
              }}
              className="p-1 hover:text-white"
              title="Refresh tree"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-[11px]">
            <div className="flex items-center space-x-1.5 px-2 py-1 text-slate-500 font-semibold uppercase text-[10px]">
              <span>~/projects</span>
            </div>

            {projectFiles.map((filePath) => {
              const fileBase = filePath.split("/").pop();
              const isSelected = currentPath === filePath;
              const isJs = fileBase?.endsWith(".js") || fileBase?.endsWith(".ts");
              const isPy = fileBase?.endsWith(".py");

              return (
                <button
                  key={filePath}
                  onClick={() => setCurrentPath(filePath)}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1 rounded text-left truncate transition-colors ${
                    isSelected
                      ? "bg-omarchy-violet/20 text-omarchy-violet font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {isJs ? (
                    <FileCode className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  ) : isPy ? (
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{fileBase}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor Buffer Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Buffer Tabs Header */}
        <div className="h-7 border-b border-white/[0.08] bg-[#090a10] flex items-center justify-between px-2 text-[11px]">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#121624] border-t border-omarchy-violet text-slate-100 font-medium rounded-t">
              <Code2 className="w-3 h-3 text-omarchy-violet" />
              <span>{fileName}</span>
              {isModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </div>
          </div>

          <button
            onClick={saveFile}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px]"
            title="Save Buffer (Ctrl+S or :w)"
          >
            <Save className="w-3 h-3" />
            <span>:w</span>
          </button>
        </div>

        {/* Text Area with Line Number Gutter */}
        <div className="flex-1 flex overflow-hidden relative bg-[#07090e]">
          {/* Gutter */}
          <div className="py-2 px-2 text-right text-slate-600 select-none border-r border-white/[0.05] text-xs w-10 flex-shrink-0 font-mono-os">
            {Array.from({ length: Math.max(1, lineCount) }).map((_, idx) => (
              <div
                key={idx}
                className={`leading-5 ${
                  idx + 1 === cursorPos.row ? "text-amber-400 font-bold" : ""
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Actual Editable Buffer */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsModified(true);
            }}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 p-2 bg-transparent text-slate-100 font-mono-os text-xs leading-5 outline-none resize-none border-none select-text overflow-auto focus:ring-0"
          />
        </div>

        {/* Lualine Status Bar */}
        <div className="h-6 px-2 bg-[#121626] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono-os text-slate-400 select-none">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.2 rounded bg-omarchy-violet text-omarchy-950 font-black text-[10px]">
              NORMAL
            </span>
            <span className="text-slate-300 font-medium">{fileName}</span>
            {isModified && <span className="text-amber-400 text-[10px]">[+]</span>}
          </div>

          <div className="flex items-center space-x-3 text-[10px] tabular-nums">
            <span>utf-8</span>
            <span>javascript</span>
            <span>
              {cursorPos.row}:{cursorPos.col}
            </span>
            <span className="text-slate-500">
              {Math.round((cursorPos.row / Math.max(1, lineCount)) * 100)}%
            </span>
          </div>
        </div>

        {/* Neovim Bottom Command Prompt Line */}
        <div className="h-6 px-2 bg-[#08090f] flex items-center text-xs font-mono-os border-t border-white/[0.04]">
          {commandNotice ? (
            <span className="text-emerald-400 text-[11px] font-medium animate-fade-in">
              {commandNotice}
            </span>
          ) : (
            <form onSubmit={handleCommandSubmit} className="w-full flex items-center">
              <span className="text-slate-500 mr-1">:</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="type :w to save, :help for commands"
                className="flex-1 bg-transparent border-none outline-none text-slate-300 font-mono-os text-[11px] p-0 focus:ring-0 placeholder:text-slate-700"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
