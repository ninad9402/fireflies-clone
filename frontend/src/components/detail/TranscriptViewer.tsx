"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Clock,
  X,
  ArrowDown,
  Scissors,
  Copy,
  Check,
} from "lucide-react";
import { TranscriptSegment } from "@/types";

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  onToggleBookmark: (segmentId: number) => void;
}

// Skill Sync themed avatar color tokens
const SPEAKER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Sarah Chen": { bg: "bg-[#D4AF37]/20", text: "text-[#D4AF37]", border: "border-[#D4AF37]/40" },
  "Alex Rivera": { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/40" },
  "Maya Patel": { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/40" },
  "David Kim": { bg: "bg-cyan-500/20", text: "text-cyan-300", border: "border-cyan-500/40" },
  "Rachel Zhang": { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/40" },
  "Thomas Miller": { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/40" },
  "Chris Evans": { bg: "bg-rose-500/20", text: "text-rose-300", border: "border-rose-500/40" },
  "Jordan Lee": { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/40" },
  "Elena Rostova": { bg: "bg-teal-500/20", text: "text-teal-300", border: "border-teal-500/40" },
};

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  currentTime,
  onSeek,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const activeSegmentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active segment if enabled
  useEffect(() => {
    if (autoScroll && activeSegmentRef.current && containerRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentTime, autoScroll]);

  const formatTimestamp = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSpeakerColor = (name: string) => {
    return (
      SPEAKER_COLORS[name] || {
        bg: "bg-[#0B0B0B]",
        text: "text-[#D4AF37]",
        border: "border-[#3E4C59]",
      }
    );
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleCopyText = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Unique speakers in this meeting
  const speakersList = useMemo(() => {
    const set = new Set<string>();
    segments.forEach((s) => set.add(s.speaker_name));
    return Array.from(set);
  }, [segments]);

  // Filtered segments
  const filteredSegments = segments.filter((s) => {
    const matchesSpeaker = !selectedSpeaker || s.speaker_name === selectedSpeaker;
    const matchesSearch = !searchQuery.trim() || s.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  // Helper to render text with search highlighting
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#D4AF37]/40 text-[#F5E6A8] font-bold px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-[#1F2933] border border-[#3E4C59] overflow-hidden text-slate-100 shadow-xl shadow-black/40">
      {/* Transcript Toolbar */}
      <div className="p-3 border-b border-[#3E4C59] bg-[#0B0B0B]/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-black text-white tracking-tight uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            Transcript
          </span>

          {/* Speaker Filter Dropdown */}
          {speakersList.length > 1 && (
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="bg-[#1F2933] border border-[#3E4C59] text-slate-200 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-[#D4AF37] transition cursor-pointer"
            >
              <option value="">All Speakers ({speakersList.length})</option>
              {speakersList.map((spk) => (
                <option key={spk} value={spk}>{spk}</option>
              ))}
            </select>
          )}
        </div>

        {/* Search & Auto-scroll controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative w-full sm:w-52">
            <Search className="w-3 h-3 text-[#9AA5B1] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-6 py-1 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9AA5B1] hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition ${
              autoScroll
                ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40 shadow-sm"
                : "bg-[#0B0B0B] text-[#9AA5B1] border-[#3E4C59] hover:text-white"
            }`}
          >
            <ArrowDown className="w-3 h-3" />
            <span>Auto-scroll</span>
          </button>
        </div>
      </div>

      {/* Segments List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredSegments.length === 0 ? (
          <div className="py-16 text-center text-[#9AA5B1] text-xs font-medium">
            No transcript lines match your search query or speaker filter.
          </div>
        ) : (
          filteredSegments.map((seg) => {
            const isActive = currentTime >= seg.start_time && currentTime < seg.end_time;
            const color = getSpeakerColor(seg.speaker_name);

            return (
              <div
                key={seg.id}
                ref={isActive ? activeSegmentRef : null}
                onClick={() => onSeek(seg.start_time)}
                className={`group p-3.5 rounded-xl transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#D4AF37]/10 border-l-[4px] border-l-[#D4AF37] border-t-[#D4AF37]/30 border-r-[#D4AF37]/30 border-b-[#D4AF37]/30 shadow-md shadow-[#D4AF37]/5"
                    : "bg-[#0B0B0B]/60 border-[#3E4C59] hover:border-[#D4AF37]/40 hover:bg-[#0B0B0B]"
                }`}
              >
                {/* Speaker Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {/* Speaker Avatar Badge */}
                    <div
                      className={`w-6 h-6 rounded-md ${color.bg} ${color.text} border ${color.border} flex items-center justify-center font-black text-[10px] shadow-sm`}
                    >
                      {getInitials(seg.speaker_name)}
                    </div>
                    <span className="font-extrabold text-xs text-white">
                      {seg.speaker_name}
                    </span>

                    {/* Clickable timestamp badge */}
                    <span className="px-1.5 py-0.5 rounded bg-[#1F2933] border border-[#3E4C59] font-mono text-[10px] font-bold text-[#D4AF37] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimestamp(seg.start_time)}
                    </span>
                  </div>

                  {/* Quick Action Bar on hover */}
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(seg.id);
                      }}
                      title={seg.is_bookmarked ? "Bookmarked Soundbite" : "Create Soundbite / Bookmark"}
                      className="p-1 rounded text-[#9AA5B1] hover:text-[#D4AF37] hover:bg-[#1F2933] transition"
                    >
                      {seg.is_bookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      ) : (
                        <Scissors className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyText(seg.id, seg.text);
                      }}
                      title="Copy text"
                      className="p-1 rounded text-[#9AA5B1] hover:text-white hover:bg-[#1F2933] transition"
                    >
                      {copiedId === seg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Dialogue Text */}
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed pl-8 font-normal">
                  {renderHighlightedText(seg.text, searchQuery)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
