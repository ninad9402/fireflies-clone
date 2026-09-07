"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Upload, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GlobalSearchModal } from "../dashboard/GlobalSearchModal";
import { CreateMeetingModal } from "../dashboard/CreateMeetingModal";

interface NavbarProps {
  onMeetingCreated?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMeetingCreated }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-[#3E4C59] bg-[#0B0B0B]/85 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Search trigger button (Skill Sync Obsidian style) */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#1F2933] border border-[#3E4C59] text-[#9AA5B1] hover:text-white hover:border-[#D4AF37]/50 transition text-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#9AA5B1]" />
              <span>Search transcripts, notes, keywords...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-[#D4AF37] bg-[#0B0B0B] border border-[#3E4C59] rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload / Add Meeting</span>
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#D4AF37] bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>


      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CreateMeetingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          setIsCreateOpen(false);
          if (onMeetingCreated) onMeetingCreated();
        }}
      />
    </>
  );
};
