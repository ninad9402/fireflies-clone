"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Share2,
  Users,
  Sparkles,
  ChevronRight,
  Folder,
} from "lucide-react";
import { getMeetingDetail, deleteMeeting, toggleBookmark } from "@/lib/api";
import { MeetingDetail, ActionItem } from "@/types";
import { AudioPlayer } from "@/components/detail/AudioPlayer";
import { TranscriptViewer } from "@/components/detail/TranscriptViewer";
import { AiSummaryPanel } from "@/components/detail/AiSummaryPanel";
import { EditMeetingModal } from "@/components/detail/EditMeetingModal";
import { PlaceholderModal } from "@/components/layout/PlaceholderModal";

function MeetingDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const meetingId = Number(params?.id || 1);

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronized Audio & Transcript State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Load meeting detail
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMeetingDetail(meetingId);
        setMeeting(data);
        setDuration(data.duration_seconds || 180);

        // Check if timestamp URL query param exists (e.g. ?t=45)
        const initialTime = searchParams?.get("t");
        if (initialTime) {
          const parsed = parseFloat(initialTime);
          if (!isNaN(parsed)) {
            setCurrentTime(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load meeting details", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [meetingId, searchParams]);

  const handleSeek = (targetTime: number) => {
    setCurrentTime(targetTime);
  };

  const handleToggleBookmark = async (segmentId: number) => {
    if (!meeting) return;
    try {
      const updated = await toggleBookmark(segmentId);
      setMeeting({
        ...meeting,
        segments: meeting.segments.map((s) => (s.id === segmentId ? updated : s)),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!meeting) return;
    if (confirm(`Are you sure you want to delete "${meeting.title}"?`)) {
      try {
        await deleteMeeting(meeting.id);
        router.push("/");
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-screen">
        <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin mb-3" />
        <p className="text-xs text-[#9AA5B1] font-medium">Loading meeting transcript...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-screen">
        <h2 className="text-base font-bold text-white mb-2">Meeting Not Found</h2>
        <p className="text-xs text-[#9AA5B1] mb-4">The requested meeting could not be loaded.</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#D4AF37] text-black"
        >
          Back to Meetings
        </button>
      </div>
    );
  }

  const participantsList = meeting.participants
    ? meeting.participants.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 max-w-[1600px] mx-auto w-full min-h-screen bg-transparent">
      {/* Skill Sync Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#9AA5B1] mb-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 hover:text-[#D4AF37] transition font-medium"
        >
          <Folder className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Meetings</span>
        </button>
        <ChevronRight className="w-3 h-3 text-[#3E4C59]" />
        <span className="text-white font-semibold truncate max-w-sm">{meeting.title}</span>
      </div>

      {/* Meeting Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#3E4C59]">
        <div>
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
            {meeting.title}
          </h1>

          {/* Date, Duration & Participants */}
          <div className="flex items-center gap-2.5 text-xs text-[#9AA5B1] mt-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-[#9AA5B1]" />
              {meeting.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#D4AF37] font-mono text-[11px] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              <Clock className="w-2.5 h-2.5" />
              {Math.floor(meeting.duration_seconds / 60)}m {meeting.duration_seconds % 60}s
            </span>
            {participantsList.length > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Users className="w-3 h-3 text-amber-500" />
                  <span>{participantsList.join(", ")}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] text-slate-200 hover:text-[#D4AF37] text-xs font-bold transition shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] text-slate-200 hover:text-[#D4AF37] text-xs font-bold transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDelete}
            title="Delete Meeting"
            className="p-2 rounded-lg bg-[#1F2933] border border-[#3E4C59] text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gold Waveform Audio Player */}
      <div className="mb-4">
        <AudioPlayer
          audioUrl={meeting.audio_url || "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3"}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onTimeUpdate={(t) => setCurrentTime(t)}
          onPlayToggle={() => setIsPlaying(!isPlaying)}
          onSeek={handleSeek}
          onDurationChange={(d) => setDuration(d)}
        />
      </div>

      {/* Main Grid: Transcript & AI Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[550px]">
        {/* Left: Smart Transcript Viewer (7 cols on lg) */}
        <div className="lg:col-span-7 h-full">
          <TranscriptViewer
            segments={meeting.segments}
            currentTime={currentTime}
            onSeek={handleSeek}
            onToggleBookmark={handleToggleBookmark}
          />
        </div>

        {/* Right: AI Summary, Action Items & AskFred (5 cols on lg) */}
        <div className="lg:col-span-5 h-full">
          <AiSummaryPanel
            meetingId={meeting.id}
            meetingTitle={meeting.title}
            overviewSummary={meeting.overview_summary}
            chapters={meeting.chapters}
            actionItems={meeting.action_items}
            onActionItemsChange={(items: ActionItem[]) =>
              setMeeting({ ...meeting, action_items: items })
            }
            onSeek={handleSeek}
          />
        </div>
      </div>

      {/* Edit Meeting Metadata Modal */}
      <EditMeetingModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        meetingId={meeting.id}
        initialTitle={meeting.title}
        initialDate={meeting.date}
        initialParticipants={meeting.participants}
        onSuccess={(title, date, participants) => {
          setMeeting({
            ...meeting,
            title,
            date,
            participants,
          });
        }}
      />

      {/* Share / Team Modal */}
      <PlaceholderModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share & Collaboration"
        type="team"
      />
    </div>
  );
}

export default function MeetingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 bg-[#0B0B0B] text-slate-300">
          <div className="flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <p className="text-sm font-medium text-[#9AA5B1]">Loading meeting intelligence...</p>
          </div>
        </div>
      }
    >
      <MeetingDetailContent />
    </Suspense>
  );
}

