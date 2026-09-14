import { useFSStore } from "@/store/fsStore";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { AppId } from "@/types/os";

export interface CommandOutput {
  output: string;
  error?: boolean;
}

const OMARCHY_ASCII = `
\x1b[38;5;48m       /\\
\x1b[38;5;48m      /  \\         \x1b[1;38;5;48mOMARCHY LINUX 4.0\x1b[0m (Quattro)
\x1b[38;5;45m     / /\\ \\        \x1b[38;5;245m-----------------------\x1b[0m
\x1b[38;5;45m    / /__\\ \\       \x1b[1;38;5;45mOS:\x1b[0m Arch Linux x86_64
\x1b[38;5;141m   / /____\\ \\      \x1b[1;38;5;45mHost:\x1b[0m Hyprland Wayland Compositor
\x1b[38;5;141m  /_/      \\_\\     \x1b[1;38;5;141mKernel:\x1b[0m 6.12.8-arch1-1-omarchy
\x1b[38;5;141m                   \x1b[1;38;5;141mShell:\x1b[0m zsh 5.9 (x86_64-pc-linux-gnu)
                   \x1b[1;38;5;48mWM:\x1b[0m Hyprland v0.44.1 (Tiling BSP)
                   \x1b[1;38;5;48mTheme:\x1b[0m Omarchy Charcoal [GTK2/3]
                   \x1b[1;38;5;45mIcons:\x1b[0m Papirus-Dark
                   \x1b[1;38;5;45mTerminal:\x1b[0m alacritty
                   \x1b[1;38;5;141mCPU:\x1b[0m AMD Ryzen 9 7950X (32) @ 5.700GHz
                   \x1b[1;38;5;141mMemory:\x1b[0m 5920MiB / 32098MiB (18%)
                   \x1b[1;38;5;48mDisk (/):\x1b[0m 64G / 512G (13%)
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

    // File Redirection (> and >>)
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
          output: `\x1b[1;38;5;48mOmarchy GNU/Linux 6.12 Utilities:\x1b[0m
  ls [-la] [path]    - List directory contents with permissions
  cd [dir]           - Change directory
  pwd                - Print current working directory
  cat [file]         - Concatenate and display files
  echo [text]        - Write text (supports > and >> file redirection)
  mkdir [-p] [dir]   - Create directories
  rm [-r] [file/dir] - Remove files or directories
  touch [file]       - Create empty file or update timestamp
  grep [pat] [file]  - Search for pattern in file
  tree [dir]         - Display directory tree visualization
  omafetch           - Print system hardware and OS status
  open [app]         - Launch: terminal, browser, player, calc, doom, paint, files, v86...
  pacman -S <pkg>    - Install packages / desktop apps (or pacman -Ss <query>)
  yay -S <pkg>       - Arch Linux & AUR package installer
  pkg install <app>  - Omarchy package manager (pkg list | pkg install)
  curl [-O] <url>    - Download web resources and save files
  wget <url>         - Download files to current working directory
  npm / pip install  - Node.js and Python package installers
  lock               - Lock the desktop session (Super+L)
  screenshot         - Capture screenshot (Super+Shift+S)
  cowsay [msg]       - Talking ASCII cow
  figlet [text]      - ASCII banner generator
  cmatrix            - Matrix digital rain stream
  git [status|log]   - Check git version control
  hyprctl [mon|cl]   - Hyprland compositor controller
  cargo [run|build]  - Rust package manager
  python3 [script]   - Execute python script
  node [script]      - Execute JavaScript script
  free [-h]          - Display memory usage summary
  df [-h]            - Display file system disk space usage
  uptime             - Show how long the system has been running
  whoami             - Print current logged-in user
  uname -a           - Print kernel system architecture
  ps [aux]           - Report a snapshot of the current processes
  clear              - Clear the terminal screen
  history            - Show shell history
`,
        };

      case "pwd":
        return { output: fs.cwd };

      case "whoami":
        return { output: "user" };

      case "uptime":
        return { output: " 14:10:02 up 14 days,  3:47,  1 user,  load average: 0.14, 0.19, 0.22" };

      case "free":
        return {
          output: `               total        used        free      shared  buff/cache   available
Mem:           31.3G        5.9G       18.3G        420M        7.1G       25.0G
Swap:           8.0G          0B        8.0G`,
        };

      case "df":
        return {
          output: `Filesystem      Size  Used Avail Use% Mounted on
dev             16G     0   16G   0% /dev
run             16G  1.8M   16G   1% /run
/dev/nvme0n1p2 512G   64G  448G  13% /
tmpfs           16G  420M   16G   3% /dev/shm
/dev/nvme0n1p1 1.0G   72M  952M   8% /boot/efi`,
        };

      case "ps":
        return {
          output: `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0 168432 12420 ?        Ss   Sep01   0:04 /sbin/init
user       104  1.8  0.4 482912 82500 tty1     Ssl+ Sep01  42:15 Hyprland
user       142  0.9  0.2 284120 45100 tty1     Sl   Sep01  18:32 quickshell --ipc
user       210  2.4  0.6 592810 128000 tty1    Sl   Sep01  54:10 omarchy-agent daemon
user       312  0.2  0.1 192840 28300 ?        S<l  Sep01   4:12 pipewire
user       489  0.0  0.1  24892 12000 pts/0    Ss   13:40   0:00 /bin/zsh`,
        };

      case "git": {
        const sub = args[0] || "status";
        if (sub === "status") {
          return {
            output: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
	modified:   .config/hypr/hyprland.conf
	modified:   projects/main.rs

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	notes/todo.txt

no changes added to commit (use "git add" and/or "git commit -a")`,
          };
        }
        if (sub === "log") {
          return {
            output: `\x1b[33mcommit 9f82d14a2b91c841e\x1b[0m (HEAD -> main, origin/main)
Author: user <user@omarchy.org>
Date:   Mon Sep 14 13:30:12 2026 +0000

    feat(hyprland): configure binary-split compositor and quickshell modules

\x1b[33mcommit 4a71c8901be33d59a\x1b[0m
Author: user <user@omarchy.org>
Date:   Mon Sep 14 11:15:44 2026 +0000

    feat(agent): initialize autonomous loop daemon with virtual disk IPC

\x1b[33mcommit 1b02f948a329d44ef\x1b[0m
Author: user <user@omarchy.org>
Date:   Mon Sep 14 09:00:00 2026 +0000

    init: bootstrap Omarchy Web OS 4.0 (Quattro)`,
          };
        }
        if (sub === "branch") {
          return { output: "* main" };
        }
        return { output: `git: '${sub}' is not a valid git command. Try 'git status' or 'git log'.` };
      }

      case "pacman":
      case "yay":
      case "paru": {
        const flag = args[0];
        if (!flag) {
          return { output: "usage: pacman <operation> [...] (e.g. pacman -Syu, pacman -Ss <query>, pacman -S <package>)" };
        }

        if (flag === "-Syu" || flag === "-Syyu" || flag === "-Sy") {
          if (args.length === 1) {
            return {
              output: `:: Synchronizing package databases...
 core                                                 148.2 KiB   1.8 MiB/s 00:00 [#############################################] 100%
 extra                                                  8.6 MiB  14.2 MiB/s 00:01 [#############################################] 100%
 multilib                                             142.0 KiB   2.1 MiB/s 00:00 [#############################################] 100%
:: Starting full system upgrade...
 there is nothing to do`,
            };
          }
        }

        if (flag.startsWith("-S") && flag !== "-Ss") {
          const targets = args.slice(1).filter((a) => !a.startsWith("-"));
          if (targets.length === 0) {
            return { output: "error: no targets specified (use -h for help)", error: true };
          }

          const results: string[] = [];
          for (const rawPkg of targets) {
            const pkg = rawPkg.toLowerCase();
            const appAliases: Record<string, AppId> = {
              browser: "browser",
              web: "browser",
              zen: "browser",
              chromium: "browser",
              firefox: "browser",
              player: "player",
              music: "player",
              spotify: "player",
              audio: "player",
              calc: "calculator",
              calculator: "calculator",
              kcalc: "calculator",
              bc: "calculator",
              doom: "doom",
              game: "doom",
              paint: "paint",
              draw: "paint",
              gimp: "paint",
              v86: "v86",
              vm: "v86",
              alpine: "v86",
              files: "files",
              yazi: "files",
              thunar: "files",
              editor: "editor",
              nvim: "editor",
              neovim: "editor",
              vim: "editor",
              monitor: "monitor",
              btop: "monitor",
              htop: "monitor",
              settings: "settings",
              agent: "agent",
              terminal: "terminal",
              alacritty: "terminal",
            };

            const appId = appAliases[pkg];
            if (appId) {
              wm.openWindow(appId);
              fs.writeFile(`/usr/bin/${pkg}`, `#!/bin/sh\n# Omarchy Desktop Application launcher\nopen ${appId}\n`);
              fs.writeFile(`/usr/share/applications/${pkg}.desktop`, `[Desktop Entry]\nName=${pkg}\nType=Application\nExec=open ${appId}\nIcon=${pkg}\n`);
              results.push(`resolving dependencies...
looking for conflicting packages...

Packages (1) ${pkg}-4.0.1-1

Total Download Size:    4.18 MiB
Total Installed Size:  14.20 MiB

:: Proceed with installation? [Y/n] Y
:: Retrieving packages...
 ${pkg}-4.0.1-1-x86_64     4.2 MiB  12.8 MiB/s 00:00 [####################################] 100%
(1/1) checking keys in keyring                      [####################################] 100%
(1/1) checking package integrity                    [####################################] 100%
(1/1) loading package files                         [####################################] 100%
(1/1) checking for file conflicts                   [####################################] 100%
(1/1) checking available disk space                 [####################################] 100%
:: Processing package changes...
(1/1) installing ${pkg}                             [####################################] 100%
:: Running post-transaction hooks...
(1/2) Arming ConditionNeedsUpdate...
(2/2) Updating desktop database...
\x1b[1;38;5;48m✔ Package '${pkg}' installed and launched on workspace ${wm.activeWorkspaceId}!\x1b[0m`);
            } else {
              fs.writeFile(`/usr/bin/${pkg}`, `#!/bin/sh\n# ${pkg} binary\necho "${pkg} v1.0.0 (omarchy-x86_64)"\n`);
              results.push(`resolving dependencies...
looking for conflicting packages...

Packages (1) ${pkg}-1.0.0-1

Total Download Size:    1.25 MiB
Total Installed Size:   3.90 MiB

:: Proceed with installation? [Y/n] Y
:: Retrieving packages...
 ${pkg}-1.0.0-1-x86_64     1.3 MiB  18.4 MiB/s 00:00 [####################################] 100%
(1/1) checking keys in keyring                      [####################################] 100%
(1/1) checking package integrity                    [####################################] 100%
(1/1) loading package files                         [####################################] 100%
:: Processing package changes...
(1/1) installing ${pkg}                             [####################################] 100%
:: Running post-transaction hooks...
(1/2) Arming ConditionNeedsUpdate...
\x1b[1;38;5;48m✔ Installed ${pkg} into /usr/bin/${pkg}. You can now run '${pkg}'.\x1b[0m`);
            }
          }
          return { output: results.join("\n\n") };
        }

        if (flag === "-Ss") {
          const query = (args[1] || "").toLowerCase();
          const allPackages = [
            { repo: "extra", name: "browser", desc: "Zen Web Browser with tabbed sandboxed browsing" },
            { repo: "extra", name: "player", desc: "Lo-Fi Audio Station & real-time Web Audio spectrum visualizer" },
            { repo: "extra", name: "calculator", desc: "Programmer & Scientific calculator (HEX, DEC, BIN, OCT)" },
            { repo: "extra", name: "doom", desc: "Retro WASM 3D Arena (Doom raycaster game)" },
            { repo: "extra", name: "paint", desc: "Pixel Art Studio drawing canvas" },
            { repo: "extra", name: "hyprland", desc: "Dynamic tiling Wayland compositor" },
            { repo: "extra", name: "quickshell", desc: "Flexible desktop shell library built with Qt/QML" },
            { repo: "extra", name: "alacritty", desc: "Cross-platform, GPU-accelerated terminal emulator" },
            { repo: "extra", name: "neovim", desc: "Vim-fork focused on extensibility and usability" },
            { repo: "extra", name: "v86", desc: "Real x86 Linux 32-bit WebAssembly kernel (Alpine 3.19)" },
            { repo: "extra", name: "cowsay", desc: "Configurable talking cow (and a bit more)" },
            { repo: "extra", name: "fastfetch", desc: "Neofetch-like tool for fetching system information" },
            { repo: "extra", name: "curl", desc: "Command line tool and library for transferring data with URLs" },
            { repo: "extra", name: "wget", desc: "Utility for retrieving files using HTTP, HTTPS and FTP" },
          ];
          const matched = allPackages.filter((p) => !query || p.name.includes(query) || p.desc.toLowerCase().includes(query));
          if (matched.length === 0) {
            return { output: `error: no matches found for '${query}'` };
          }
          return {
            output: matched.map((p) => `\x1b[1;38;5;141m${p.repo}/${p.name}\x1b[0m [available]\n    ${p.desc}`).join("\n"),
          };
        }

        if (flag === "-Q" || flag === "-Qe") {
          return {
            output: `alacritty 0.13.2-1
browser 1.0.0-1
calculator 1.0.0-1
doom 1.0.0-1
editor 0.10.1-1
files 0.2.4-1
hyprland 0.44.1-1
monitor 1.3.2-1
paint 1.0.0-1
player 1.0.0-1
quickshell 0.0.8-1
v86 1.0.0-1`,
          };
        }

        if (flag === "-R" || flag === "-Rns") {
          const target = args[1];
          if (!target) return { output: "error: no targets specified", error: true };
          return {
            output: `checking dependencies...
:: Do you want to remove these packages? [Y/n] Y
:: Processing package changes...
(1/1) removing ${target}                            [####################################] 100%
:: Running post-transaction hooks...
(1/1) Arming ConditionNeedsUpdate...
✔ Package '${target}' removed.`,
          };
        }

        return { output: "usage: pacman <operation> [...] (e.g. pacman -Syu, pacman -Ss <package>, pacman -S <package>)" };
      }

      case "curl": {
        if (args.length === 0) {
          return { output: "curl: try 'curl --help' or 'curl --manual' for more information", error: true };
        }
        let saveToFile = false;
        let customFilename = "";
        let url = "";

        for (let i = 0; i < args.length; i++) {
          const arg = args[i];
          if (arg === "-O") {
            saveToFile = true;
          } else if (arg === "-o" && args[i + 1]) {
            customFilename = args[i + 1];
            i++;
          } else if (!arg.startsWith("-")) {
            url = arg;
          }
        }

        if (!url) return { output: "curl: no URL specified!", error: true };

        const filename = customFilename || url.split("/").pop() || "index.html";
        const content = `<!DOCTYPE html>\n<!-- Downloaded via curl from ${url} on ${new Date().toISOString()} -->\n<html>\n<head><title>Downloaded Resource</title></head>\n<body>\n<h1>Resource: ${url}</h1>\n<p>Content retrieved successfully by Omarchy GNU/Linux curl utility.</p>\n</body>\n</html>\n`;

        if (saveToFile || customFilename) {
          const abs = fs.resolvePath(filename);
          fs.writeFile(abs, content);
          return {
            output: `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1248  100  1248    0     0   428k      0 --:--:-- --:--:-- --:--:--  428k
\x1b[1;38;5;48m✔ Saved to '${filename}' (${abs})\x1b[0m`,
          };
        }

        return {
          output: `HTTP/2 200 OK
date: ${new Date().toUTCString()}
content-type: text/plain; charset=utf-8
server: cloudflare

${content}`,
        };
      }

      case "wget": {
        if (args.length === 0) {
          return { output: "wget: missing URL\nUsage: wget [OPTION]... [URL]...", error: true };
        }
        let url = "";
        let outputName = "";
        for (let i = 0; i < args.length; i++) {
          if (args[i] === "-O" && args[i + 1]) {
            outputName = args[i + 1];
            i++;
          } else if (!args[i].startsWith("-")) {
            url = args[i];
          }
        }
        if (!url) return { output: "wget: missing URL", error: true };
        const filename = outputName || url.split("/").pop() || "downloaded_file";
        const domain = url.replace(/https?:\/\//, "").split("/")[0] || "omarchy.org";
        const content = `# Downloaded file from ${url}\n# Date: ${new Date().toISOString()}\n[omarchy-data]\nstatus=complete\nsource=${url}\n`;
        const abs = fs.resolvePath(filename);
        fs.writeFile(abs, content);

        return {
          output: `--${new Date().toISOString().replace("T", " ").substring(0, 19)}--  ${url}
Resolving ${domain} (${domain})... 104.21.72.19, 172.67.182.14
Connecting to ${domain} (${domain})|104.21.72.19|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2048 (2.0K) [text/plain]
Saving to: ‘${filename}’

${filename.padEnd(20)} 100%[===================>]   2.00K  --.-KB/s    in 0.001s  

${new Date().toISOString().replace("T", " ").substring(0, 19)} (2.00 MB/s) - ‘${filename}’ saved [2048/2048]`,
        };
      }

      case "npm":
      case "npx": {
        const sub = args[0];
        if (sub === "install" || sub === "i" || sub === "add") {
          const pkg = args[1] || "dependencies";
          return {
            output: `added 42 packages, and audited 180 packages in 1s

24 packages are looking for funding
  run \`npm fund\` for details

\x1b[1;38;5;48m✔ Successfully installed '${pkg}' to node_modules/!\x1b[0m`,
          };
        }
        return { output: `npm v10.8.2\nUsage: npm install <package>` };
      }

      case "pip":
      case "pip3": {
        const sub = args[0];
        if (sub === "install") {
          const pkg = args[1] || "requirements";
          return {
            output: `Collecting ${pkg}
  Downloading ${pkg}-2.4.0-py3-none-any.whl (48 kB)
Installing collected packages: ${pkg}
\x1b[1;38;5;48mSuccessfully installed ${pkg}-2.4.0\x1b[0m`,
          };
        }
        return { output: `pip 24.1.2 from /usr/lib/python3.12/site-packages/pip (python 3.12)\nUsage: pip install <package>` };
      }

      case "apk": {
        const sub = args[0];
        if (sub === "add") {
          const pkg = args[1] || "package";
          return {
            output: `(1/2) Installing ${pkg} (1.4.0-r1)
(2/2) Installing ${pkg}-doc (1.4.0-r1)
Executing busybox-1.36.1-r19.trigger
OK: 284 MiB in 62 packages

\x1b[1;38;5;45m💡 Tip: To run real x86 Linux with official live Alpine package mirrors, launch the real VM with 'open v86'!\x1b[0m`,
          };
        }
        return { output: "apk-tools 2.14.0, compiled for x86_64.\nUsage: apk add <package>" };
      }

      case "cowsay": {
        const msg = args.length > 0 ? args.join(" ") : "Omarchy Linux rules!";
        const border = "-".repeat(msg.length + 2);
        return {
          output: ` ${border}
< ${msg} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
        };
      }

      case "figlet": {
        const text = (args.length > 0 ? args.join(" ") : "OMARCHY").toUpperCase();
        return {
          output: `\x1b[1;38;5;48m _ _ _  \n| | | | \n| | | |  ${text}\n|_____| \x1b[0m`,
        };
      }

      case "fastfetch":
        return { output: OMARCHY_ASCII };

      case "cmatrix":
        return {
          output: `\x1b[32m0 1 0 1 1 0 1 0 0 1 0 1
1 0 1 0 0 1 0 1 1 0 1 0
0 1 1 0 1 0 0 1 0 1 0 1
1 0 0 1 0 1 1 0 1 0 1 0
0 1 0 1 1 0 1 0 0 1 0 1
1 0 1 0 0 1 0 1 1 0 1 0\x1b[0m\n[Matrix stream rendered. Type Enter to return.]`,
        };

      case "hyprctl": {
        const sub = args[0];
        if (sub === "monitors" || sub === "mon") {
          return {
            output: `Monitor DP-1 (ID 0):
	2560x1440@165.00Hz at 0x0
	description: ASUS ROG Swift PG279QM
	make: ASUS
	model: PG279QM
	focused: yes
	active workspace: ${wm.activeWorkspaceId}
	reserved: 0 36 0 0`,
          };
        }
        if (sub === "clients" || sub === "cl") {
          const clientList = Object.values(wm.windows)
            .map(
              (w) =>
                `Window ${w.id} -> class: ${w.appId}, title: ${w.title}, workspace: ${w.workspaceId}, floating: ${w.isFloating ? 1 : 0}`
            )
            .join("\n");
          return { output: clientList || "No active clients on current workspace." };
        }
        return { output: `Hyprland, built from branch main at commit 9b81d7f (v0.44.1)\nCommands: hyprctl monitors, hyprctl clients` };
      }

      case "cargo": {
        const sub = args[0] || "build";
        if (sub === "run") {
          return {
            output: `   Compiling omarchy-kernel v0.1.0 (/home/user/projects)
    Finished dev [unoptimized + debuginfo] target(s) in 0.38s
     Running \`target/debug/omarchy-kernel\`
⚡ Omarchy Linux 4.0 (Quattro) Initialized
Active daemons: {
    104: Process { pid: 104, name: "hyprland", threads: 4 },
    210: Process { pid: 210, name: "omarchy-agent", threads: 8 },
}`,
          };
        }
        return {
          output: `   Compiling omarchy-kernel v0.1.0 (/home/user/projects)
    Finished dev [unoptimized + debuginfo] target(s) in 0.35s`,
        };
      }

      case "python3":
      case "python": {
        const script = args[0];
        if (script?.includes("agent")) {
          return {
            output: `[Agent] Initializing autonomous loop...
[Agent] Connecting to Quickshell IPC socket...
[Agent] Status: 100% operational in browser.`,
          };
        }
        return { output: `Python 3.12.5 (main, Aug 12 2026, 14:20:00) [GCC 14.2.1 20260801] on linux` };
      }

      case "node": {
        const script = args[0];
        if (script?.includes("demo")) {
          return {
            output: `⚡ Bootstrapping agent workspace...
Connected to compositor bus.
Status: ready, model: hyprland-tiling, kernel: v86-wasm`,
          };
        }
        return { output: `Welcome to Node.js v24.2.0. Type ".help" for more information.` };
      }

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
          const totalBlocks = Math.ceil(filtered.reduce((acc, e) => acc + e.size, 0) / 1024);
          const lines = [`total ${totalBlocks}`];
          filtered.forEach((e) => {
            const typeChar = e.type === "dir" ? "d" : "-";
            const perms = `${typeChar}rwxr-xr-x`;
            const dateStr = new Date(e.modified).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
            const coloredName = e.type === "dir" ? `\x1b[1;34m${e.name}/\x1b[0m` : e.name;
            lines.push(`${perms}  1 user users  ${e.size.toString().padStart(6)}  ${dateStr}  ${coloredName}`);
          });
          return { output: lines.join("\n") };
        }

        const formatted = filtered
          .map((e) => (e.type === "dir" ? `\x1b[1;34m${e.name}/\x1b[0m` : e.name))
          .join("  ");
        return { output: formatted };
      }

      case "tree": {
        const startPath = args[0] ? fs.resolvePath(args[0]) : fs.cwd;
        const rootNode = fs.getNode(startPath);
        if (!rootNode || rootNode.type !== "dir") {
          return { output: `tree: '${startPath}': No such directory`, error: true };
        }

        const outputLines = [startPath];
        const walk = (path: string, prefix: string) => {
          const items = fs.listDir(path) || [];
          items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const branch = isLast ? "└── " : "├── ";
            const nextPrefix = prefix + (isLast ? "    " : "│   ");
            const colored = item.type === "dir" ? `\x1b[1;34m${item.name}\x1b[0m` : item.name;
            outputLines.push(`${prefix}${branch}${colored}`);
            if (item.type === "dir") {
              walk(`${path === "/" ? "" : path}/${item.name}`, nextPrefix);
            }
          });
        };

        walk(startPath, "");
        return { output: outputLines.join("\n") };
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
        return { output: OMARCHY_ASCII };

      case "lock": {
        useSystemStore.getState().lockDesktop();
        return { output: "Desktop locked." };
      }

      case "screenshot": {
        useSystemStore.getState().triggerScreenshot();
        return { output: "Screenshot captured and saved to ~/screenshots/" };
      }

      case "pkg":
      case "omapkg": {
        const sub = args[0] || "list";
        if (sub === "list") {
          return {
            output: `\x1b[1;38;5;48mInstalled Omarchy Desktop Apps:\x1b[0m
  terminal    - GPU-accelerated Alacritty emulator with Zsh 5.9
  browser     - Zen Web Browser with tabbed sandboxed browsing
  editor      - Neovim 0.10.1 with Lua tree & Lualine
  player      - Lo-Fi Audio Station & real-time Web Audio spectrum visualizer
  calculator  - Programmer & Scientific calculator (HEX, DEC, BIN, OCT)
  doom        - Retro WASM 3D Arena (Doom raycaster)
  paint       - Pixel Art Studio drawing canvas
  files       - Yazi high-speed terminal file manager
  monitor     - Btop++ system hardware & process monitor
  v86         - Real x86 Linux 32-bit WebAssembly kernel (Alpine 3.19)
  agent       - Omarchy Autonomous Agent loop daemon
  settings    - System preferences, Hyprland gaps, and themes`,
          };
        }
        if (sub === "install" && args[1]) {
          const targetApp = args[1].toLowerCase() as AppId;
          const validApps: AppId[] = ["terminal", "browser", "editor", "files", "monitor", "v86", "settings", "player", "calculator", "doom", "paint", "agent"];
          if (validApps.includes(targetApp)) {
            wm.openWindow(targetApp);
            return { output: `Package '${targetApp}' verified and launched on workspace ${wm.activeWorkspaceId}.` };
          }
          return { output: `pkg: repository package '${args[1]}' not found. Run 'pkg list'.`, error: true };
        }
        return { output: "Usage: pkg list | pkg install <app>" };
      }

      case "open": {
        if (args.length === 0) return { output: "open: specify an app (terminal, browser, editor, player, calc, files, monitor, doom, paint, v86, settings)", error: true };
        let appName = args[0].toLowerCase();
        if (appName === "music") appName = "player";
        if (appName === "calc") appName = "calculator";
        if (appName === "web") appName = "browser";

        const validApps: AppId[] = [
          "terminal",
          "agent",
          "editor",
          "files",
          "monitor",
          "v86",
          "settings",
          "browser",
          "player",
          "calculator",
          "doom",
          "paint",
        ];
        if (!validApps.includes(appName as AppId)) {
          return { output: `open: unknown app '${args[0]}'. Valid apps: ${validApps.join(", ")}`, error: true };
        }
        wm.openWindow(appName as AppId);
        return { output: `Launched ${appName} on workspace ${wm.activeWorkspaceId}.` };
      }

      case "uname":
        return { output: "Linux omarchy 6.12.8-arch1-1-omarchy #1 SMP PREEMPT_DYNAMIC Wed, 14 Sep 2026 04:12:00 +0000 x86_64 GNU/Linux" };

      case "date":
        return { output: new Date().toUTCString() };

      case "history":
        return { output: this.history.map((h, i) => `${(i + 1).toString().padStart(4)}  ${h}`).join("\n") };

      default:
        return { output: `zsh: command not found: ${cmd}. Type 'help' for available commands.`, error: true };
    }
  }
}
