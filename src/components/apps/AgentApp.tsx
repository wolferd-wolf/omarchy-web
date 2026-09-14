"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  Terminal,
  Code2,
  Cpu,
  Layers,
  FileCode,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
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

  const devTasks = [
    { label: "Create API Client", prompt: "Create a new TypeScript API client in projects/api.ts" },
    { label: "Check Git Status", prompt: "Inspect git status and check modified project files" },
    { label: "Run Alpine Linux VM", prompt: "Boot real x86 Linux kernel in WebAssembly" },
    { label: "Refactor Theme Tokens", prompt: "Inspect and refine Omarchy desktop theme tokens" },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#080a11] font-mono-os text-xs text-slate-200 select-none">
      {/* Agent Telemetry Header */}
      <div className="h-9 px-3 border-b border-white/[0.08] bg-[#0d101b] flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-2">
          <Bot className="w-3.5 h-3.5 text-omarchy-cyan" />
          <span className="font-bold text-slate-100">omarchy-agent daemon</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
            ACTIVE
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-slate-400 text-[10px] tabular-nums">
          <span>Engine: <strong className="text-slate-200">v4-Agentic</strong></span>
          <span>PID: <strong className="text-slate-200">210</strong></span>
          <span>Context: <strong className="text-omarchy-accent">24.5k</strong></span>
        </div>
      </div>

      {/* Execution Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 select-text bg-[#07080e]">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-lg p-3 text-xs leading-relaxed border ${
                  isUser
                    ? "bg-omarchy-cyan/10 border-omarchy-cyan/30 text-slate-100"
                    : "bg-[#0f1322] border-white/[0.08] text-slate-300"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between text-[11px] font-bold text-omarchy-cyan mb-2 pb-1.5 border-b border-white/5 select-none">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-omarchy-cyan" />
                      <span>Omarchy Autonomous Agent</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Tool execution output card */}
                {msg.toolCall && (
                  <div className="mt-2.5 p-2 rounded bg-black/60 border border-emerald-500/30 text-[11px] space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tool: {msg.toolCall.name}</span>
                    </div>
                    {msg.toolCall.result && (
                      <div className="text-slate-400 font-terminal text-[10px] pl-5 bg-black/40 p-1.5 rounded border border-white/5">
                        {msg.toolCall.result}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-[#0f1322] border border-cyan-500/30 max-w-sm text-xs animate-pulse">
            <Bot className="w-4 h-4 text-omarchy-cyan animate-spin" />
            <span className="text-cyan-300 text-[11px]">
              Analyzing filesystem, compiling code, and executing tools...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Autonomous Tasks */}
      <div className="px-3 py-1.5 border-t border-white/[0.06] bg-[#0a0c16] flex items-center space-x-2 overflow-x-auto select-none">
        <span className="text-[10px] text-slate-500 font-bold uppercase flex-shrink-0">
          Tasks:
        </span>
        {devTasks.map((task) => (
          <button
            key={task.label}
            onClick={() => sendMessage(task.prompt)}
            disabled={isThinking}
            className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/10 text-slate-300 hover:text-white text-[10px] whitespace-nowrap transition-colors border border-white/5"
          >
            {task.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-2.5 border-t border-white/[0.08] bg-[#0d101c] flex items-center space-x-2"
      >
        <span className="text-omarchy-cyan text-xs font-bold pl-1 select-none">❯</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Command agent: 'create app.js', 'inspect system', 'run tests'..."
          disabled={isThinking}
          className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono-os text-xs p-0 focus:ring-0 placeholder:text-slate-600"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isThinking}
          className="px-2.5 py-1 rounded bg-omarchy-cyan hover:bg-omarchy-cyan/80 disabled:opacity-40 text-omarchy-950 font-black text-xs transition-colors flex items-center space-x-1"
        >
          <span>EXEC</span>
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
