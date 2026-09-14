import { create } from "zustand";
import { FileEntry } from "@/types/os";
import { initialFileSystem } from "@/core/vfs/initialFiles";

interface FSState {
  root: Record<string, FileEntry>;
  cwd: string;

  // Actions
  setCwd: (path: string) => void;
  resolvePath: (inputPath: string, relativeTo?: string) => string;
  getNode: (absolutePath: string) => FileEntry | null;
  listDir: (absolutePath: string) => FileEntry[] | null;
  readFile: (absolutePath: string) => string | null;
  writeFile: (absolutePath: string, content: string) => boolean;
  createDir: (absolutePath: string) => boolean;
  removeNode: (absolutePath: string) => boolean;
}

const STORAGE_KEY = "omarchy_vfs_v1";

function loadSavedFS(): Record<string, FileEntry> {
  if (typeof window === "undefined") return initialFileSystem;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to load saved VFS:", e);
  }
  return initialFileSystem;
}

function persistFS(root: Record<string, FileEntry>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
  } catch (e) {
    console.error("Failed to persist VFS:", e);
  }
}

function cleanPathParts(pathStr: string): string[] {
  return pathStr.split("/").filter((p) => p.length > 0 && p !== ".");
}

export const useFSStore = create<FSState>((set, get) => ({
  root: loadSavedFS(),
  cwd: "/home/user",

  setCwd: (path) => {
    const abs = get().resolvePath(path);
    const node = get().getNode(abs);
    if (node && node.type === "dir") {
      set({ cwd: abs });
    }
  },

  resolvePath: (inputPath, relativeTo) => {
    const base = relativeTo || get().cwd;
    if (inputPath.startsWith("/")) {
      const parts = cleanPathParts(inputPath);
      const stack: string[] = [];
      for (const p of parts) {
        if (p === "..") {
          stack.pop();
        } else {
          stack.push(p);
        }
      }
      return "/" + stack.join("/");
    }

    const baseParts = cleanPathParts(base);
    const inputParts = cleanPathParts(inputPath);
    const stack = [...baseParts];

    for (const p of inputParts) {
      if (p === "..") {
        stack.pop();
      } else {
        stack.push(p);
      }
    }

    return "/" + stack.join("/");
  },

  getNode: (absolutePath) => {
    const { root } = get();
    const parts = cleanPathParts(absolutePath);
    if (parts.length === 0) {
      return { name: "/", type: "dir", size: 4096, modified: Date.now(), children: root };
    }

    let current: FileEntry | undefined;
    let currentChildren = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!currentChildren || !currentChildren[part]) {
        return null;
      }
      current = currentChildren[part];
      if (i < parts.length - 1) {
        if (current.type !== "dir" || !current.children) {
          return null;
        }
        currentChildren = current.children;
      }
    }

    return current || null;
  },

  listDir: (absolutePath) => {
    const node = get().getNode(absolutePath);
    if (!node || node.type !== "dir" || !node.children) return null;
    return Object.values(node.children);
  },

  readFile: (absolutePath) => {
    const node = get().getNode(absolutePath);
    if (!node || node.type !== "file") return null;
    return node.content || "";
  },

  writeFile: (absolutePath, content) => {
    const { root } = get();
    const parts = cleanPathParts(absolutePath);
    if (parts.length === 0) return false;

    const fileName = parts[parts.length - 1];
    const parentParts = parts.slice(0, -1);

    const newRoot = JSON.parse(JSON.stringify(root));
    let curr = newRoot;

    for (const p of parentParts) {
      if (!curr[p] || curr[p].type !== "dir") return false;
      if (!curr[p].children) curr[p].children = {};
      curr = curr[p].children;
    }

    curr[fileName] = {
      name: fileName,
      type: "file",
      content,
      size: new Blob([content]).size,
      modified: Date.now(),
    };

    set({ root: newRoot });
    persistFS(newRoot);
    return true;
  },

  createDir: (absolutePath) => {
    const { root } = get();
    const parts = cleanPathParts(absolutePath);
    if (parts.length === 0) return false;

    const dirName = parts[parts.length - 1];
    const parentParts = parts.slice(0, -1);

    const newRoot = JSON.parse(JSON.stringify(root));
    let curr = newRoot;

    for (const p of parentParts) {
      if (!curr[p] || curr[p].type !== "dir") return false;
      if (!curr[p].children) curr[p].children = {};
      curr = curr[p].children;
    }

    if (curr[dirName]) return false; // Already exists

    curr[dirName] = {
      name: dirName,
      type: "dir",
      size: 4096,
      modified: Date.now(),
      children: {},
    };

    set({ root: newRoot });
    persistFS(newRoot);
    return true;
  },

  removeNode: (absolutePath) => {
    const { root } = get();
    const parts = cleanPathParts(absolutePath);
    if (parts.length === 0) return false;

    const targetName = parts[parts.length - 1];
    const parentParts = parts.slice(0, -1);

    const newRoot = JSON.parse(JSON.stringify(root));
    let curr = newRoot;

    for (const p of parentParts) {
      if (!curr[p] || curr[p].type !== "dir" || !curr[p].children) return false;
      curr = curr[p].children;
    }

    if (!curr[targetName]) return false;

    delete curr[targetName];
    set({ root: newRoot });
    persistFS(newRoot);
    return true;
  },
}));
