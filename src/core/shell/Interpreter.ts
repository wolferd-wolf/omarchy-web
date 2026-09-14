import { useFSStore } from "@/store/fsStore";
import { useWindowStore } from "@/store/windowStore";
import { AppId } from "@/types/os";

export interface CommandOutput {
  output: string;
  error?: boolean;
}

const OMARCHY_ASCII = `
\x1b[38;5;48m   ██████╗ ███╗   ███╗ █████╗ ██████╗  ██████╗██╗  ██╗██╗   ██╗\x1b[0m
\x1b[38;5;48m  ██╔═══██╗████╗ ████║██╔══██╗██╔══██╗██╔════╝██║  ██║╚██╗ ██╔╝\x1b[0m
\x1b[38;5;45m  ██║   ██║██╔████╔██║███████║██████╔╝██║     ███████║ ╚████╔╝ \x1b[0m
\x1b[38;5;45m  ██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗██║     ██╔══██║  ╚██╔╝  \x1b[0m
\x1b[38;5;141m  ╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╗██║  ██║   ██║   \x1b[0m
\x1b[38;5;141m   ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   \x1b[0m
`;

export class ShellInterpreter {
  private history: string[] = [];

  public getHistory(): string[] {
    return [...this.history];
  }

  public execute(commandLine: string): CommandOutput {
    const trimmed = commandLine.trim();
    if (!trimmed) return { output: "" };

    this.history.push(trimmed);

    // Check for redirection: cmd > file or cmd >> file
    let targetFile = "";
    let append = false;
    let actualCommand = trimmed;

    if (trimmed.includes(">>")) {
      const parts = trimmed.split(">>");
      actualCommand = parts[0].trim();
      targetFile = parts[1].trim();
      append = true;
    } else if (trimmed.includes(">")) {
      const parts = trimmed.split(">");
      actualCommand = parts[0].trim();
      targetFile = parts[1].trim();
      append = false;
    }

    const tokens = this.tokenize(actualCommand);
    if (tokens.length === 0) return { output: "" };

    const cmd = tokens[0];
    const args = tokens.slice(1);

    const result = this.dispatch(cmd, args);

    if (targetFile) {
      const fs = useFSStore.getState();
      const absPath = fs.resolvePath(targetFile);
      let newContent = result.output;
      if (append) {
        const existing = fs.readFile(absPath) || "";
        newContent = existing + (existing.endsWith("\n") ? "" : "\n") + result.output;
      }
      fs.writeFile(absPath, newContent);
      return { output: "" };
    }

    return result;
  }

