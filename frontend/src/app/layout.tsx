import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";

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
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

