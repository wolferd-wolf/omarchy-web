"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, CheckCircle2, Terminal, Code2, Cpu } from "lucide-react";
import { useAgentStore } from "@/store/agentStore";

interface AgentAppProps {
  windowId: string;
}

export const AgentApp: React.FC<AgentAppProps> = () => {
  const { messages, isThinking, sendMessage } = useAgentStore();
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isThinking) return;
    const text = inputVal;
    setInputVal("");
    sendMessage(text);
  };

  const quickPrompts = [
    "Create a new JavaScript project",
    "Launch a terminal window",
    "Open the Neovim editor",
    "Boot real Linux kernel (v86)",
  ];

  return (
    <div className="flex flex-col h-full w-full bg-omarchy-950 font-sans text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-omarchy-900/60 select-none">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-omarchy-cyan animate-pulse" />
          <span className="font-bold text-slate-200">Omarchy Autonomous Agent</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-omarchy-accent/15 text-omarchy-accent font-mono font-medium">
            ONLINE
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Integrated with Quickshell & VFS
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                  isUser
                    ? "bg-omarchy-cyan/15 text-slate-100 border border-omarchy-cyan/30 rounded-tr-sm"
                    : "bg-omarchy-850 text-slate-200 border border-white/5 rounded-tl-sm"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-omarchy-cyan font-bold mb-1.5 select-none">
                    <Sparkles className="w-3 h-3" />
                    <span>Omarchy Agent</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Tool call indicator card */}
                {msg.toolCall && (
                  <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-1">
                    <div className="flex items-center space-x-1.5 text-omarchy-accent font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tool Executed: {msg.toolCall.name}</span>
                    </div>
                    {msg.toolCall.result && (
                      <div className="text-slate-400 pl-5">
                        {msg.toolCall.result}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center space-x-2 p-3 rounded-2xl bg-omarchy-850 border border-white/5 max-w-xs animate-pulse">
            <Bot className="w-4 h-4 text-omarchy-cyan animate-spin" />
            <span className="text-slate-400 font-mono text-xs">
              Agent is reasoning and executing tools...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-4 py-2 border-t border-white/5 bg-omarchy-950 flex items-center space-x-2 overflow-x-auto no-scrollbar select-none">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            disabled={isThinking}
            className="px-2.5 py-1 rounded-full text-[11px] quickshell-pill hover:bg-white/10 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-white/10 bg-omarchy-900/80 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask agent to write code, manage files, or open tools..."
          disabled={isThinking}
          className="flex-1 px-3.5 py-2 rounded-xl bg-omarchy-950 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-omarchy-cyan/50 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isThinking}
          className="p-2.5 rounded-xl bg-omarchy-cyan hover:bg-omarchy-cyan/80 disabled:opacity-40 text-omarchy-950 font-bold transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
