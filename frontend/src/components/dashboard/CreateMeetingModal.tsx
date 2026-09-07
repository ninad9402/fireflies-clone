"use client";

import React, { useState } from "react";
import { X, Upload, Sparkles, Plus } from "lucide-react";
import { createMeeting } from "@/lib/api";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<"transcript" | "form">("transcript");
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [participants, setParticipants] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [summary, setSummary] = useState("");
  const [rawTranscript, setRawTranscript] = useState("");
  const [rawActions, setRawActions] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRawTranscript(content);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    setTitle("Product Marketing & Launch Strategy Sync");
    setDate(new Date().toISOString().split("T")[0]);
    setParticipants("Sarah Chen, Alex Rivera, Liam Vance");
    setSummary("Alignment on product launch assets, website copy, and beta user invitations for Q4 release.");
    setRawTranscript(
      `Sarah Chen (00:00): Welcome Liam and Alex. Let's align on our launch marketing timeline.\nAlex Rivera (00:15): I've prepared the landing page demos and the video walkthroughs.\nLiam Vance (00:35): We should send the invitation emails to our 500 waitlist users by Wednesday.\nSarah Chen (00:55): Agreed! Let's ensure the analytics tracking is configured before sending.`
    );
    setRawActions("Review landing page copy\nSend waitlist email invitations\nConfigure analytics event tracking");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a meeting title.");
      return;
    }

    setLoading(true);
    try {
      const actionItemsList = rawActions
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);

      await createMeeting({
        title: title.trim(),
        date,
        duration_seconds: durationMinutes * 60,
        participants: participants.trim(),
        overview_summary: summary.trim(),
        raw_transcript: rawTranscript.trim() || undefined,
        action_items_list: actionItemsList.length > 0 ? actionItemsList : undefined,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create meeting. Please check inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-xl bg-[#1F2933] border border-[#3E4C59] shadow-2xl shadow-black overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3E4C59] bg-[#0B0B0B]/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Create / Upload Meeting</h3>
              <p className="text-xs text-[#9AA5B1]">Add transcript dialog or notes to your workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-white hover:bg-[#0B0B0B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection & Pre-fill Demo */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#3E4C59] bg-[#0B0B0B]">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("transcript")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === "transcript"
                  ? "bg-[#D4AF37] text-black shadow-sm"
                  : "text-[#9AA5B1] hover:text-white"
              }`}
            >
              Paste / Upload Transcript
            </button>
            <button
              onClick={() => setTab("form")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === "form"
                  ? "bg-[#D4AF37] text-black shadow-sm"
                  : "text-[#9AA5B1] hover:text-white"
              }`}
            >
              Quick Form
            </button>
          </div>

          <button
            type="button"
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Load Sample</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              Meeting Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Marketing Campaign Kickoff"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] focus:outline-none focus:border-[#D4AF37] text-xs transition"
            />
          </div>

          {/* Date & Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Meeting Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white focus:outline-none focus:border-[#D4AF37] text-xs transition"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Participants</label>
              <input
                type="text"
                placeholder="Sarah Chen, Alex Rivera..."
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] focus:outline-none focus:border-[#D4AF37] text-xs transition"
              />
            </div>
          </div>

          {tab === "transcript" ? (
            <>
              {/* Transcript File or Text Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-bold">
                    Paste Transcript Lines <span className="text-[#9AA5B1] font-normal">(Auto-parsed with timestamps)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-[#D4AF37] hover:text-[#B5952F] font-bold text-xs transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .txt/.json</span>
                    <input type="file" accept=".txt,.json,.vtt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <textarea
                  rows={5}
                  placeholder={`Speaker Name (MM:SS): Spoken dialog here...\nAlex Rivera (00:15): Next speaker sentence...`}
                  value={rawTranscript}
                  onChange={(e) => setRawTranscript(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] font-mono text-xs focus:outline-none focus:border-[#D4AF37] leading-relaxed transition"
                />
              </div>

              {/* Action items input */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Action Items <span className="text-[#9AA5B1] font-normal">(One per line)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Task 1&#10;Task 2"
                  value={rawActions}
                  onChange={(e) => setRawActions(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>
            </>
          ) : (
            <>
              {/* Quick Form details */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Duration (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white focus:outline-none focus:border-[#D4AF37] text-xs transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Meeting Summary & Notes</label>
                <textarea
                  rows={4}
                  placeholder="Key discussion topics and overview..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>
            </>
          )}

          {/* Footer Submit Button */}
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-black bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-lg shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Meeting</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
