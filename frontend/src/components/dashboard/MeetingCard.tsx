"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  CheckSquare,
  Trash2,
  ArrowRight,
  FileText,
} from "lucide-react";
import { MeetingListItem } from "@/types";

interface MeetingCardProps {
  meeting: MeetingListItem;
  onDelete: (id: number) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const mins = Math.floor(meeting.duration_seconds / 60);
  const secs = meeting.duration_seconds % 60;
  const durationFormatted = `${mins}m ${secs.toString().padStart(2, "0")}s`;

  const participantsList = meeting.participants
    ? meeting.participants.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${meeting.title}"?`)) {
      setIsDeleting(true);
      onDelete(meeting.id);
    }
  };

  return (
    <div
      onClick={() => router.push(`/meetings/${meeting.id}`)}
      className="group relative p-5 rounded-xl bg-[#1F2933] hover:bg-[#25323F] border border-[#3E4C59] hover:border-[#D4AF37]/60 cursor-pointer transition-all duration-200 shadow-xl shadow-black/40 hover:shadow-[#D4AF37]/10 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Title & Delete CTA */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate flex-1">
            {meeting.title}
          </h3>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Meeting"
            className="p-1 rounded text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition opacity-40 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Date & Duration Badges */}
        <div className="flex items-center gap-2 text-xs text-[#9AA5B1] mb-3">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-[#9AA5B1]" />
            {meeting.date}
          </span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-[#0B0B0B] text-[#D4AF37] border border-[#3E4C59] font-mono text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {durationFormatted}
          </span>
        </div>

        {/* AI Summary Snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed font-normal">
          {meeting.overview_summary || "Automated transcript and notes generated."}
        </p>

        {/* Participants Chips */}
        {participantsList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {participantsList.slice(0, 3).map((p, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0B0B0B] text-slate-300 border border-[#3E4C59] truncate max-w-[120px]"
              >
                {p}
              </span>
            ))}
            {participantsList.length > 3 && (
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#0B0B0B] text-[#9AA5B1] border border-[#3E4C59]">
                +{participantsList.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Stats & Enter Arrow */}
      <div className="pt-3 border-t border-[#3E4C59] flex items-center justify-between text-xs text-[#9AA5B1]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-300 text-[11px] font-medium">
            <CheckSquare className="w-3 h-3 text-[#D4AF37]" />
            <span>
              {meeting.completed_action_items_count}/{meeting.action_items_count} Tasks
            </span>
          </span>

          <span className="flex items-center gap-1 text-slate-300 text-[11px] font-medium">
            <FileText className="w-3 h-3 text-[#D4AF37]" />
            <span>{meeting.segments_count} lines</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-xs group-hover:translate-x-1 transition-transform">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
