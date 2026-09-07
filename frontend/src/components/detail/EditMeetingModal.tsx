"use client";

import React, { useState } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { updateMeeting } from "@/lib/api";

interface EditMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
  initialTitle: string;
  initialDate: string;
  initialParticipants: string;
  onSuccess: (updatedTitle: string, updatedDate: string, updatedParticipants: string) => void;
}

export const EditMeetingModal: React.FC<EditMeetingModalProps> = ({
  isOpen,
  onClose,
  meetingId,
  initialTitle,
  initialDate,
  initialParticipants,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [participants, setParticipants] = useState(initialParticipants);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await updateMeeting(meetingId, {
        title: title.trim(),
        date,
        participants: participants.trim(),
      });
      onSuccess(title.trim(), date, participants.trim());
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update meeting details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-[#1F2933] border border-[#3E4C59] shadow-2xl shadow-black overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3E4C59] bg-[#0B0B0B]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-black text-white">Edit Meeting Details</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#9AA5B1] hover:text-white hover:bg-[#0B0B0B] transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Meeting Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white focus:outline-none focus:border-[#D4AF37] text-xs transition"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white focus:outline-none focus:border-[#D4AF37] text-xs transition"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Participants</label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] focus:outline-none focus:border-[#D4AF37] text-xs transition"
            />
          </div>

          <div className="pt-3 border-t border-[#3E4C59] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-[#9AA5B1] hover:text-white hover:bg-[#0B0B0B] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-black bg-[#D4AF37] hover:bg-[#B5952F] text-black shadow-md shadow-[#D4AF37]/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
