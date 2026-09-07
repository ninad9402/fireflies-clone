"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Calendar, Clock, Sparkles, ArrowRight } from "lucide-react";
import { globalSearch } from "@/lib/api";
import { SearchResultItem } from "@/types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const res = await globalSearch(query);
          setResults(res);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (meetingId: number, startTime: number) => {
    onClose();
    router.push(`/meetings/${meetingId}?t=${startTime}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl bg-[#1F2933] border border-[#3E4C59] shadow-2xl shadow-black overflow-hidden text-slate-100 flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#3E4C59] bg-[#0B0B0B]">
          <Search className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search across all transcripts, topics, and speakers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-[#9AA5B1] focus:outline-none text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#9AA5B1] hover:text-white p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2.5 py-1 text-[10px] font-bold text-[#D4AF37] bg-[#1F2933] rounded border border-[#3E4C59]">
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading && (
            <div className="py-12 text-center text-xs text-[#D4AF37] flex items-center justify-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Searching transcript database...</span>
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="py-12 text-center text-[#9AA5B1] text-xs">
              <p>Type at least 2 characters to search across all recorded transcripts.</p>
              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                {["roadmap", "indexing", "latency", "pilot", "speedup"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 text-xs font-bold rounded-full bg-[#0B0B0B] text-[#D4AF37] border border-[#3E4C59] hover:border-[#D4AF37] transition"
                  >
                    "{tag}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-12 text-center text-[#9AA5B1] text-xs">
              No matching transcript lines found for <span className="text-white font-bold">"{query}"</span>.
            </div>
          )}

          {!loading && results.map((item) => {
            const mins = Math.floor(item.start_time / 60);
            const secs = Math.floor(item.start_time % 60);
            const timestampFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

            return (
              <div
                key={`${item.meeting_id}-${item.segment_id}`}
                onClick={() => handleSelect(item.meeting_id, item.start_time)}
                className="group p-4 rounded-xl bg-[#0B0B0B] hover:bg-[#25323F] border border-[#3E4C59] hover:border-[#D4AF37]/50 cursor-pointer transition flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-[#9AA5B1]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#D4AF37] group-hover:text-[#F5E6A8] transition">
                      {item.meeting_title}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#9AA5B1]" />
                      {item.meeting_date}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#1F2933] text-[#D4AF37] font-mono text-[10px] font-bold flex items-center gap-1 border border-[#3E4C59]">
                    <Clock className="w-2.5 h-2.5" />
                    {timestampFormatted}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  <span className="font-bold text-[#D4AF37]">{item.speaker_name}: </span>
                  <span>{item.text}</span>
                </div>

                <div className="flex items-center justify-end text-[11px] text-[#D4AF37] font-bold group-hover:translate-x-1 transition-transform gap-1">
                  <span>Jump to timestamp in meeting</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
