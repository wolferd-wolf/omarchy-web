export interface Wallpaper {
  id: string;
  name: string;
  gradient: string;
  accent: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "nordic-aurora",
    name: "Nordic Aurora (Omarchy)",
    gradient: "linear-gradient(180deg, #050811 0%, #080f1d 40%, #0c1826 75%, #060d16 100%)",
    accent: "#22c55e",
  },
  {
    id: "minimal-charcoal",
    name: "Arch Obsidian Matrix",
    gradient: "radial-gradient(ellipse at 50% 25%, #131724 0%, #090c13 55%, #040508 100%)",
    accent: "#06b6d4",
  },
  {
    id: "tokyo-cyber",
    name: "Tokyo Midnight",
    gradient: "linear-gradient(145deg, #0b0d18 0%, #13172b 45%, #1a162d 80%, #0e0f1d 100%)",
    accent: "#7aa2f7",
  },
  {
    id: "gruvbox-dark",
    name: "Gruvbox Forest Minimal",
    gradient: "linear-gradient(180deg, #181b1c 0%, #151817 50%, #101211 100%)",
    accent: "#fabd2f",
  },
];
