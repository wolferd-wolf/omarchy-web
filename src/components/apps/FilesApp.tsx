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
  LayoutList,
  LayoutGrid,
  HardDrive,
  Home,
  Code2,
  BookOpen,
  Settings2,
  Eye,
  Search,
} from "lucide-react";
import { useFSStore } from "@/store/fsStore";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { FileEntry } from "@/types/os";
import { playTactileClick } from "@/core/audio/soundEffects";

interface FilesAppProps {
  windowId: string;
}

export const FilesApp: React.FC<FilesAppProps> = () => {
  const { cwd, setCwd, listDir, createDir, writeFile, removeNode, resolvePath, readFile } =
    useFSStore();
  const { openWindow } = useWindowStore();
  const { soundEffects } = useSystemStore();

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null);
  const [newPrompt, setNewPrompt] = useState<"file" | "dir" | null>(null);
  const [newName, setNewName] = useState("");

  const entries: FileEntry[] = listDir(cwd) || [];
  const filteredEntries = entries.filter((e) =>
    e.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const pathParts = cwd.split("/").filter(Boolean);

  const handleNavigate = (path: string) => {
    if (soundEffects) playTactileClick();
    setCwd(path);
    setSelectedEntry(null);
  };

  const handleGoUp = () => {
    if (cwd === "/" || cwd === "") return;
    const parent = resolvePath("..", cwd);
    handleNavigate(parent);
  };

  const handleEntryClick = (entry: FileEntry) => {
    if (soundEffects) playTactileClick();
    setSelectedEntry(entry);
  };

  const handleEntryDoubleClick = (entry: FileEntry) => {
    if (soundEffects) playTactileClick();
    if (entry.type === "dir") {
      setCwd(`${cwd === "/" ? "" : cwd}/${entry.name}`);
      setSelectedEntry(null);
    } else {
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
    if (soundEffects) playTactileClick();
    const targetPath = `${cwd === "/" ? "" : cwd}/${name}`;
    removeNode(targetPath);
    if (selectedEntry?.name === name) {
      setSelectedEntry(null);
    }
  };

  const getFileIcon = (name: string, className = "w-4 h-4") => {
    if (name.endsWith(".rs")) return <Code2 className={`${className} text-orange-400`} />;
    if (name.endsWith(".js") || name.endsWith(".ts"))
      return <FileCode className={`${className} text-cyan-400`} />;
    if (name.endsWith(".py")) return <FileCode className={`${className} text-emerald-400`} />;
    if (name.endsWith(".conf") || name.endsWith(".toml") || name.endsWith(".json"))
      return <Settings2 className={`${className} text-purple-400`} />;
    if (name.endsWith(".md") || name.endsWith(".txt"))
      return <BookOpen className={`${className} text-blue-400`} />;
    return <FileText className={`${className} text-slate-400`} />;
  };

  const quickBookmarks = [
    { label: "Home", path: "/home/user", icon: <Home className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: "Projects", path: "/home/user/projects", icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: "Notes", path: "/home/user/notes", icon: <BookOpen className="w-3.5 h-3.5 text-blue-400" /> },
    { label: ".config", path: "/home/user/.config", icon: <Settings2 className="w-3.5 h-3.5 text-purple-400" /> },
    { label: "/etc", path: "/etc", icon: <Folder className="w-3.5 h-3.5 text-amber-400" /> },
    { label: "/ Root", path: "/", icon: <HardDrive className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  const totalBytes = entries.reduce((acc, e) => acc + e.size, 0);

  return (
    <div className="flex h-full w-full bg-[#080a10] font-mono-os text-xs text-slate-200 select-none overflow-hidden">
      {/* Places Sidebar */}
      <div className="w-48 border-r border-white/[0.08] bg-[#0b0e17] flex flex-col justify-between py-2 text-[11px] flex-shrink-0">
        <div>
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Bookmarks
          </div>
          <div className="space-y-0.5 px-1.5">
            {quickBookmarks.map((bm) => {
              const isCurrent = cwd === bm.path;
              return (
                <button
                  key={bm.path}
                  onClick={() => handleNavigate(bm.path)}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isCurrent
                      ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {bm.icon}
                  <span className="truncate">{bm.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Storage
          </div>
          <div className="px-3 space-y-2 text-[10px] text-slate-400">
            <div className="p-2 rounded-lg bg-black/30 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-300">nvme0n1p2</span>
                <span className="text-emerald-400 font-bold">13%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[13%]" />
              </div>
              <div className="text-[9px] text-slate-500 mt-1">448 GB free / 512 GB</div>
            </div>
          </div>
        </div>

        {/* Yazi Info */}
        <div className="px-3 pt-2 border-t border-white/[0.06] text-[10px] text-slate-500">
          <div>omarchy-files v4.0</div>
          <div className="text-[9px] text-slate-600">btrfs // zstd</div>
        </div>
      </div>

      {/* Main File Management Pane */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Navigation Toolbar */}
        <div className="h-9 px-3 border-b border-white/[0.08] bg-[#0e111d] flex items-center justify-between flex-shrink-0">
          {/* Breadcrumb Path Bar */}
          <div className="flex items-center space-x-1 text-slate-300 overflow-x-auto text-[11px]">
            <button
              onClick={handleGoUp}
              disabled={cwd === "/"}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 mr-1"
              title="Parent directory (Backspace)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleNavigate("/")}
              className="hover:text-emerald-400 transition-colors font-semibold"
            >
              /
            </button>

            {pathParts.map((part, idx) => {
              const currentSubPath = "/" + pathParts.slice(0, idx + 1).join("/");
              const isLast = idx === pathParts.length - 1;
              return (
                <React.Fragment key={currentSubPath}>
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  <button
                    onClick={() => handleNavigate(currentSubPath)}
                    className={`hover:text-emerald-400 transition-colors ${
                      isLast ? "font-bold text-emerald-400" : "text-slate-300"
                    }`}
                  >
                    {part}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Action Bar & Mode Switcher */}
          <div className="flex items-center space-x-2">
            {/* Filter Search */}
            <div className="relative flex items-center">
              <Search className="w-3 h-3 text-slate-500 absolute left-2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter..."
                className="w-24 focus:w-36 transition-all bg-black/40 border border-white/10 rounded-md pl-6 pr-2 py-0.5 text-[11px] text-slate-200 placeholder:text-slate-600 outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              onClick={() => setNewPrompt("file")}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-white/[0.06] hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 transition-colors"
              title="New File"
            >
              <FilePlus className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">File</span>
            </button>

            <button
              onClick={() => setNewPrompt("dir")}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-white/[0.06] hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 transition-colors"
              title="New Folder"
            >
              <FolderPlus className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Dir</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex rounded bg-black/40 p-0.5 border border-white/[0.08]">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded ${viewMode === "list" ? "bg-white/20 text-white" : "text-slate-500 hover:text-slate-300"}`}
                title="Table List View"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${viewMode === "grid" ? "bg-white/20 text-white" : "text-slate-500 hover:text-slate-300"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Inline Create Input */}
        {newPrompt && (
          <form
            onSubmit={handleCreate}
            className="p-2 border-b border-white/[0.08] bg-[#121626] flex items-center space-x-2"
          >
            <span className="text-slate-400 text-[11px]">
              Create {newPrompt === "dir" ? "Directory" : "File"}:
            </span>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Enter ${newPrompt} name...`}
              autoFocus
              className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white focus:outline-none flex-1 text-xs font-mono-os"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded text-[11px]"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setNewPrompt(null)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-slate-300 text-[11px]"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Main Content Area: Detailed List or Grid */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredEntries.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No files in this directory
            </div>
          ) : viewMode === "list" ? (
            /* High-Craft Detailed Table View */
            <table className="w-full text-left text-[11px] tabular-nums border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-500 font-semibold select-none">
                  <th className="pb-1.5 pl-2 font-normal">NAME</th>
                  <th className="pb-1.5 font-normal">PERMISSIONS</th>
                  <th className="pb-1.5 font-normal text-right pr-4">SIZE</th>
                  <th className="pb-1.5 font-normal">MODIFIED</th>
                  <th className="pb-1.5 text-right pr-2 font-normal">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredEntries.map((entry) => {
                  const isDir = entry.type === "dir";
                  const isSelected = selectedEntry?.name === entry.name;
                  const dateStr = new Date(entry.modified).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr
                      key={entry.name}
                      onClick={() => handleEntryClick(entry)}
                      onDoubleClick={() => handleEntryDoubleClick(entry)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-emerald-500/15 text-white"
                          : "hover:bg-white/[0.04] text-slate-300"
                      }`}
                    >
                      <td className="py-1.5 pl-2 flex items-center space-x-2 truncate max-w-[240px]">
                        {isDir ? (
                          <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          getFileIcon(entry.name)
                        )}
                        <span className={`truncate ${isDir ? "font-semibold text-slate-100" : ""}`}>
                          {entry.name}
                        </span>
                      </td>
                      <td className="py-1.5 text-slate-500 font-mono-os text-[10px]">
                        {isDir ? "drwxr-xr-x" : "-rw-r--r--"}
                      </td>
                      <td className="py-1.5 text-right pr-4 text-slate-400">
                        {isDir ? "4.0 KB" : `${entry.size} B`}
                      </td>
                      <td className="py-1.5 text-slate-500 text-[10px]">{dateStr}</td>
                      <td className="py-1.5 text-right pr-2">
                        <button
                          onClick={(e) => handleDelete(entry.name, e)}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete file"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredEntries.map((entry) => {
                const isDir = entry.type === "dir";
                const isSelected = selectedEntry?.name === entry.name;
                return (
                  <div
                    key={entry.name}
                    onClick={() => handleEntryClick(entry)}
                    onDoubleClick={() => handleEntryDoubleClick(entry)}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer relative group ${
                      isSelected
                        ? "border-emerald-500/40 bg-emerald-500/10 shadow-md"
                        : "border-white/[0.05] bg-[#0c0f1a] hover:bg-white/[0.04] hover:border-white/20"
                    }`}
                  >
                    <div className="mb-2">
                      {isDir ? (
                        <Folder className="w-8 h-8 text-amber-400 group-hover:scale-105 transition-transform" />
                      ) : (
                        getFileIcon(entry.name, "w-8 h-8")
                      )}
                    </div>
                    <span className="text-center font-medium text-slate-200 truncate w-full text-[11px]">
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {isDir ? "dir" : `${entry.size} B`}
                    </span>
                    <button
                      onClick={(e) => handleDelete(entry.name, e)}
                      className="absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Telemetry Status Bar */}
        <div className="h-6 px-3 border-t border-white/[0.08] bg-[#0b0d17] flex items-center justify-between text-[10px] text-slate-500 tabular-nums flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span>{filteredEntries.length} items</span>
            <span>•</span>
            <span>Total: {totalBytes > 1024 ? `${(totalBytes / 1024).toFixed(1)} KB` : `${totalBytes} B`}</span>
            {selectedEntry && (
              <>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Selected: {selectedEntry.name}</span>
              </>
            )}
          </div>
          <div>Btrfs zstd // Read-Write</div>
        </div>
      </div>
    </div>
  );
};
