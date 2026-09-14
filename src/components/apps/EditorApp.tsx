"use client";

import React, { useState, useEffect } from "react";
import { Folder, File, Save, Check, Code2, RefreshCw } from "lucide-react";
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
  const [isSaved, setIsSaved] = useState(true);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [filesList, setFilesList] = useState<string[]>([]);

  useEffect(() => {
    const loaded = readFile(currentPath);
    setContent(loaded !== null ? loaded : "// New file buffer\n");
    setIsSaved(true);

    const projectFiles = listDir("/home/user/projects") || [];
    setFilesList(projectFiles.map((f) => `/home/user/projects/${f.name}`));
  }, [currentPath, readFile, listDir]);

  const handleSave = () => {
    writeFile(currentPath, content);
    setIsSaved(true);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  };

  const lineCount = content.split("\n").length;

  return (
    <div className="flex h-full w-full bg-omarchy-950 font-mono text-xs text-slate-200">
      {/* File Tree Sidebar */}
      <div className="w-48 border-r border-white/5 bg-omarchy-900/60 flex flex-col select-none">
        <div className="px-3 py-2 border-b border-white/5 font-semibold text-slate-400 flex items-center justify-between text-[11px]">
          <span>FILES</span>
          <button
            onClick={() => {
              const projectFiles = listDir("/home/user/projects") || [];
              setFilesList(projectFiles.map((f) => `/home/user/projects/${f.name}`));
            }}
            className="p-1 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filesList.map((filePath) => {
            const fileName = filePath.split("/").pop();
            const isActive = currentPath === filePath;
            return (
              <button
                key={filePath}
                onClick={() => setCurrentPath(filePath)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-left truncate transition-colors ${
                  isActive
                    ? "bg-omarchy-violet/20 text-omarchy-violet font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <File className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{fileName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Tab Header & Save */}
        <div className="h-8 border-b border-white/5 bg-omarchy-900/80 flex items-center justify-between px-3 select-none">
          <div className="flex items-center space-x-2">
            <Code2 className="w-3.5 h-3.5 text-omarchy-violet" />
            <span className="font-semibold text-slate-200 truncate">
              {currentPath}
            </span>
            {!isSaved && (
              <span className="w-1.5 h-1.5 rounded-full bg-omarchy-amber" title="Unsaved changes" />
            )}
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              saveIndicator
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-white/10 hover:bg-white/20 text-slate-300"
            }`}
          >
            {saveIndicator ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                <span>Save (Ctrl+S)</span>
              </>
            )}
          </button>
        </div>

        {/* Text Area with Line Numbers */}
        <div className="flex-1 flex overflow-hidden relative bg-black/60">
          {/* Line Numbers */}
          <div className="py-3 px-2 text-right text-slate-600 select-none border-r border-white/5 font-mono text-xs w-10 flex-shrink-0">
            {Array.from({ length: Math.max(1, lineCount) }).map((_, idx) => (
              <div key={idx} className="leading-5">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsSaved(false);
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-5 outline-none resize-none border-none select-text overflow-auto focus:ring-0"
          />
        </div>

        {/* Neovim-style Status Line */}
        <div className="h-6 px-3 bg-omarchy-violet/10 border-t border-white/5 flex items-center justify-between text-[11px] font-mono select-none text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="px-1.5 py-0.5 rounded bg-omarchy-violet text-omarchy-950 font-bold text-[10px]">
              NORMAL
            </span>
            <span className="text-slate-300">{currentPath.split("/").pop()}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>utf-8</span>
            <span>javascript</span>
            <span>{lineCount}L</span>
          </div>
        </div>
      </div>
    </div>
  );
};
