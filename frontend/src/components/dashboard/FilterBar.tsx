"use client";

import React from "react";
import { Search, ArrowUpDown, X, User } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedParticipant: string;
  onParticipantChange: (p: string) => void;
  availableParticipants: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedParticipant,
  onParticipantChange,
  availableParticipants,
}) => {
  const hasActiveFilters = searchQuery !== "" || selectedParticipant !== "" || sortBy !== "newest";

  const clearAll = () => {
    onSearchChange("");
    onParticipantChange("");
    onSortChange("newest");
  };

  return (
    <div className="flex flex-col gap-3 mb-6 p-4 rounded-xl bg-[#1F2933] border border-[#3E4C59]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-3.5 h-3.5 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meetings by title, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37] transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA5B1] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown & Clear */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9AA5B1]" />
            <span className="text-xs text-[#9AA5B1] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-[#0B0B0B] border border-[#3E4C59] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="longest">Longest Duration</option>
              <option value="shortest">Shortest Duration</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-white font-bold px-2 py-1 rounded hover:bg-[#0B0B0B] transition"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Participant Filter Chips */}
      {availableParticipants.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-[#3E4C59] text-xs">
          <span className="text-[#9AA5B1] flex items-center gap-1 mr-1 text-[11px] font-bold">
            <User className="w-3 h-3 text-[#9AA5B1]" />
            <span>Speaker:</span>
          </span>

          <button
            onClick={() => onParticipantChange("")}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
              selectedParticipant === ""
                ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                : "bg-[#0B0B0B] text-[#9AA5B1] hover:text-white border border-[#3E4C59]"
            }`}
          >
            All Speakers
          </button>

          {availableParticipants.map((p) => (
            <button
              key={p}
              onClick={() => onParticipantChange(p === selectedParticipant ? "" : p)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                selectedParticipant === p
                  ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                  : "bg-[#0B0B0B] text-slate-300 hover:text-white border border-[#3E4C59]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
