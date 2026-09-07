"use client";

import React from "react";
import { Video, Clock, CheckSquare, Users } from "lucide-react";
import { MeetingListItem } from "@/types";

interface StatsOverviewProps {
  meetings: MeetingListItem[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ meetings }) => {
  const totalMeetings = meetings.length;
  const totalDurationSecs = meetings.reduce((acc, m) => acc + (m.duration_seconds || 0), 0);
  const totalMinutes = Math.round(totalDurationSecs / 60);

  const totalActions = meetings.reduce((acc, m) => acc + (m.action_items_count || 0), 0);
  const completedActions = meetings.reduce((acc, m) => acc + (m.completed_action_items_count || 0), 0);

  // Extract unique participants
  const participantsSet = new Set<string>();
  meetings.forEach((m) => {
    if (m.participants) {
      m.participants.split(",").forEach((p) => {
        const clean = p.trim().split("(")[0].trim();
        if (clean) participantsSet.add(clean);
      });
    }
  });

  const cards = [
    {
      title: "Total Meetings",
      value: totalMeetings,
      subtitle: "In your workspace",
      icon: <Video className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      title: "Transcribed Time",
      value: `${totalMinutes} min`,
      subtitle: `${totalDurationSecs}s audio captured`,
      icon: <Clock className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      title: "Action Items",
      value: `${completedActions} / ${totalActions}`,
      subtitle: `${totalActions - completedActions} pending tasks`,
      icon: <CheckSquare className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      title: "Participants",
      value: participantsSet.size,
      subtitle: "Across all syncs",
      icon: <Users className="w-4 h-4 text-[#D4AF37]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37]/40 flex items-center justify-between shadow-lg shadow-black/40 transition-all duration-200"
        >
          <div>
            <span className="text-[11px] font-bold text-[#9AA5B1] uppercase tracking-wider">
              {card.title}
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {card.value}
            </div>
            <div className="text-[11px] text-[#9AA5B1] font-medium">
              {card.subtitle}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59]">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
