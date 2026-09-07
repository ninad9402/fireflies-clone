"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  CheckSquare,
  Bot,
  Download,
  Plus,
  Trash2,
  Clock,
  Send,
  User,
  FileDown,
} from "lucide-react";
import { SummaryChapter, ActionItem, AskAiResponse } from "@/types";
import {
  createActionItem,
  updateActionItem,
  deleteActionItem,
  askAiAssistant,
  getExportDownloadUrl,
} from "@/lib/api";

interface AiSummaryPanelProps {
  meetingId: number;
  meetingTitle: string;
  overviewSummary: string;
  chapters: SummaryChapter[];
  actionItems: ActionItem[];
  onActionItemsChange: (items: ActionItem[]) => void;
  onSeek: (time: number) => void;
}

export const AiSummaryPanel: React.FC<AiSummaryPanelProps> = ({
  meetingId,
  meetingTitle,
  overviewSummary,
  chapters,
  actionItems,
  onActionItemsChange,
  onSeek,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "actions" | "ai" | "export">("summary");

  // Action item creation state
  const [newActionText, setNewActionText] = useState("");
  const [newActionAssignee, setNewActionAssignee] = useState("");
  const [addingAction, setAddingAction] = useState(false);

  // Ask AI Assistant state
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "user" | "ai"; text: string; timestamps?: number[]; speakers?: string[] }>
  >([
    {
      sender: "ai",
      text: `Hello! I'm Fred, your AI meeting assistant for "${meetingTitle}". Ask me anything about key decisions, commitments, or action items discussed in this meeting.`,
    },
  ]);

  // Handle action item toggle
  const handleToggle = async (item: ActionItem) => {
    const updatedStatus = !item.is_completed;
    // Optimistic UI update
    const updatedList = actionItems.map((a) =>
      a.id === item.id ? { ...a, is_completed: updatedStatus } : a
    );
    onActionItemsChange(updatedList);

    try {
      await updateActionItem(item.id, updatedStatus);
    } catch (err) {
      console.error(err);
      onActionItemsChange(actionItems); // revert on error
    }
  };

  // Handle action item delete
  const handleDeleteAction = async (itemId: number) => {
    const updatedList = actionItems.filter((a) => a.id !== itemId);
    onActionItemsChange(updatedList);

    try {
      await deleteActionItem(itemId);
    } catch (err) {
      console.error(err);
      onActionItemsChange(actionItems);
    }
  };

  // Handle add action item
  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;

    setAddingAction(true);
    try {
      const created = await createActionItem(
        meetingId,
        newActionText.trim(),
        newActionAssignee.trim() || "Team"
      );
      onActionItemsChange([...actionItems, created]);
      setNewActionText("");
      setNewActionAssignee("");
    } catch (err) {
      console.error(err);
    } finally {
      setAddingAction(false);
    }
  };

  // Handle Ask AI submit
  const handleAskAi = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || chatLoading) return;

    // Add user message
    setChatHistory((prev) => [...prev, { sender: "user", text: q }]);
    setChatQuestion("");
    setChatLoading(true);

    try {
      const res: AskAiResponse = await askAiAssistant(meetingId, q);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.answer,
          timestamps: res.relevant_timestamps,
          speakers: res.referenced_speakers,
        },
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I encountered an issue analyzing the transcript. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const formatTimestamp = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = actionItems.filter((a) => a.is_completed).length;

  return (
    <div className="flex flex-col h-full rounded-xl bg-[#1F2933] border border-[#3E4C59] overflow-hidden text-slate-100 shadow-xl shadow-black/40">
      {/* Top Skill Sync Tab Bar */}
      <div className="p-2 border-b border-[#3E4C59] bg-[#0B0B0B]/80 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap ${
            activeTab === "summary"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Summary</span>
        </button>

        <button
          onClick={() => setActiveTab("actions")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap ${
            activeTab === "actions"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Action Items ({actionItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap ${
            activeTab === "ai"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AskFred</span>
        </button>

        <button
          onClick={() => setActiveTab("export")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap ${
            activeTab === "export"
              ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20"
              : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: AI SUPER SUMMARY */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            {/* Overview Box */}
            <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#3E4C59]">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#D4AF37] mb-2 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Overview</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
                {overviewSummary || "No summary available for this meeting."}
              </p>
            </div>

            {/* Chapters & Timeline Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-[#9AA5B1] uppercase tracking-wider">
                  Meeting Outline & Chapters
                </h4>
                <span className="text-[10px] text-[#D4AF37] font-bold">{chapters.length} Topics</span>
              </div>

              <div className="space-y-2">
                {chapters.length === 0 ? (
                  <p className="text-xs text-[#9AA5B1]">No chapter timestamps detected.</p>
                ) : (
                  chapters.map((chap) => (
                    <div
                      key={chap.id}
                      onClick={() => onSeek(chap.start_time)}
                      className="group p-3 rounded-xl bg-[#0B0B0B] border border-[#3E4C59] hover:border-[#D4AF37]/60 hover:bg-[#151827] cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                          {chap.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#1F2933] border border-[#3E4C59] font-mono text-[10px] font-bold text-[#D4AF37] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimestamp(chap.start_time)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{chap.summary_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTION ITEMS */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            {/* Action Item Progress Bar */}
            <div className="p-3 rounded-xl bg-[#0B0B0B] border border-[#3E4C59] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Action Items Checklist</p>
                <p className="text-[11px] text-[#9AA5B1]">
                  {completedCount} of {actionItems.length} completed
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                {actionItems.length > 0 ? Math.round((completedCount / actionItems.length) * 100) : 0}%
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-1.5">
              {actionItems.length === 0 ? (
                <p className="text-xs text-[#9AA5B1] py-6 text-center">No action items yet. Add one below!</p>
              ) : (
                actionItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between gap-2.5 p-2.5 rounded-xl border transition ${
                      item.is_completed
                        ? "bg-[#0B0B0B]/50 border-[#3E4C59] text-slate-500"
                        : "bg-[#0B0B0B] border-[#3E4C59] text-slate-200 hover:border-[#D4AF37]/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.is_completed}
                        onChange={() => handleToggle(item)}
                        className="mt-0.5 w-4 h-4 rounded bg-[#1F2933] border-[#3E4C59] text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer accent-[#D4AF37]"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs leading-relaxed ${
                            item.is_completed ? "line-through text-slate-500" : "text-white font-medium"
                          }`}
                        >
                          {item.text}
                        </p>
                        {item.assignee && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D4AF37] mt-1 bg-[#D4AF37]/10 px-1.5 py-0.5 rounded border border-[#D4AF37]/20">
                            <User className="w-2.5 h-2.5" />
                            {item.assignee}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAction(item.id)}
                      title="Delete item"
                      className="p-1 rounded text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition opacity-40 hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Inline Add Action Form */}
            <form onSubmit={handleAddAction} className="pt-2 border-t border-[#3E4C59] space-y-2">
              <p className="text-xs font-bold text-slate-300">+ Add Action Item</p>
              <input
                type="text"
                placeholder="Describe next step..."
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Assignee (e.g. Sarah Chen)"
                  value={newActionAssignee}
                  onChange={(e) => setNewActionAssignee(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  disabled={addingAction || !newActionText.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#B5952F] text-black text-xs font-black flex items-center gap-1 disabled:opacity-50 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ASKFRED AI ASSISTANT */}
        {activeTab === "ai" && (
          <div className="flex flex-col h-full space-y-3">
            {/* Quick Prompt Chips */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                "Summarize key decisions",
                "What action items were assigned?",
                "What did Alex say about benchmarks?",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleAskAi(chip)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#0B0B0B] hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#3E4C59] hover:border-[#D4AF37]/50 transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat History */}
            <div className="flex-1 min-h-[220px] max-h-[360px] overflow-y-auto space-y-2.5 p-3 rounded-xl bg-[#0B0B0B] border border-[#3E4C59]">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#D4AF37] text-black rounded-br-none font-bold"
                        : "bg-[#1F2933] text-slate-200 border border-[#3E4C59] rounded-bl-none font-normal"
                    }`}
                  >
                    <div className={`flex items-center gap-1 mb-1 font-black text-[10px] uppercase ${msg.sender === "user" ? "text-black" : "text-[#D4AF37]"}`}>
                      {msg.sender === "user" ? "You" : "AskFred AI"}
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Clickable Timestamps if any */}
                    {msg.timestamps && msg.timestamps.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#3E4C59] flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[#9AA5B1] font-bold">Cited timestamps:</span>
                        {msg.timestamps.map((t, tidx) => (
                          <button
                            key={tidx}
                            onClick={() => onSeek(t)}
                            className="px-2 py-0.5 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold flex items-center gap-1 border border-[#D4AF37]/40 transition"
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimestamp(t)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-[#D4AF37] p-2 font-bold">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Fred is analyzing transcript...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi(chatQuestion);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask Fred anything about this meeting..."
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatQuestion.trim()}
                className="px-3.5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#B5952F] text-black text-xs font-black flex items-center gap-1 disabled:opacity-50 transition shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: EXPORT */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#3E4C59]">
              <h4 className="text-xs font-bold text-white mb-1">Export Meeting Records</h4>
              <p className="text-xs text-[#9AA5B1] leading-relaxed mb-4">
                Download the complete transcript with speaker diarization timestamps, executive summary, and action items.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={getExportDownloadUrl(meetingId, "markdown")}
                  download
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] text-[#D4AF37] font-bold text-xs transition group shadow-sm hover:scale-[1.02]"
                >
                  <FileDown className="w-4 h-4 text-[#D4AF37]" />
                  <span>Download Markdown (.md)</span>
                </a>

                <a
                  href={getExportDownloadUrl(meetingId, "txt")}
                  download
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] text-[#D4AF37] font-bold text-xs transition group shadow-sm hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>Download Plain Text (.txt)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
