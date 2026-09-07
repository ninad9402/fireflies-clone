"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { MeetingCard } from "@/components/dashboard/MeetingCard";
import { getMeetings, deleteMeeting } from "@/lib/api";
import { MeetingListItem } from "@/types";
import { Sparkles, RefreshCw, FolderSearch, Folder, Star, Users } from "lucide-react";

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [activeNotebookTab, setActiveNotebookTab] = useState<"all" | "shared" | "starred">("all");

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await getMeetings(
        searchQuery || undefined,
        selectedParticipant || undefined,
        sortBy
      );
      setMeetings(data);
    } catch (err) {
      console.error("Failed to load meetings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [searchQuery, selectedParticipant, sortBy]);

  const handleDeleteMeeting = async (id: number) => {
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete meeting. Please try again.");
    }
  };

  // Derive unique participants across all loaded meetings
  const availableParticipants = useMemo(() => {
    const set = new Set<string>();
    meetings.forEach((m) => {
      if (m.participants) {
        m.participants.split(",").forEach((p) => {
          const clean = p.trim().split("(")[0].trim();
          if (clean) set.add(clean);
        });
      }
    });
    return Array.from(set);
  }, [meetings]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-transparent">
      {/* Top Navbar */}
      <Navbar onMeetingCreated={loadMeetings} />

      {/* Main Content Area */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Meeting Library
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
                {meetings.length} Total
              </span>
            </div>
            <p className="text-xs text-[#9AA5B1] mt-1 font-medium">
              Browse AI-transcribed meetings, review action items, and search audio timestamps in real-time.
            </p>
          </div>

          <button
            onClick={loadMeetings}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-200 hover:text-white bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] transition self-start sm:self-auto shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#D4AF37]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Subtabs in Skill Sync Gold */}
        <div className="flex items-center gap-2 border-b border-[#3E4C59] mb-6 text-xs font-bold pb-2.5">
          <button
            onClick={() => setActiveNotebookTab("all")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeNotebookTab === "all"
                ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Meetings ({meetings.length})</span>
          </button>
          <button
            onClick={() => setActiveNotebookTab("shared")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeNotebookTab === "shared"
                ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Shared with Me</span>
          </button>
          <button
            onClick={() => setActiveNotebookTab("starred")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeNotebookTab === "starred"
                ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
                : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Starred</span>
          </button>
        </div>

        {/* Quick Stats Overview */}
        <StatsOverview meetings={meetings} />

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedParticipant={selectedParticipant}
          onParticipantChange={setSelectedParticipant}
          availableParticipants={availableParticipants}
        />

        {/* Meetings Grid */}
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <p className="text-sm text-[#9AA5B1] font-medium">Loading meeting library...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="py-20 px-4 text-center rounded-xl bg-[#1F2933] border border-[#3E4C59] flex flex-col items-center justify-center shadow-lg">
            <div className="p-4 rounded-xl bg-[#0B0B0B] text-[#D4AF37] mb-3 border border-[#3E4C59]">
              <FolderSearch className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Meetings Found</h3>
            <p className="text-xs text-[#9AA5B1] max-w-sm mb-4">
              {searchQuery || selectedParticipant
                ? "No meetings match your active search or participant filter."
                : "Your meetings library is currently empty. Click '+ Upload / Add Meeting' to create one."}
            </p>
            {(searchQuery || selectedParticipant) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedParticipant("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#D4AF37] hover:bg-[#B5952F] text-black transition shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meetings.map((m) => (
              <MeetingCard key={m.id} meeting={m} onDelete={handleDeleteMeeting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
