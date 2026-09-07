"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isAuthPage) {
        router.replace("/login");
      } else if (isAuthenticated && isAuthPage) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isLoading, isAuthPage, router]);

  // Loading state while verifying auth session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0B0B0B] flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center font-black text-black text-base shadow-lg shadow-[#D4AF37]/30 animate-pulse">
            S
          </div>
          <p className="text-xs text-[#9AA5B1] font-medium tracking-wide">
            Verifying workspace credentials...
          </p>
        </div>
      </div>
    );
  }

  // If unauthenticated and on a protected page, show redirecting barrier
  if (!isAuthenticated && !isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-[#0B0B0B] flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1F2933] border border-[#3E4C59] flex items-center justify-center text-[#D4AF37]">
            🔒
          </div>
          <p className="text-xs text-[#9AA5B1] font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <main className="flex-1 min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Application Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

