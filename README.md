# ⚡ Omarchy Web OS (Quattro)

An opinionated, keyboard-first, agent-ready Web Operating System running natively in your browser, inspired by David Heinemeier Hansson's (DHH) **Omarchy Linux**.

Hosted on Vercel and built with Next.js, React 19, TypeScript, and Tailwind CSS.

---

## 🚀 Key Features

- **Hyprland Tiling Window Manager**: Automatic binary space partitioning (BSP) tiling, interactive horizontal/vertical splits, floating mode, and animated neon glow borders.
- **Quickshell System Bar**: Minimalist top status bar with dynamic workspace pills (`[1] [2] [3]...`), active window tracking, system metrics (CPU, RAM, Battery, Volume), and clock.
- **Agentic Core ("Age of Agents")**: Omarchy's signature AI Coding Agent Hub pre-wired into the environment, able to read/write files in the virtual disk, execute commands, and automate tasks.
- **Interactive POSIX Terminal**: High-speed terminal with ANSI colors, command history, tab completion, and built-in utilities (`ls`, `cd`, `cat`, `echo`, `mkdir`, `rm`, `grep`, `omafetch`).
- **Real x86 Linux Kernel (v86 WebAssembly)**: Boot an actual 32-bit x86 Linux kernel (Alpine Linux) inside a window to execute real compiled x86 machine code.
- **Neovim Code Editor**: Clean developer editor with line numbers, status bar, and direct sync with the persistent virtual filesystem.
- **Files GUI**: Graphical explorer with breadcrumb navigation, file creation, preview, and deletion.
- **System Monitor**: `btop`-style CPU/RAM gauges and virtual process monitor.
- **Theme Switcher**: Omarchy Charcoal, Tokyo Night, Catppuccin Mocha, and Gruvbox Dark.

---

## ⌨️ Keyboard Shortcuts (Hyprland / Omarchy Defaults)

| Shortcut | Action |
|---|---|
| `Super + Enter` | Open Terminal |
| `Super + Space` (or `Super + D`) | Open Application Launcher / Command Palette |
| `Super + A` | Open AI Agent Hub |
| `Super + E` | Open Neovim Code Editor |
| `Super + Q` | Close active window |
| `Super + F` | Toggle Fullscreen / Maximize |
| `Super + V` | Toggle Tiling Split Direction (Horizontal / Vertical) |
| `Super + Shift + Space` | Toggle Floating / Tiled mode |
| `Super + 1..5` | Switch to Workspace 1 through 5 |
| `Super + Shift + 1..5` | Move active window to Workspace 1..5 |
| `Super + ?` or `Super + /` | Open Keybindings Cheat Sheet |

*Note: On macOS, `Super` is the `Command (⌘)` key. On Windows and Linux, `Super` is the `Windows` key.*

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Virtualization**: v86 x86 WebAssembly emulator

---

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/wolferd-wolf/omarchy-web.git
cd omarchy-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deploying to Vercel

Deploy directly to Vercel using the Vercel CLI or GitHub integration:

```bash
vercel --prod
```
