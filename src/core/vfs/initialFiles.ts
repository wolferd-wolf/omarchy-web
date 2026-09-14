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
            size: 890,
            modified: Date.now(),
            content: `# Welcome to Omarchy Web OS ⚡
The opinionated, keyboard-first, agent-ready Web Operating System.

### ⌨️ Hyprland Keyboard Shortcuts:
- Super + Enter: Launch Starship Terminal (zsh)
- Super + Space (or Super + D): Application Launcher / Wofi Palette
- Super + A: Launch Omarchy Autonomous Agent Hub
- Super + E: Open Neovim Code Editor
- Super + Q: Close active window
- Super + F: Toggle Fullscreen / Maximize
- Super + V: Toggle Tiling Split Direction (Horizontal / Vertical)
- Super + Shift + Space: Toggle Tiled vs Floating window
- Super + 1..5: Switch Workspaces (1 through 5)

### 🐧 Dual-Kernel Architecture:
1. Native POSIX Web Shell with live disk I/O, tree, grep, and omafetch.
2. Real 32-bit x86 Linux Kernel (v86 WebAssembly JIT) with Alpine Linux 3.19!

### ⚙️ Dotfiles:
Inspect ~/.config/hypr/hyprland.conf, ~/.config/nvim/init.lua, and ~/.config/starship.toml.
`,
          },
          ".bashrc": {
            name: ".bashrc",
            type: "file",
            size: 240,
            modified: Date.now(),
            content: `export PS1="\\[\\033[38;5;48m\\]user@omarchy\\[\\033[0m\\]:\\[\\033[38;5;45m\\]\\w\\[\\033[0m\\]$ "
export EDITOR="nvim"
export VISUAL="nvim"
alias ll="ls -la"
alias agent="open agent"
alias fetch="omafetch"
alias nvim="open editor"
alias v86="open v86"
`,
          },
          ".config": {
            name: ".config",
            type: "dir",
            size: 4096,
            modified: Date.now(),
            children: {
              hypr: {
                name: "hypr",
                type: "dir",
                size: 4096,
                modified: Date.now(),
                children: {
                  "hyprland.conf": {
                    name: "hyprland.conf",
                    type: "file",
                    size: 980,
                    modified: Date.now(),
                    content: `# Omarchy Linux 4.0 Hyprland Config
monitor=,preferred,auto,1

exec-once = quickshell --ipc
exec-once = omarchy-agent --daemon
exec-once = pipewire

input {
    kb_layout = us
    follow_mouse = 1
    sensitivity = 0
}

general {
    gaps_in = 4
    gaps_out = 8
    border_size = 2
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    col.inactive_border = rgba(59595988)
    layout = dwindle
}

decoration {
    rounding = 8
    blur {
        enabled = true
        size = 8
        passes = 2
    }
}

$mainMod = SUPER
bind = $mainMod, Return, exec, alacritty
bind = $mainMod, Space, exec, rofi
bind = $mainMod, Q, killactive,
bind = $mainMod, F, fullscreen, 0
bind = $mainMod, V, togglefloating,
bind = $mainMod, A, exec, omarchy-agent
bind = $mainMod, E, exec, nvim
`,
                  },
                },
              },
              nvim: {
                name: "nvim",
                type: "dir",
                size: 4096,
                modified: Date.now(),
                children: {
                  "init.lua": {
                    name: "init.lua",
                    type: "file",
                    size: 460,
                    modified: Date.now(),
                    content: `-- Neovim 0.10 config for Omarchy
vim.opt.number = true
vim.opt.relativenumber = false
vim.opt.expandtab = true
vim.opt.shiftwidth = 2
vim.opt.tabstop = 2
vim.opt.termguicolors = true

-- Keymaps
vim.g.mapleader = " "
vim.keymap.set("n", "<leader>w", ":w<CR>")
vim.keymap.set("n", "<leader>q", ":q<CR>")
vim.keymap.set("n", "<leader>e", ":Neotree toggle<CR>")
`,
                  },
                },
              },
              starship: {
                name: "starship",
                type: "dir",
                size: 4096,
                modified: Date.now(),
                children: {
                  "starship.toml": {
                    name: "starship.toml",
                    type: "file",
                    size: 320,
                    modified: Date.now(),
                    content: `format = """
[╭─ user@omarchy](bold green) [$directory](bold cyan)[$git_branch](bold purple)
[╰─❯ ](bold green)"""

[directory]
truncation_length = 3
truncation_symbol = "…/"

[git_branch]
symbol = " "
style = "bold purple"
`,
                  },
                },
              },
            },
          },
          projects: {
            name: "projects",
            type: "dir",
            size: 4096,
            modified: Date.now(),
            children: {
              "main.rs": {
                name: "main.rs",
                type: "file",
                size: 450,
                modified: Date.now(),
                content: `//! Omarchy Web Kernel Dispatcher
use std::collections::HashMap;

#[derive(Debug)]
pub struct Process {
    pid: u32,
    name: String,
    threads: u8,
}

fn main() {
    println!("⚡ Omarchy Linux 4.0 (Quattro) Initialized");
    let mut processes = HashMap::new();
    processes.insert(104, Process { pid: 104, name: "hyprland".into(), threads: 4 });
    processes.insert(210, Process { pid: 210, name: "omarchy-agent".into(), threads: 8 });
    println!("Active daemons: {:#?}", processes);
}
`,
              },
              "demo.js": {
                name: "demo.js",
                type: "file",
                size: 310,
                modified: Date.now(),
                content: `// Omarchy Agent Orchestrator
import { Client } from "@omarchy/ipc";

export async function bootstrap() {
  console.log("⚡ Bootstrapping agent workspace...");
  const ipc = new Client({ socket: "/run/quickshell.sock" });
  await ipc.connect();
  console.log("Connected to compositor bus.");
}

bootstrap();
`,
              },
              "agent_workflow.py": {
                name: "agent_workflow.py",
                type: "file",
                size: 360,
                modified: Date.now(),
                content: `"""
Omarchy Autonomous Agent Script
"""
import sys
import time

def main():
    print("[Agent] Initializing autonomous loop...")
    print("[Agent] Connecting to Quickshell IPC socket...")
    time.sleep(0.1)
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
                size: 210,
                modified: Date.now(),
                content: `[x] Implement Hyprland binary-split tiling compositor
[x] Build Quickshell floating Waybar status panel
[x] Integrate WebAssembly x86 real Linux kernel (v86)
[x] Build Starship ANSI terminal with POSIX shell
[ ] Polish Yazi file manager interface
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
        size: 240,
        modified: Date.now(),
        content: `NAME="Omarchy Web"
PRETTY_NAME="Omarchy Web OS 4.0 Quattro"
ID=omarchy
ID_LIKE=arch
VERSION="4.0"
VERSION_ID="4.0"
BUILD_ID="2026.09.14"
HOME_URL="https://omarchy.org"
SUPPORT_URL="https://github.com/wolferd-wolf/omarchy-web"
`,
      },
      hostname: {
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
