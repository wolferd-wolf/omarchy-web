"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Sparkles,
  Disc,
} from "lucide-react";
import { playTactileClick } from "@/core/audio/soundEffects";

interface Track {
  id: string;
  title: string;
  artist: string;
  station: string;
  bpm: number;
}

const TRACKS: Track[] = [
  { id: "1", title: "Hyprland Night Drive", artist: "Omarchy Synth Lab", station: "Cyberpunk Lo-Fi", bpm: 84 },
  { id: "2", title: "Nordic Aurora Horizon", artist: "Arch Ambient", station: "Deep Chill", bpm: 72 },
  { id: "3", title: "Kernel Panic in Tokyo", artist: "Zsh Beats", station: "Synthwave 1984", bpm: 110 },
  { id: "4", title: "Autonomous Agent Coding", artist: "AI Core", station: "Brainwave Alpha", bpm: 90 },
];

export const MusicApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  const track = TRACKS[currentTrackIdx];

  // Visualizer loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const numBars = 32;
    const bars: number[] = new Array(numBars).fill(10);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const barWidth = canvas.width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        if (isPlaying) {
          const target = Math.sin(Date.now() * 0.005 + i * 0.3) * 35 + 45 + Math.random() * 20;
          bars[i] += (target - bars[i]) * 0.2;
        } else {
          bars[i] += (4 - bars[i]) * 0.1;
        }

        const barHeight = Math.max(3, (bars[i] / 100) * canvas.height * (volume / 100));
        const x = i * (barWidth + 2);
        const y = canvas.height - barHeight;

        // Gradient color for bars: emerald to cyan to violet
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, "#22c55e");
        grad.addColorStop(0.6, "#06b6d4");
        grad.addColorStop(1, "#8b5cf6");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Peak dot
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y - 2, barWidth, 1.5);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, volume]);

  // Audio synthesis loop when playing
  useEffect(() => {
    if (isPlaying) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      const actx = audioCtxRef.current;
      if (actx && actx.state === "suspended") {
        actx.resume().catch(() => {});
      }

      // Play periodic subtle lo-fi chord progression
      const notes = [220, 261.63, 329.63, 392.0]; // Am7 chord notes
      let noteIdx = 0;

      synthIntervalRef.current = setInterval(() => {
        if (!actx || isMuted) return;
        try {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(notes[noteIdx % notes.length], actx.currentTime);

          const actualVol = (volume / 100) * 0.03;
          gain.gain.setValueAtTime(actualVol, actx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.6);

          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start();
          osc.stop(actx.currentTime + 0.6);

          noteIdx++;
        } catch {
          // ignore
        }
      }, 700);
    } else {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    }

    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [isPlaying, isMuted, volume]);

  const togglePlay = () => {
    playTactileClick();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    playTactileClick();
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    playTactileClick();
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#080912] font-mono-os text-xs text-slate-200 select-none overflow-hidden p-4 space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center space-x-2.5">
          <Disc className={`w-5 h-5 text-emerald-400 ${isPlaying ? "animate-spin" : ""}`} />
          <div>
            <div className="font-bold text-slate-100 text-sm">{track.title}</div>
            <div className="text-[11px] text-slate-400">
              {track.artist} • <span className="text-cyan-400">{track.station}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isPlaying ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-white/10 text-slate-400"
            }`}
          >
            {isPlaying ? "LIVE STREAM" : "PAUSED"}
          </span>
          <span className="text-[10px] text-slate-500 tabular-nums">{track.bpm} BPM</span>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="flex-1 w-full bg-black/50 border border-white/[0.08] rounded-xl overflow-hidden relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={160}
          className="w-full h-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105"
            >
              <Play className="w-6 h-6 fill-current" />
            </button>
            <span className="text-[11px] text-slate-300 font-semibold mt-2">Click to start audio station</span>
          </div>
        )}
      </div>

      {/* Player Controls Bar */}
      <div className="flex items-center justify-between px-2 pt-2 border-t border-white/[0.06]">
        {/* Playback Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={prevTrack}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-white"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseInt(e.target.value, 10));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
          />
          <span className="text-[10px] tabular-nums text-slate-400 w-8">{isMuted ? "0%" : `${volume}%`}</span>
        </div>
      </div>
    </div>
  );
};
