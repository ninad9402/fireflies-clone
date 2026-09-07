"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Radio,
  FolderSync,
  Bot,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOAuth, loginAsDemo, isLoading } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const fillDemoCreds = () => {
    setEmail("demo@fireflies.ai");
    setPassword("password123");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "microsoft") => {
    setSubmitting(true);
    try {
      await loginWithOAuth(provider);
    } catch (err: any) {
      setError(err?.message || "OAuth sign-in failed. Please try again.");
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#0B0B0B] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Decorative Gold Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Branding Bar */}
      <header className="px-6 py-5 flex items-center justify-between z-10 border-b border-[#3E4C59]/40 bg-[#0B0B0B]/80 backdrop-blur-md">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-[#D4AF37]/25 group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                Fireflies<span className="text-[#D4AF37]">.ai</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                Skill Sync AI
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsDemo("recruiter")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#D4AF37] bg-[#1F2933] border border-[#3E4C59] hover:border-[#D4AF37] transition"
          >
            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Recruiter Quick Login</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-xs font-semibold text-[#9AA5B1] hover:text-white transition"
          >
            Skip to App →
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero & Feature Highlights (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F2933] border border-[#3E4C59] text-xs font-bold text-[#D4AF37] w-fit shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen AI Meeting Assistant</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
              Automate your meeting notes, audio transcripts, & action items.
            </h1>

            <p className="text-sm text-[#9AA5B1] leading-relaxed">
              Log in to access real-time audio playback synchronization, speaker diarization, in-transcript keyword search, and AskFred AI meeting intelligence.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#1F2933]/80 border border-[#3E4C59] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0B0B0B] text-[#D4AF37] border border-[#3E4C59]">
                  <Radio className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">2-Way Audio Sync</h4>
                  <p className="text-[11px] text-[#9AA5B1]">Seek timestamps instantly</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1F2933]/80 border border-[#3E4C59] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0B0B0B] text-[#D4AF37] border border-[#3E4C59]">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AskFred AI</h4>
                  <p className="text-[11px] text-[#9AA5B1]">Cited timestamp summaries</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1F2933]/80 border border-[#3E4C59] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0B0B0B] text-[#D4AF37] border border-[#3E4C59]">
                  <FolderSync className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Action Items CRUD</h4>
                  <p className="text-[11px] text-[#9AA5B1]">Interactive task checklists</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1F2933]/80 border border-[#3E4C59] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#0B0B0B] text-[#D4AF37] border border-[#3E4C59]">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Pro Workspace</h4>
                  <p className="text-[11px] text-[#9AA5B1]">Zero-config serverless</p>
                </div>
              </div>
            </div>

            {/* User Testimonial / Security Note */}
            <div className="p-3.5 rounded-xl bg-[#1F2933]/40 border border-[#3E4C59]/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-600 flex items-center justify-center text-xs font-black text-black">
                NS
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">Ninad Sharma</span>
                <span className="text-[#9AA5B1]"> — Fullstack SDE Project &amp; Skill Sync UI</span>
              </div>
            </div>
          </div>

          {/* Right Floating Authentication Card */}
          <div className="w-full lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#1F2933] border border-[#3E4C59] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative backdrop-blur-xl">
              
              {/* Card Header & Tab Switcher */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#3E4C59]">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    {mode === "signin" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="text-xs text-[#9AA5B1] mt-0.5">
                    {mode === "signin"
                      ? "Sign in to access your meeting intelligence"
                      : "Start transcribing and analyzing your meetings"}
                  </p>
                </div>

                <div className="flex bg-[#0B0B0B] p-1 rounded-lg border border-[#3E4C59]">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                      mode === "signin"
                        ? "bg-[#D4AF37] text-black shadow-sm"
                        : "text-[#9AA5B1] hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                      mode === "signup"
                        ? "bg-[#D4AF37] text-black shadow-sm"
                        : "text-[#9AA5B1] hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Quick 1-Click Evaluation / Demo Bar */}
              <div className="mb-5 p-3 rounded-xl bg-[#0B0B0B] border border-[#D4AF37]/30 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    1-Click Evaluation Mode
                  </span>
                  <span className="text-[10px] text-[#9AA5B1]">Instant Login</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => loginAsDemo("admin")}
                    className="py-1.5 px-2 rounded-lg bg-[#1F2933] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#3E4C59] text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>👑 Admin Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => loginAsDemo("recruiter")}
                    className="py-1.5 px-2 rounded-lg bg-[#1F2933] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#3E4C59] text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>💼 Recruiter Demo</span>
                  </button>
                </div>
              </div>

              {/* OAuth Social Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0B0B0B] hover:bg-[#151D24] text-slate-200 border border-[#3E4C59] hover:border-[#D4AF37]/50 text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth("microsoft")}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0B0B0B] hover:bg-[#151D24] text-slate-200 border border-[#3E4C59] hover:border-[#D4AF37]/50 text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center mb-5">
                <div className="flex-grow border-t border-[#3E4C59]"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-[#9AA5B1] uppercase tracking-wider">
                  or continue with email
                </span>
                <div className="flex-grow border-t border-[#3E4C59]"></div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {error}
                </div>
              )}

              {/* Forgot password success note */}
              {forgotSent && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Password reset link sent to {email}.
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-[#9AA5B1] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ninad Sharma"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37] transition font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#9AA5B1]">
                      Work Email
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={fillDemoCreds}
                        className="text-[11px] font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Fill Demo Creds</span>
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37] transition font-medium"
                    />
                  </div>
                </div>


                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#9AA5B1]">Password</label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setForgotSent(true)}
                        className="text-[11px] font-semibold text-[#D4AF37] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#0B0B0B] border border-[#3E4C59] text-white placeholder-[#9AA5B1] text-xs focus:outline-none focus:border-[#D4AF37] transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#9AA5B1]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-[#0B0B0B] border-[#3E4C59] text-[#D4AF37] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#B5952F] hover:to-amber-700 text-black text-xs font-black shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>
                        {mode === "signin" ? "Sign In to Fireflies" : "Create Fireflies Account"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Card Footer Toggle */}
              <div className="mt-6 pt-4 border-t border-[#3E4C59] text-center text-xs text-[#9AA5B1]">
                {mode === "signin" ? (
                  <p>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-bold text-[#D4AF37] hover:underline"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="font-bold text-[#D4AF37] hover:underline"
                    >
                      Sign in instead
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#3E4C59]/40 bg-[#0B0B0B]/80 text-center text-xs text-[#9AA5B1]">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <p>© 2026 Fireflies.ai Clone — Skill Sync UI Engineering Assignment</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="text-[#D4AF37] font-semibold">SOC2 &amp; HIPAA Compliant Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
