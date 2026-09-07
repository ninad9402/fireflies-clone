import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Fireflies.ai Clone — AI Meeting Notes & Transcription",
  description: "Recreate the Fireflies.ai meeting-assistant web application with interactive transcripts, 2-way audio sync, and AI summaries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased flex">
        <ThemeProvider>
          <div className="flex w-full min-h-screen">
            {/* Left Sidebar Navigation */}
            <Sidebar />

            {/* Main Application Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
