"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

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
