import { create } from "zustand";
import { SystemNotification, ThemeId, VirtualProcess } from "@/types/os";

interface SystemState {
  theme: ThemeId;
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  isMuted: boolean;
  volume: number;
  processes: VirtualProcess[];
  notifications: SystemNotification[];

  // Actions
  setTheme: (theme: ThemeId) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  addNotification: (title: string, message: string, type?: SystemNotification["type"]) => void;
  dismissNotification: (id: string) => void;
  updateMetrics: () => void;
}

const DEFAULT_PROCESSES: VirtualProcess[] = [
  { pid: 1, name: "systemd", cpu: 0.1, memory: 14.2, status: "running", startedAt: Date.now() - 3600000 },
  { pid: 104, name: "hyprland", cpu: 1.8, memory: 82.5, status: "running", startedAt: Date.now() - 3500000 },
  { pid: 142, name: "quickshell", cpu: 0.9, memory: 45.1, status: "running", startedAt: Date.now() - 3500000 },
  { pid: 210, name: "omarchy-agent", cpu: 2.4, memory: 128.0, status: "running", startedAt: Date.now() - 1200000 },
  { pid: 312, name: "pipewire", cpu: 0.2, memory: 28.3, status: "sleeping", startedAt: Date.now() - 3500000 },
  { pid: 489, name: "zsh", cpu: 0.0, memory: 12.0, status: "idle", startedAt: Date.now() - 600000 },
];

export const useSystemStore = create<SystemState>((set, get) => ({
  theme: "omarchy",
  cpuUsage: 14,
  memoryUsage: 38,
  batteryLevel: 94,
  isMuted: false,
  volume: 80,
  processes: DEFAULT_PROCESSES,
  notifications: [
    {
      id: "notif-welcome",
      title: "Omarchy 4.0 (Quattro) Online",
      message: "Keyboard-first Hyprland & Quickshell environment ready. Press Super+Space to launch apps.",
      timestamp: Date.now(),
      type: "agent",
    },
  ],

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  },

  setVolume: (vol) => set({ volume: vol, isMuted: vol === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  addNotification: (title, message, type = "info") => {
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: Date.now(),
      type,
    };
    set((state) => ({ notifications: [notif, ...state.notifications] }));
  },

  dismissNotification: (id) => {
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
  },

  updateMetrics: () => {
    // Dynamic simulated realistic jitter
    const cpuJitter = Math.floor(8 + Math.random() * 22);
    const memJitter = Math.floor(35 + Math.random() * 6);
    set({ cpuUsage: cpuJitter, memoryUsage: memJitter });
  },
}));
