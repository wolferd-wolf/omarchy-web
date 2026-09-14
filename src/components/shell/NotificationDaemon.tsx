"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Info, AlertTriangle, Bot, X } from "lucide-react";
import { useSystemStore } from "@/store/systemStore";

export const NotificationDaemon: React.FC = () => {
  const { notifications, dismissNotification, dndEnabled } = useSystemStore();

  // Auto-dismiss top notification after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    const timer = setTimeout(() => {
      dismissNotification(latest.id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  if (dndEnabled || notifications.length === 0) return null;

  // Show up to 3 toast notifications
  const visible = notifications.slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case "agent":
        return <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed top-12 right-4 z-50 flex flex-col space-y-2 pointer-events-none font-mono-os text-xs select-none">
      {visible.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-start space-x-2.5 p-3 rounded-xl waybar-module border border-white/10 shadow-2xl max-w-sm w-80 animate-toast-in backdrop-blur-2xl"
        >
          <div className="mt-0.5">{getIcon(n.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-100 text-[11px] truncate">{n.title}</div>
            <div className="text-[10px] text-slate-300 leading-snug mt-0.5">{n.message}</div>
          </div>
          <button
            onClick={() => dismissNotification(n.id)}
            className="p-1 rounded text-slate-500 hover:text-slate-200"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
