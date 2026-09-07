"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Gauge,
} from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onPlayToggle: () => void;
  onSeek: (time: number) => void;
  onDurationChange: (duration: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  currentTime,
  duration,
  isPlaying,
  onTimeUpdate,
  onPlayToggle,
  onSeek,
  onDurationChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  // Sync isPlaying with audio element
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync external seek with audio element
  useEffect(() => {
    if (!audioRef.current) return;
    if (Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      onDurationChange(audioRef.current.duration);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    onSeek(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const nextTime = Math.max(0, Math.min(duration || 100, audioRef.current.currentTime + seconds));
    onSeek(nextTime);
    audioRef.current.currentTime = nextTime;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setSpeedMenuOpen(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate simulated waveform bars
  const waveformBars = Array.from({ length: 60 }, (_, i) => {
    const seed = (i * 7) % 19;
    return 20 + seed * 3.5;
  });

  return (
    <div className="p-4 rounded-xl bg-[#1F2933] border border-[#3E4C59] shadow-xl shadow-black/40 text-slate-100 flex flex-col gap-3 relative">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => onPlayToggle()}
        preload="metadata"
      />

      {/* Main Player Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Controls & Timestamp */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSkip(-10)}
              title="Rewind 10s"
              className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-white hover:bg-[#0B0B0B] transition text-[11px] font-bold"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayToggle}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 hover:from-amber-400 hover:to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-[#D4AF37]/30 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => handleSkip(10)}
              title="Forward 10s"
              className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-white hover:bg-[#0B0B0B] transition text-[11px] font-bold"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="font-mono text-xs text-slate-300 font-bold bg-[#0B0B0B] px-3 py-1.5 rounded-lg border border-[#3E4C59]">
            <span className="text-[#D4AF37]">{formatTime(currentTime)}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-[#9AA5B1]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Center: Gold Bullion Waveform Scrubber */}
        <div className="flex-1 w-full relative flex items-center gap-0.5 px-2 h-9 group cursor-pointer">
          {/* Waveform graphic */}
          <div className="absolute inset-0 flex items-center justify-between gap-[2px] pointer-events-none opacity-90">
            {waveformBars.map((height, i) => {
              const barPercent = (i / waveformBars.length) * 100;
              const isPlayed = barPercent <= progressPercent;

              return (
                <div
                  key={i}
                  className={`w-full rounded-full transition-colors ${
                    isPlayed ? "bg-[#D4AF37]" : "bg-[#323F4B]"
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          {/* Transparent scrub input overlay */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-9 opacity-0 cursor-pointer relative z-10"
          />
        </div>

        {/* Right: Playback Speed & Volume */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Speed Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-xs font-bold text-[#D4AF37] hover:text-white transition"
            >
              <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{playbackSpeed}x</span>
            </button>

            {speedMenuOpen && (
              <div className="absolute bottom-full mb-1.5 right-0 w-24 p-1 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] shadow-2xl z-30 space-y-0.5">
                {[1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded font-bold transition ${
                      playbackSpeed === s
                        ? "bg-[#D4AF37] text-black"
                        : "text-slate-300 hover:bg-[#1F2933]"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-[#9AA5B1] hover:text-white transition p-1"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#9AA5B1]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 bg-[#3E4C59] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
