"use client";

import React, { useState } from "react";
import { Calculator, Delete, RotateCcw } from "lucide-react";
import { playKeyTick, playTactileClick } from "@/core/audio/soundEffects";
import { useSystemStore } from "@/store/systemStore";

export const CalcApp: React.FC = () => {
  const { soundEffects } = useSystemStore();
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isProgrammerMode, setIsProgrammerMode] = useState(true);

  const numVal = parseInt(display, 10) || 0;

  const hexVal = numVal.toString(16).toUpperCase();
  const decVal = numVal.toString(10);
  const octVal = numVal.toString(8);
  const binVal = (numVal >>> 0).toString(2).padStart(16, "0").replace(/(.{4})/g, "$1 ").trim();

  const handleDigit = (d: string) => {
    if (soundEffects) playKeyTick();
    if (display === "0" && d !== ".") {
      setDisplay(d);
    } else {
      setDisplay((prev) => prev + d);
    }
  };

  const handleOp = (op: string) => {
    if (soundEffects) playTactileClick();
    setEquation(`${display} ${op}`);
    setDisplay("0");
  };

  const handleEqual = () => {
    if (soundEffects) playTactileClick();
    try {
      const full = `${equation} ${display}`.replace(/×/g, "*").replace(/÷/g, "/");
      // Safe math evaluation
      // eslint-disable-next-line no-new-func
      const res = Function(`"use strict"; return (${full})`)();
      setDisplay(String(Math.floor(res)));
      setEquation("");
    } catch {
      setDisplay("ERR");
    }
  };

  const handleClear = () => {
    if (soundEffects) playTactileClick();
    setDisplay("0");
    setEquation("");
  };

  const handleBackspace = () => {
    if (soundEffects) playKeyTick();
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const buttons = [
    ["C", "CE", "⌫", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#080a12] font-mono-os text-xs text-slate-200 select-none overflow-hidden p-3 space-y-2">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 text-[11px]">
        <div className="flex items-center space-x-1.5 font-bold text-slate-300">
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span>Programmer Calc</span>
        </div>
        <button
          onClick={() => setIsProgrammerMode(!isProgrammerMode)}
          className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/10 text-cyan-400 text-[10px]"
        >
          {isProgrammerMode ? "Programmer" : "Standard"}
        </button>
      </div>

      {/* Numerical Bases Strip (HEX, DEC, OCT, BIN) */}
      {isProgrammerMode && (
        <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06] space-y-1 text-[10px] tabular-nums">
          <div className="flex justify-between">
            <span className="text-slate-500 font-bold">HEX</span>
            <span className="text-purple-400 font-bold">{hexVal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-bold">DEC</span>
            <span className="text-emerald-400 font-bold">{decVal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-bold">OCT</span>
            <span className="text-amber-400 font-bold">{octVal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-bold">BIN</span>
            <span className="text-cyan-400 text-[9px]">{binVal}</span>
          </div>
        </div>
      )}

      {/* Main Display */}
      <div className="p-3 rounded-lg bg-[#0e121e] border border-white/[0.08] text-right">
        <div className="h-4 text-[10px] text-slate-500">{equation}</div>
        <div className="text-2xl font-bold text-slate-100 tabular-nums truncate tracking-tight">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="flex-1 grid grid-cols-4 gap-1.5 pt-1">
        {buttons.flat().map((btn) => {
          const isOp = ["÷", "×", "-", "+", "="].includes(btn);
          const isSpecial = ["C", "CE", "⌫"].includes(btn);

          return (
            <button
              key={btn}
              onClick={() => {
                if (btn === "C") handleClear();
                else if (btn === "CE") setDisplay("0");
                else if (btn === "⌫") handleBackspace();
                else if (btn === "=") handleEqual();
                else if (isOp) handleOp(btn);
                else if (btn === "±") setDisplay(String(-parseInt(display, 10) || 0));
                else handleDigit(btn);
              }}
              className={`flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                btn === "="
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/10"
                  : isOp
                  ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30"
                  : isSpecial
                  ? "bg-white/[0.08] text-rose-300 hover:bg-rose-500/20"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.04]"
              }`}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
};
