import { create } from "zustand";
import { SystemNotification, ThemeId, VirtualProcess } from "@/types/os";
import { playNotificationChime, playShutterSound } from "@/core/audio/soundEffects";

interface SystemState {
  theme: ThemeId;
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  isMuted: boolean;
  volume: number;
  soundEffects: boolean;
  activeWindowName: string;
  isLocked: boolean;
  nightLight: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  dndEnabled: boolean;
  isControlCenterOpen: boolean;
  isTakingScreenshot: boolean;
  processes: VirtualProcess[];
  notifications: SystemNotification[];

  // Actions
  setTheme: (theme: ThemeId) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleSoundEffects: () => void;
  setActiveWindowName: (name: string) => void;
  lockDesktop: () => void;
  unlockDesktop: (pwd: string) => boolean;
  toggleNightLight: () => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleDnd: () => void;
  setControlCenterOpen: (open: boolean) => void;
  triggerScreenshot: () => void;
  addNotification: (title: string, message: string, type?: SystemNotification["type"]) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateMetrics: () => void;
}

const DEFAULT_PROCESSES: VirtualProcess[] = [
  { pid: 1, name: "systemd", cpu: 0.1, memory: 14.2, status: "running", startedAt: Date.now() - 3600000 },
  { pid: 104, name: "hyprland", cpu: 1.8, memory: 82.5, status: "running", startedAt: Date.now() - 3500000 },
  { pid: 142, name: "quickshell", cpu: 0.9, memory: 45.1, status: "running", startedAt: Date.now() - 3500000 },
  { pid: 210, name: "omarchy-agent", cpu: 2.4, memory: 128.0, status: "running", startedAt: Date.now() - 1200000 },
  { pid: 312, name: "pipewire", cpu: 0.2, memory: 28.3, status: "sleeping", startedAt: Date.now() - 3500000 },
  { pid: 489, name: "zsh", cpu: 0.0, memory: 12.0, status: "idle", startedAt: Date.now() - 600000 },
  { pid: 512, name: "zen-browser", cpu: 3.2, memory: 210.4, status: "running", startedAt: Date.now() - 300000 },
  { pid: 620, name: "music-daemon", cpu: 0.5, memory: 34.0, status: "running", startedAt: Date.now() - 900000 },
];

export const useSystemStore = create<SystemState>((set, get) => ({
  theme: "omarchy",
  cpuUsage: 14,
  memoryUsage: 38,
  batteryLevel: 94,
  isMuted: false,
  volume: 80,
  soundEffects: true,
  activeWindowName: "alacritty: ~/projects",
  isLocked: false,
  nightLight: false,
  wifiEnabled: true,
  bluetoothEnabled: true,
  dndEnabled: false,
  isControlCenterOpen: false,
  isTakingScreenshot: false,
  processes: DEFAULT_PROCESSES,
  notifications: [
    {
      id: "notif-welcome",
      title: "Omarchy 4.0 Online",
      message: "Hyprland desktop active. Super+Space to launch browser, music player, or terminal.",
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
  toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
  setActiveWindowName: (name) => set({ activeWindowName: name }),

  lockDesktop: () => set({ isLocked: true, isControlCenterOpen: false }),
  unlockDesktop: (pwd: string) => {
    // Default password is "user" or empty/any for frictionless demo
    set({ isLocked: false });
    return true;
  },

  toggleNightLight: () => set((state) => ({ nightLight: !state.nightLight })),
  toggleWifi: () => set((state) => ({ wifiEnabled: !state.wifiEnabled })),
  toggleBluetooth: () => set((state) => ({ bluetoothEnabled: !state.bluetoothEnabled })),
  toggleDnd: () => set((state) => ({ dndEnabled: !state.dndEnabled })),
  setControlCenterOpen: (open) => set({ isControlCenterOpen: open }),

  triggerScreenshot: () => {
    const { soundEffects, addNotification } = get();
    if (soundEffects) playShutterSound();
    set({ isTakingScreenshot: true });

    setTimeout(() => {
      set({ isTakingScreenshot: false });
      const filename = `screenshot_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.png`;
      addNotification("Screenshot Captured", `Saved to ~/screenshots/${filename}`, "success");
    }, 400);
  },

  addNotification: (title, message, type = "info") => {
    const { dndEnabled, soundEffects } = get();
    if (soundEffects && !dndEnabled) {
      playNotificationChime();
    }
    const notif: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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

  clearAllNotifications: () => set({ notifications: [] }),

  updateMetrics: () => {
    const cpuJitter = Math.floor(8 + Math.random() * 22);
    const memJitter = Math.floor(35 + Math.random() * 6);
    set({ cpuUsage: cpuJitter, memoryUsage: memJitter });
  },
}));
