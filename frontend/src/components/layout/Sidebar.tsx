"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Folder,
  Scissors,
  BarChart3,
  Zap,
  Sparkles,
  Settings,
  Radio,
  Sun,
  Moon,
  LogOut,
  LogIn,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { PlaceholderModal } from "./PlaceholderModal";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [modalType, setModalType] = useState<"bot" | "integrations" | "team" | "settings" | null>(null);

  const mainNav: NavItem[] = [
    {
      name: "All Meetings",
      icon: <Folder className="w-4 h-4" />,
      href: "/",
      active: pathname === "/" || pathname?.startsWith("/meetings"),
    },
    {
      name: "Soundbites",
      icon: <Scissors className="w-4 h-4" />,
      badge: "Clips",
      onClick: () => setModalType("bot"),
    },
    {
      name: "Analytics",
      icon: <BarChart3 className="w-4 h-4 text-[#D4AF37]" />,
      badge: "Talk-time",
      onClick: () => setModalType("team"),
    },
    {
      name: "Integrations",
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      badge: "60+ Apps",
      onClick: () => setModalType("integrations"),
    },
    {
      name: "AskFred AI",
      icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" />,
      badge: "AI",
      onClick: () => setModalType("bot"),
    },
    {
      name: "Settings",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => setModalType("settings"),
    },
  ];

  return (
    <>
      <aside className="w-60 flex-shrink-0 flex flex-col justify-between border-r border-[#3E4C59] bg-[#0B0B0B] text-slate-200 min-h-screen select-none relative z-20">
        <div>
          {/* Skill Sync Signature Gold Brand Header */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 px-5 py-4 border-b border-[#3E4C59] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center text-black font-extrabold text-base shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[#D4AF37]/40 transition-shadow">
              S
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                  Fireflies<span className="text-[#D4AF37]">.ai</span>
                </span>
              </div>
              <p className="text-[10px] text-[#9AA5B1] font-medium">Meeting Notes & Audio</p>
            </div>
          </div>

          {/* Add to Live Meeting CTA Button in Gold */}
          <div className="p-3">
            <button
              onClick={() => setModalType("bot")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#B5952F] text-black text-xs font-black shadow-md shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/35 transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
              <span>+ Add to Live Meeting</span>
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="px-3 py-2 space-y-1">
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#9AA5B1] uppercase tracking-widest">
              Workspace
            </div>

            {mainNav.map((item, idx) => {
              const isSelected = item.active;

              if (item.href) {
                return (
                  <button
                    key={idx}
                    onClick={() => router.push(item.href!)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm"
                        : "text-[#9AA5B1] hover:text-white hover:bg-[#1F2933]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isSelected ? "text-[#D4AF37]" : "text-[#9AA5B1]"}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#9AA5B1] hover:text-white hover:bg-[#1F2933] transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1F2933] text-[#D4AF37] border border-[#3E4C59]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: User Profile & Workspace */}
        <div className="p-3 border-t border-[#3E4C59] space-y-2 bg-[#0B0B0B]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-[#9AA5B1] hover:text-white hover:bg-[#1F2933] transition"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDarkMode ? "Obsidian Dark" : "Light Mode"}</span>
            </div>
            <span className="text-[10px] text-[#9AA5B1]">Toggle</span>
          </button>

          {/* User & Workspace Pill with Logout Action */}
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1F2933] border border-[#3E4C59] group">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center font-bold text-xs text-black shadow-sm flex-shrink-0">
                  {user.avatar || "NS"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <span className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    {user.plan || "Pro Workspace"}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 rounded-md text-[#9AA5B1] hover:text-red-400 hover:bg-[#0B0B0B] transition flex-shrink-0 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#B5952F] text-black text-xs font-bold transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </button>
          )}
        </div>
      </aside>

      <PlaceholderModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={modalType || "Feature"}
        type={modalType || "bot"}
      />
    </>
  );
};


