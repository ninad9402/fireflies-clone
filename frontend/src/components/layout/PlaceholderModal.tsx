"use client";

import React from "react";
import { X, Sparkles, Bot, Zap, Users, Sliders } from "lucide-react";

interface PlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: "bot" | "integrations" | "team" | "settings";
}

export const PlaceholderModal: React.FC<PlaceholderModalProps> = ({
  isOpen,
  onClose,
  title,
  type = "bot",
}) => {
  if (!isOpen) return null;

  const getDetails = () => {
    switch (type) {
      case "bot":
        return {
          icon: <Bot className="w-8 h-8 text-[#D4AF37]" />,
          title: "Fireflies Live Meeting Bot (fred@fireflies.ai)",
          desc: "Invite Fred to automatically join your Zoom, Google Meet, Microsoft Teams, or Webex calls to record, transcribe, and summarize discussions in real-time.",
          badge: "Enterprise Feature",
          badgeColor: "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40",
        };
      case "integrations":
        return {
          icon: <Zap className="w-8 h-8 text-amber-500" />,
          title: "Ecosystem & CRM Integrations",
          desc: "Sync meeting notes and automated action items directly with Slack, Notion, Salesforce, HubSpot, Asana, and Jira.",
          badge: "Coming Soon",
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        };
      case "team":
        return {
          icon: <Users className="w-8 h-8 text-[#D4AF37]" />,
          title: "Workspace & Team Collaboration",
          desc: "Share meeting recordings with role-based access control, team channels, and synchronized soundbite clips.",
          badge: "Pro Plan",
          badgeColor: "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40",
        };
      default:
        return {
          icon: <Sliders className="w-8 h-8 text-[#D4AF37]" />,
          title: "Workspace Settings & Preferences",
          desc: "Configure transcription languages, custom vocabulary, speaker identification rules, and privacy compliance.",
          badge: "Settings",
          badgeColor: "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40",
        };
    }
  };

  const details = getDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-xl bg-[#1F2933] border border-[#3E4C59] shadow-2xl shadow-black text-slate-100 flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9AA5B1] hover:text-white hover:bg-[#0B0B0B] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-3.5 mb-3 rounded-xl bg-[#0B0B0B] border border-[#3E4C59] shadow-md">
          {details.icon}
        </div>

        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border mb-2.5 ${details.badgeColor}`}>
          {details.badge}
        </span>

        <h3 className="text-lg font-black text-white mb-2">{details.title}</h3>
        <p className="text-xs text-[#9AA5B1] mb-6 leading-relaxed font-normal">
          {details.desc}
        </p>

        <div className="w-full p-4 rounded-xl bg-[#0B0B0B] border border-[#3E4C59] text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skill Sync Prototype Note</span>
          </div>
          <p className="text-[11px] text-[#9AA5B1] leading-relaxed font-normal">
            This module is prepared as an interactive mockup for the assignment. Core meeting transcription, search, AI summaries, and interactive audio playback are fully active!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-lg font-black text-xs bg-[#D4AF37] hover:bg-[#B5952F] text-black shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Got it, Back to Workspace
        </button>
      </div>
    </div>
  );
};
