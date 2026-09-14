"use client";

import React, { useState } from "react";
import {
  Folder,
  File,
  ChevronRight,
  ArrowUp,
  FileCode,
  FileText,
  Trash2,
  FolderPlus,
  FilePlus,
} from "lucide-react";
import { useFSStore } from "@/store/fsStore";
import { useWindowStore } from "@/store/windowStore";
import { FileEntry } from "@/types/os";

interface FilesAppProps {
  windowId: string;
}

export const FilesApp: React.FC<FilesAppProps> = () => {
  const { cwd, setCwd, listDir, createDir, writeFile, removeNode, resolvePath } =
    useFSStore();
  const { openWindow } = useWindowStore();

  const [newPrompt, setNewPrompt] = useState<"file" | "dir" | null>(null);
  const [newName, setNewName] = useState("");

  const entries: FileEntry[] = listDir(cwd) || [];
  const pathParts = cwd.split("/").filter(Boolean);

  const handleNavigate = (path: string) => {
    setCwd(path);
  };

  const handleGoUp = () => {
    if (cwd === "/" || cwd === "") return;
    const parent = resolvePath("..", cwd);
    setCwd(parent);
  };

  const handleEntryClick = (entry: FileEntry) => {
    if (entry.type === "dir") {
      setCwd(`${cwd === "/" ? "" : cwd}/${entry.name}`);
    } else {
      // Open file in Editor
      const fullPath = `${cwd === "/" ? "" : cwd}/${entry.name}`;
      openWindow("editor", `Neovim - ${entry.name}`, { filePath: fullPath });
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrompt) return;
    const targetPath = `${cwd === "/" ? "" : cwd}/${newName.trim()}`;

    if (newPrompt === "dir") {
      createDir(targetPath);
    } else {
      writeFile(targetPath, "");
    }

    setNewName("");
    setNewPrompt(null);
  };

  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetPath = `${cwd === "/" ? "" : cwd}/${name}`;
    removeNode(targetPath);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".py")) {
      return <FileCode className="w-5 h-5 text-omarchy-cyan" />;
    }
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="flex flex-col h-full w-full bg-omarchy-950 font-mono text-xs select-none">
      {/* Navigation Toolbar */}
      <div className="h-9 px-3 border-b border-white/5 bg-omarchy-900/60 flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-1 overflow-x-auto text-slate-300">
          <button
            onClick={handleGoUp}
            disabled={cwd === "/"}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 mr-1"
            title="Go to parent directory"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleNavigate("/")}
            className="hover:text-white transition-colors"
          >
            root
          </button>

          {pathParts.map((part, idx) => {
            const currentSubPath = "/" + pathParts.slice(0, idx + 1).join("/");
            return (
              <React.Fragment key={currentSubPath}>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <button
                  onClick={() => handleNavigate(currentSubPath)}
                  className={`hover:text-white transition-colors ${
                    idx === pathParts.length - 1 ? "font-bold text-omarchy-accent" : ""
                  }`}
                >
                  {part}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Create buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setNewPrompt("file")}
            className="flex items-center space-x-1 px-2 py-1 rounded-md quickshell-pill hover:bg-white/10 text-slate-300"
            title="Create File"
          >
            <FilePlus className="w-3.5 h-3.5 text-omarchy-cyan" />
            <span className="hidden sm:inline">New File</span>
          </button>

          <button
            onClick={() => setNewPrompt("dir")}
            className="flex items-center space-x-1 px-2 py-1 rounded-md quickshell-pill hover:bg-white/10 text-slate-300"
            title="Create Directory"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">New Folder</span>
          </button>
        </div>
      </div>

      {/* Creation Modal / Inline input */}
      {newPrompt && (
        <form
          onSubmit={handleCreate}
          className="p-2 border-b border-white/10 bg-omarchy-900/90 flex items-center space-x-2"
        >
          <span className="text-slate-400">
            Create {newPrompt === "dir" ? "Directory" : "File"}:
          </span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Enter ${newPrompt} name...`}
            autoFocus
            className="px-2 py-1 rounded bg-black/50 border border-white/20 text-white focus:outline-none flex-1 text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-omarchy-accent text-omarchy-950 font-bold rounded"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setNewPrompt(null)}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-slate-300"
          >
            Cancel
          </button>
        </form>
      )}

      {/* File Explorer Grid */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-max">
        {entries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Empty directory
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.name}
              onDoubleClick={() => handleEntryClick(entry)}
              className="flex flex-col items-center p-3 rounded-xl border border-white/5 hover:border-omarchy-accent/40 bg-omarchy-900/40 hover:bg-white/5 transition-all cursor-pointer group relative"
            >
              <div className="mb-2">
                {entry.type === "dir" ? (
                  <Folder className="w-8 h-8 text-amber-400 fill-amber-400/20 group-hover:scale-105 transition-transform" />
                ) : (
                  getFileIcon(entry.name)
                )}
              </div>

              <span className="text-center font-medium text-slate-200 truncate w-full group-hover:text-omarchy-accent">
                {entry.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {entry.type === "dir" ? "folder" : `${entry.size}B`}
              </span>

              {/* Delete hover button */}
              <button
                onClick={(e) => handleDelete(entry.name, e)}
                className="absolute top-1.5 right-1.5 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
