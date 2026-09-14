"use client";

import React, { useState } from "react";
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  X,
  Lock,
  Search,
  ExternalLink,
  Bookmark,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { playTactileClick } from "@/core/audio/soundEffects";
import { useSystemStore } from "@/store/systemStore";

interface Tab {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  favicon?: string;
}

const DEFAULT_BOOKMARKS = [
  { name: "Arch Wiki", url: "https://wiki.archlinux.org", query: "wiki.archlinux.org" },
  { name: "GitHub", url: "https://github.com", query: "github.com" },
  { name: "Hacker News", url: "https://news.ycombinator.com", query: "news.ycombinator.com" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com", query: "duckduckgo.com" },
  { name: "Vercel", url: "https://vercel.com", query: "vercel.com" },
];

export const BrowserApp: React.FC = () => {
  const { soundEffects } = useSystemStore();

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "tab-1",
      title: "Arch Linux Wiki - Hyprland",
      url: "https://wiki.archlinux.org/title/Hyprland",
      displayUrl: "https://wiki.archlinux.org/title/Hyprland",
    },
    {
      id: "tab-2",
      title: "DuckDuckGo Search",
      url: "https://duckduckgo.com",
      displayUrl: "https://duckduckgo.com",
    },
  ]);

  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [urlInput, setUrlInput] = useState("https://wiki.archlinux.org/title/Hyprland");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const navigateTo = (inputUrl: string) => {
    let target = inputUrl.trim();
    if (!target) return;

    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      if (target.includes(".") && !target.includes(" ")) {
        target = `https://${target}`;
      } else {
        // Search query
        target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
      }
    }

    setIsLoading(true);
    setUrlInput(target);
    setHistory((prev) => [...prev, target]);

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: target,
              displayUrl: target,
              title: target.replace(/^https?:\/\//, "").slice(0, 24),
            }
          : t
      )
    );

    setTimeout(() => setIsLoading(false), 500);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEffects) playTactileClick();
    navigateTo(urlInput);
  };

  const newTab = () => {
    if (soundEffects) playTactileClick();
    const newId = `tab-${Date.now()}`;
    const freshTab: Tab = {
      id: newId,
      title: "New Tab",
      url: "https://duckduckgo.com",
      displayUrl: "https://duckduckgo.com",
    };
    setTabs([...tabs, freshTab]);
    setActiveTabId(newId);
    setUrlInput("https://duckduckgo.com");
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEffects) playTactileClick();
    if (tabs.length === 1) return;

    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      const fallback = nextTabs[nextTabs.length - 1];
      setActiveTabId(fallback.id);
      setUrlInput(fallback.url);
    }
  };

  const switchTab = (tab: Tab) => {
    if (soundEffects) playTactileClick();
    setActiveTabId(tab.id);
    setUrlInput(tab.displayUrl);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0c14] font-mono-os text-xs text-slate-200 select-none overflow-hidden">
      {/* Tab Strip */}
      <div className="h-8 px-2 bg-[#06080e] border-b border-white/[0.08] flex items-center space-x-1 overflow-x-auto select-none">
        {tabs.map((t) => {
          const isActive = t.id === activeTabId;
          return (
            <div
              key={t.id}
              onClick={() => switchTab(t)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-t-lg max-w-[200px] cursor-pointer transition-colors text-[11px] ${
                isActive
                  ? "bg-[#101422] text-slate-100 border-t-2 border-emerald-400 font-semibold"
                  : "bg-black/30 text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate flex-1">{t.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(t.id, e)}
                  className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={newTab}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
          title="New Tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation Toolbar */}
      <div className="h-10 px-3 border-b border-white/[0.08] bg-[#0c101c] flex items-center space-x-2 select-none">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              if (history.length > 1) {
                const prevUrl = history[history.length - 2];
                navigateTo(prevUrl);
              }
            }}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30"
            title="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 400);
            }}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            title="Reload"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center relative">
          <div className="absolute left-2.5 flex items-center space-x-1 text-slate-500 pointer-events-none">
            <Lock className="w-3 h-3 text-emerald-400" />
          </div>

          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search DuckDuckGo or type a URL..."
            className="w-full pl-8 pr-8 py-1 bg-black/50 border border-white/10 rounded-lg text-slate-200 text-xs font-mono-os focus:outline-none focus:border-emerald-500/50"
          />

          <button
            type="submit"
            className="absolute right-2 p-1 text-slate-400 hover:text-emerald-400"
            title="Go"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <a
          href={activeTab.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-400"
          title="Open in external browser window"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Bookmarks Bar */}
      <div className="h-7 px-3 border-b border-white/[0.04] bg-[#090b14] flex items-center space-x-2 text-[10px] overflow-x-auto select-none">
        <Bookmark className="w-3 h-3 text-slate-500 flex-shrink-0" />
        {DEFAULT_BOOKMARKS.map((bm) => (
          <button
            key={bm.name}
            onClick={() => navigateTo(bm.url)}
            className="px-2 py-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            {bm.name}
          </button>
        ))}
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 w-full h-full relative bg-[#07090e] overflow-hidden">
        {/* Render Sandbox or Fallback */}
        <iframe
          key={activeTab.url}
          src={activeTab.url}
          title={activeTab.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="w-full h-full border-none bg-white/5"
          onError={() => setIsLoading(false)}
        />

        {/* Security badge and external link helper in case of X-Frame-Options blocking */}
        <div className="absolute bottom-2 right-3 z-10 flex items-center space-x-2 px-3 py-1 rounded-full waybar-module text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Sandboxed Viewport</span>
          <span className="text-white/20">•</span>
          <a
            href={activeTab.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>External tab</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
