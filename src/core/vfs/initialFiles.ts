import { FileEntry } from "@/types/os";

export const initialFileSystem: Record<string, FileEntry> = {
  home: {
    name: "home",
    type: "dir",
    size: 4096,
    modified: Date.now(),
    children: {
      user: {
        name: "user",
        type: "dir",
        size: 4096,
        modified: Date.now(),
        children: {
          "welcome.md": {
            name: "welcome.md",
            type: "file",
            size: 850,
            modified: Date.now(),
            content: `# Welcome to Omarchy Web OS ⚡
The opinionated, keyboard-first, agent-ready Web Operating System.

### ⌨️ Essential Keyboard Shortcuts:
- Super + Enter: Launch Terminal
- Super + Space (or Super + D): Application Launcher / Command Palette
- Super + A: Launch AI Agent Hub
- Super + E: Open Neovim Code Editor
- Super + Q: Close active window
- Super + F: Toggle Fullscreen / Maximize
- Super + V: Toggle Tiling Split Direction (Horizontal / Vertical)
- Super + 1..5: Switch Workspaces

### 🤖 Agent-First Philosophy:
Omarchy is built for the Age of AI Agents. Open the Agent Hub (Super + A) or run \`agent\` in the terminal to dispatch tasks, generate code, and automate your workflows.

### 🐧 Real Kernel in Browser:
Click the "v86 Real Linux VM" in the launcher to boot an actual 32-bit x86 Linux kernel in WebAssembly!
`,
          },
          ".bashrc": {
            name: ".bashrc",
            type: "file",
            size: 180,
            modified: Date.now(),
            content: `export PS1="\\[\\033[38;5;48m\\]user@omarchy\\[\\033[0m\\]:\\[\\033[38;5;45m\\]\\w\\[\\033[0m\\]$ "
alias ll="ls -la"
alias agent="open agent"
alias fetch="omafetch"
`,
          },
          projects: {
            name: "projects",
            type: "dir",
            size: 4096,
            modified: Date.now(),
            children: {
              "demo.js": {
                name: "demo.js",
                type: "file",
                size: 240,
                modified: Date.now(),
                content: `// Welcome to Omarchy Web OS
function greet(name = "Agentic Engineer") {
  console.log(\`⚡ Omarchy Web OS running for \${name}!\`);
  return { status: "ready", model: "hyprland-tiling", kernel: "v86-wasm" };
}

greet();
`,
              },
              "agent_workflow.py": {
                name: "agent_workflow.py",
                type: "file",
                size: 320,
                modified: Date.now(),
                content: `"""
Omarchy Autonomous Agent Script
"""
import sys

def main():
    print("[Agent] Initializing autonomous loop...")
    print("[Agent] Connecting to Quickshell IPC...")
    print("[Agent] Status: 100% operational in browser.")

if __name__ == "__main__":
    main()
`,
              },
            },
          },
          notes: {
            name: "notes",
            type: "dir",
            size: 4096,
            modified: Date.now(),
            children: {
              "todo.txt": {
                name: "todo.txt",
                type: "file",
                size: 150,
                modified: Date.now(),
                content: `- Test Hyprland tiling window manager
- Try the real x86 Linux kernel (v86)
- Run AI Agent coding assistant
- Deploy custom workspace to Vercel
`,
              },
            },
          },
        },
      },
    },
  },
  etc: {
    name: "etc",
    type: "dir",
    size: 4096,
    modified: Date.now(),
    children: {
      "os-release": {
        name: "os-release",
        type: "file",
        size: 210,
        modified: Date.now(),
        content: `NAME="Omarchy Web"
VERSION="4.0 (Quattro)"
ID=omarchy
PRETTY_NAME="Omarchy Web OS 4.0 Quattro"
HOME_URL="https://omarchy.org"
SUPPORT_URL="https://github.com/wolferd-wolf/omarchy-web"
`,
      },
      "hostname": {
        name: "hostname",
        type: "file",
        size: 8,
        modified: Date.now(),
        content: "omarchy\n",
      },
    },
  },
  bin: {
    name: "bin",
    type: "dir",
    size: 4096,
    modified: Date.now(),
    children: {
      help: { name: "help", type: "file", size: 100, modified: Date.now(), content: "#!/bin/sh\nbuiltin help\n" },
      ls: { name: "ls", type: "file", size: 100, modified: Date.now(), content: "#!/bin/sh\nbuiltin ls\n" },
      cat: { name: "cat", type: "file", size: 100, modified: Date.now(), content: "#!/bin/sh\nbuiltin cat\n" },
      omafetch: { name: "omafetch", type: "file", size: 100, modified: Date.now(), content: "#!/bin/sh\nbuiltin omafetch\n" },
    },
  },
};
