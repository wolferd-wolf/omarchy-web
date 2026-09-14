"use client";

import React, { useRef, useEffect } from "react";
import {
  Wifi,
  Bluetooth,
  Moon,
  Volume2,
  Sun,
  Camera,
  Lock,
  RotateCcw,
  Bell,
  BellOff,
  Sliders,
  Check,
  X,
  VolumeX,
} from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { playTactileClick } from "@/core/audio/soundEffects";

export const ControlCenter: React.FC = () => {
  const {
    isControlCenterOpen,
    setControlCenterOpen,
    wifiEnabled,
    toggleWifi,
    bluetoothEnabled,
    toggleBluetooth,
    nightLight,
    toggleNightLight,
    dndEnabled,
    toggleDnd,
    volume,
    setVolume,
    soundEffects,
    toggleSoundEffects,
    lockDesktop,
    triggerScreenshot,
    notifications,
    dismissNotification,
    clearAllNotifications,
  } = useSystemStore();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setControlCenterOpen(false);
      }
    };

    if (isControlCenterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isControlCenterOpen, setControlCenterOpen]);

  if (!isControlCenterOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-10 right-3 z-50 w-84 sm:w-96 rounded-2xl waybar-module border border-white/10 p-4 font-mono-os text-xs text-slate-200 shadow-2xl animate-slide-down"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100 text-[11px] uppercase tracking-wider">
            Quick Settings
          </span>
        </div>
        <button
          onClick={() => {
            playTactileClick();
            setControlCenterOpen(false);
          }}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Toggles Grid */}
      <div className="grid grid-cols-2 gap-2 my-3">
        {/* WiFi */}
        <button
          onClick={() => {
            playTactileClick();
            toggleWifi();
          }}
          className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all ${
            wifiEnabled
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/20"
          }`}
        >
          <Wifi className="w-4 h-4" />
          <div className="text-left">
            <div className="font-bold text-[11px]">Wi-Fi</div>
            <div className="text-[9px] text-slate-400">{wifiEnabled ? "Omarchy-5G" : "Disabled"}</div>
          </div>
        </button>

        {/* Bluetooth */}
        <button
          onClick={() => {
            playTactileClick();
            toggleBluetooth();
          }}
          className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all ${
            bluetoothEnabled
              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
              : "bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/20"
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <div className="text-left">
            <div className="font-bold text-[11px]">Bluetooth</div>
            <div className="text-[9px] text-slate-400">{bluetoothEnabled ? "AirPods Pro" : "Off"}</div>
          </div>
        </button>

        {/* Night Light */}
        <button
          onClick={() => {
            playTactileClick();
            toggleNightLight();
          }}
          className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all ${
            nightLight
              ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
              : "bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/20"
          }`}
        >
          <Moon className="w-4 h-4" />
          <div className="text-left">
            <div className="font-bold text-[11px]">Night Light</div>
            <div className="text-[9px] text-slate-400">{nightLight ? "Warm 4500K" : "Standard"}</div>
          </div>
        </button>

        {/* Do Not Disturb */}
        <button
          onClick={() => {
            playTactileClick();
            toggleDnd();
          }}
          className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all ${
            dndEnabled
              ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
              : "bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/20"
          }`}
        >
          {dndEnabled ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          <div className="text-left">
            <div className="font-bold text-[11px]">DND Mode</div>
            <div className="text-[9px] text-slate-400">{dndEnabled ? "Silenced" : "Alerts On"}</div>
          </div>
        </button>
      </div>

      {/* Volume Slider */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master Volume</span>
          </span>
          <span className="tabular-nums text-slate-400">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value, 10))}
          className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => {
            triggerScreenshot();
            setControlCenterOpen(false);
          }}
          className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-200 text-[11px] font-semibold border border-white/5 transition-colors"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Screenshot</span>
        </button>

        <button
          onClick={() => {
            playTactileClick();
            lockDesktop();
          }}
          className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 text-[11px] font-semibold border border-white/5 transition-colors"
        >
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>Lock (Super+L)</span>
        </button>
      </div>

      {/* Notifications Drawer */}
      <div className="mt-4 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Notifications ({notifications.length})
          </span>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-[10px] text-slate-500 hover:text-rose-400"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-[11px] text-slate-500">No new notifications</div>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className="p-2 rounded-lg bg-black/40 border border-white/[0.04] flex items-start justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 text-[11px]">{n.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{n.message}</div>
                </div>
                <button
                  onClick={() => dismissNotification(n.id)}
                  className="p-0.5 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