  private tokenize(line: string): string[] {
    const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    const tokens: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match[1] !== undefined) {
        tokens.push(match[1]);
      } else if (match[2] !== undefined) {
        tokens.push(match[2]);
      } else {
        tokens.push(match[0]);
      }
    }

    return tokens;
  }

  private dispatch(cmd: string, args: string[]): CommandOutput {
    const fs = useFSStore.getState();
    const wm = useWindowStore.getState();

    switch (cmd) {
      case "help":
        return {
          output: `⚡ Omarchy Web OS Shell Built-in Commands:
  ls [-l|-a] [path]  - List files and directories
  cd [path]          - Change working directory
  pwd                - Print current working directory
  cat [file]         - Display contents of a file
  echo [text]        - Print text (supports > and >> file redirection)
  mkdir [-p] [dir]   - Create a new directory
  rm [-r] [path]     - Remove a file or directory
  touch [file]       - Create an empty file
  grep [pat] [file]  - Search for pattern in file
  omafetch           - System & environment status report
  open [app]         - Open app: terminal, agent, editor, files, monitor, v86, settings
  agent [prompt]     - Send a direct instruction to the Omarchy AI Agent
  clear              - Clear terminal window
  uname -a           - Print kernel system architecture
  history            - Show command history
  date               - Print current date and time
`,
        };

      case "pwd":
        return { output: fs.cwd };

      case "cd": {
        const target = args[0] || "/home/user";
        const abs = fs.resolvePath(target);
        const node = fs.getNode(abs);
        if (!node) return { output: `cd: no such file or directory: ${target}`, error: true };
        if (node.type !== "dir") return { output: `cd: not a directory: ${target}`, error: true };
        fs.setCwd(abs);
        return { output: "" };
      }

      case "ls": {
        let pathArg = ".";
        let isLong = false;
        let showAll = false;

        for (const arg of args) {
          if (arg.startsWith("-")) {
            if (arg.includes("l")) isLong = true;
            if (arg.includes("a")) showAll = true;
          } else {
            pathArg = arg;
          }
        }

        const abs = fs.resolvePath(pathArg);
        const entries = fs.listDir(abs);
        if (entries === null) {
          const single = fs.getNode(abs);
          if (single && single.type === "file") {
            return { output: single.name };
          }
          return { output: `ls: cannot access '${pathArg}': No such file or directory`, error: true };
        }

        const filtered = showAll ? entries : entries.filter((e) => !e.name.startsWith("."));

        if (isLong) {
          const lines = filtered.map((e) => {
            const typeChar = e.type === "dir" ? "d" : "-";
            const perms = `${typeChar}rwxr-xr-x`;
            const dateStr = new Date(e.modified).toLocaleDateString([], { month: "short", day: "numeric" });
            const coloredName = e.type === "dir" ? `\x1b[34m${e.name}/\x1b[0m` : e.name;
            return `${perms}  user  users  ${e.size.toString().padStart(5)}  ${dateStr}  ${coloredName}`;
          });
          return { output: lines.join("\n") };
        }

        const formatted = filtered
          .map((e) => (e.type === "dir" ? `${e.name}/` : e.name))
          .join("  ");
        return { output: formatted };
      }

      case "cat": {
        if (args.length === 0) return { output: "cat: missing file operand", error: true };
        const abs = fs.resolvePath(args[0]);
        const content = fs.readFile(abs);
        if (content === null) {
          const node = fs.getNode(abs);
          if (node && node.type === "dir") {
            return { output: `cat: ${args[0]}: Is a directory`, error: true };
          }
          return { output: `cat: ${args[0]}: No such file or directory`, error: true };
        }
        return { output: content };
      }

      case "echo":
        return { output: args.join(" ") };

      case "mkdir": {
        if (args.length === 0) return { output: "mkdir: missing operand", error: true };
        const dirName = args.filter((a) => !a.startsWith("-"))[0];
        if (!dirName) return { output: "mkdir: missing operand", error: true };
        const abs = fs.resolvePath(dirName);
        const success = fs.createDir(abs);
        if (!success) return { output: `mkdir: cannot create directory '${dirName}': File exists or invalid path`, error: true };
        return { output: "" };
      }

      case "touch": {
        if (args.length === 0) return { output: "touch: missing file operand", error: true };
        const abs = fs.resolvePath(args[0]);
        const existing = fs.readFile(abs);
        if (existing === null) {
          fs.writeFile(abs, "");
        }
        return { output: "" };
      }

      case "rm": {
        if (args.length === 0) return { output: "rm: missing operand", error: true };
        const target = args.filter((a) => !a.startsWith("-"))[0];
        if (!target) return { output: "rm: missing operand", error: true };
        const abs = fs.resolvePath(target);
        const success = fs.removeNode(abs);
        if (!success) return { output: `rm: cannot remove '${target}': No such file or directory`, error: true };
        return { output: "" };
      }

      case "grep": {
        if (args.length < 2) return { output: "grep: usage: grep <pattern> <file>", error: true };
        const pattern = args[0];
        const abs = fs.resolvePath(args[1]);
        const content = fs.readFile(abs);
        if (content === null) return { output: `grep: ${args[1]}: No such file or directory`, error: true };
        const lines = content.split("\n");
        const matched = lines.filter((l) => l.includes(pattern));
        return { output: matched.join("\n") };
      }

      case "omafetch":
      case "neofetch":
        return {
          output: `${OMARCHY_ASCII}
  \x1b[1;38;5;48mOS:\x1b[0m Omarchy Web OS 4.0 (Quattro) x86_64
  \x1b[1;38;5;48mHost:\x1b[0m WebAssembly / Browser VFS
  \x1b[1;38;5;48mKernel:\x1b[0m 6.12.0-omarchy-v86
  \x1b[1;38;5;45mUptime:\x1b[0m 42 mins
  \x1b[1;38;5;45mShell:\x1b[0m zsh 5.9
  \x1b[1;38;5;45mWM:\x1b[0m Hyprland (Tiling Wayland Compositor)
  \x1b[1;38;5;141mDesktop:\x1b[0m Quickshell IPC unified
  \x1b[1;38;5;141mTerminal:\x1b[0m omarchy-term
  \x1b[1;38;5;141mAgent:\x1b[0m Omarchy Autonomous Coding Agent (Online)
  \x1b[1;38;5;48mMemory:\x1b[0m 38% / 16384MB
`,
        };

      case "open": {
        if (args.length === 0) return { output: "open: specify an app (terminal, agent, editor, files, monitor, v86, settings)", error: true };
        const app = args[0].toLowerCase() as AppId;
        const validApps: AppId[] = ["terminal", "agent", "editor", "files", "monitor", "v86", "settings"];
        if (!validApps.includes(app)) {
          return { output: `open: unknown app '${args[0]}'. Valid apps: ${validApps.join(", ")}`, error: true };
        }
        wm.openWindow(app);
        return { output: `Opened ${app} in active workspace.` };
      }

      case "uname":
        return { output: "Linux omarchy 6.12.0-omarchy #1 SMP PREEMPT_DYNAMIC WebAssembly x86_64 GNU/Linux" };

      case "date":
        return { output: new Date().toString() };

      case "history":
        return { output: this.history.map((h, i) => `${(i + 1).toString().padStart(4)}  ${h}`).join("\n") };

      default:
        return { output: `zsh: command not found: ${cmd}. Type 'help' for available commands.`, error: true };
    }
  }
}
