"use client";

import React, { useEffect, useRef, useState } from "react";
import { Gamepad2, Play, RotateCcw, Volume2 } from "lucide-react";
import { playTactileClick } from "@/core/audio/soundEffects";

export const DoomApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(50);

  // Classic Raycaster Map (1 = Wall, 0 = Empty)
  const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let posX = 2.5;
    let posY = 2.5;
    let dirX = -1;
    let dirY = 0;
    let planeX = 0;
    let planeY = 0.66;
    let animationId: number;

    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const gameLoop = () => {
      if (!isRunning) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      // Movement logic
      const moveSpeed = 0.05;
      const rotSpeed = 0.04;

      if (keys["KeyW"] || keys["ArrowUp"]) {
        if (map[Math.floor(posX + dirX * moveSpeed)][Math.floor(posY)] === 0) posX += dirX * moveSpeed;
        if (map[Math.floor(posX)][Math.floor(posY + dirY * moveSpeed)] === 0) posY += dirY * moveSpeed;
      }
      if (keys["KeyS"] || keys["ArrowDown"]) {
        if (map[Math.floor(posX - dirX * moveSpeed)][Math.floor(posY)] === 0) posX -= dirX * moveSpeed;
        if (map[Math.floor(posX)][Math.floor(posY - dirY * moveSpeed)] === 0) posY -= dirY * moveSpeed;
      }
      if (keys["KeyD"] || keys["ArrowRight"]) {
        const oldDirX = dirX;
        dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
        dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
        const oldPlaneX = planeX;
        planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
        planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);
      }
      if (keys["KeyA"] || keys["ArrowLeft"]) {
        const oldDirX = dirX;
        dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
        dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
        const oldPlaneX = planeX;
        planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
        planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
      }

      const w = canvas.width;
      const h = canvas.height;

      // Draw Ceiling & Floor
      ctx.fillStyle = "#141522";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#222430";
      ctx.fillRect(0, h / 2, w, h / 2);

      // Raycasting
      for (let x = 0; x < w; x++) {
        const cameraX = (2 * x) / w - 1;
        const rayDirX = dirX + planeX * cameraX;
        const rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(posX);
        let mapY = Math.floor(posY);

        let sideDistX = 0;
        let sideDistY = 0;

        const deltaDistX = Math.abs(1 / rayDirX);
        const deltaDistY = Math.abs(1 / rayDirY);
        let perpWallDist = 0;

        let stepX = 0;
        let stepY = 0;

        let hit = 0;
        let side = 0;

        if (rayDirX < 0) {
          stepX = -1;
          sideDistX = (posX - mapX) * deltaDistX;
        } else {
          stepX = 1;
          sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }
        if (rayDirY < 0) {
          stepY = -1;
          sideDistY = (posY - mapY) * deltaDistY;
        } else {
          stepY = 1;
          sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }

        while (hit === 0) {
          if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
          } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
          }
          if (map[mapX] && map[mapX][mapY] > 0) hit = 1;
        }

        if (side === 0) perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
        else perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;

        const lineHeight = Math.floor(h / (perpWallDist || 0.1));
        const drawStart = Math.max(0, -lineHeight / 2 + h / 2);
        const drawEnd = Math.min(h - 1, lineHeight / 2 + h / 2);

        // Wall Color with distance shading
        const shade = Math.min(1, Math.max(0.2, 1 - perpWallDist / 12));
        if (side === 1) {
          ctx.fillStyle = `rgb(${Math.floor(28 * shade)}, ${Math.floor(180 * shade)}, ${Math.floor(140 * shade)})`;
        } else {
          ctx.fillStyle = `rgb(${Math.floor(14 * shade)}, ${Math.floor(120 * shade)}, ${Math.floor(200 * shade)})`;
        }
        ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
      }

      // Render Crosshair
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 6, h / 2);
      ctx.lineTo(w / 2 + 6, h / 2);
      ctx.moveTo(w / 2, h / 2 - 6);
      ctx.lineTo(w / 2, h / 2 + 6);
      ctx.stroke();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRunning]);

  return (
    <div className="flex flex-col h-full w-full bg-black font-mono-os text-xs text-slate-200 select-none overflow-hidden">
      {/* Top Header */}
      <div className="h-8 px-3 border-b border-white/[0.08] bg-[#090b14] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100">DOOM // WASM Retro Arena</span>
          <span className="text-[10px] text-slate-500 font-mono">60 FPS</span>
        </div>
        <div className="text-[10px] text-slate-400">Controls: [W][A][S][D] or Arrow Keys</div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="flex-1 w-full relative bg-black flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={240}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Doom HUD Bar */}
      <div className="h-10 px-4 bg-[#111422] border-t-2 border-emerald-500/40 flex items-center justify-between text-xs tabular-nums select-none">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-bold">HEALTH:</span>
            <span className="text-emerald-400 font-black text-sm">{health}%</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-bold">ARMOR:</span>
            <span className="text-cyan-400 font-black text-sm">50%</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-bold">AMMO:</span>
            <span className="text-amber-400 font-black text-sm">{ammo}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-bold">SCORE: 1,420</span>
        </div>
      </div>
    </div>
  );
};
