"use client";

import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, Trash2, Download, Save, Palette } from "lucide-react";
import { playTactileClick } from "@/core/audio/soundEffects";
import { useSystemStore } from "@/store/systemStore";
import { useFSStore } from "@/store/fsStore";

const COLORS = [
  "#22c55e", // emerald
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#ffffff", // white
  "#94a3b8", // slate
  "#0f172a", // dark slate
];

export const PaintApp: React.FC = () => {
  const { soundEffects, addNotification } = useSystemStore();
  const { writeFile } = useFSStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState("#22c55e");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0c0e18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? "#0c0e18" : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    if (soundEffects) playTactileClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0c0e18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveArtwork = () => {
    if (soundEffects) playTactileClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    writeFile("/home/user/notes/canvas_art.txt", `[CANVAS PNG EMBED: ${dataUrl.slice(0, 100)}...]`);
    addNotification("Artwork Saved", "Saved to virtual filesystem at ~/notes/canvas_art.txt", "success");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#080a12] font-mono-os text-xs text-slate-200 select-none overflow-hidden">
      {/* Paint Toolbar */}
      <div className="h-10 px-3 border-b border-white/[0.08] bg-[#0c0f18] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Colors */}
          <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-black/40 border border-white/[0.06]">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  if (soundEffects) playTactileClick();
                  setCurrentColor(c);
                  setIsEraser(false);
                }}
                className={`w-5 h-5 rounded-full transition-transform ${
                  currentColor === c && !isEraser ? "scale-110 ring-2 ring-white" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Tools */}
          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              setIsEraser(false);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              !isEraser ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
            title="Brush"
          >
            <Paintbrush className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (soundEffects) playTactileClick();
              setIsEraser(true);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isEraser ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Brush Size */}
          <div className="flex items-center space-x-1 pl-2">
            <span className="text-[10px] text-slate-500">Size:</span>
            <input
              type="range"
              min="1"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
              className="w-16 accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={saveArtwork}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Disk</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full h-full bg-[#080a12] p-2 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={640}
          height={420}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="rounded-lg shadow-xl border border-white/[0.08] cursor-crosshair bg-[#0c0e18]"
        />
      </div>
    </div>
  );
};
