"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithOAuth: (provider: "google" | "microsoft") => Promise<void>;
  loginAsDemo: (role?: "admin" | "recruiter") => void;
  logout: () => void;
}

const DEFAULT_USER: User = {
  id: "usr_1",
  name: "Ninad Sharma",
  email: "ninadsharma27@gmail.com",
  role: "Workspace Owner",
  avatar: "NS",
  plan: "Pro Workspace",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "fireflies_auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default to logged in as Ninad Sharma for zero-friction demo experience
        setUser(DEFAULT_USER);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      }
    } catch (e) {
      console.error("Failed to read auth state", e);
      setUser(DEFAULT_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate short network latency for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = nameFromEmail
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const initials = formattedName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() || "")
      .join("") || "US";

    const loggedInUser: User = {
      id: `usr_${Date.now()}`,
      name: formattedName || "User",
      email: email.toLowerCase(),
      role: "Member",
      avatar: initials,
      plan: "Pro Workspace",
    };

    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    setIsLoading(false);
    return true;
  };

  const loginWithOAuth = async (provider: "google" | "microsoft") => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const oAuthUser: User =
      provider === "google"
        ? {
            id: `usr_google_${Date.now()}`,
            name: "Ninad Sharma (Google)",
            email: "ninadsharma27@gmail.com",
            role: "Workspace Admin",
            avatar: "NS",
            plan: "Pro Workspace",
          }
        : {
            id: `usr_msft_${Date.now()}`,
            name: "Ninad Sharma (Microsoft)",
            email: "ninad.sharma@outlook.com",
            role: "Enterprise Lead",
            avatar: "NS",
            plan: "Enterprise Suite",
          };

    setUser(oAuthUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oAuthUser));
    setIsLoading(false);
    router.push("/");
  };

  const loginAsDemo = (role: "admin" | "recruiter" = "admin") => {
    const demoUser: User =
      role === "admin"
        ? DEFAULT_USER
        : {
            id: "usr_recruiter",
            name: "Recruiter / Evaluator",
            email: "evaluator@fireflies.ai",
            role: "Hiring Manager",
            avatar: "RE",
            plan: "Pro Workspace",
          };

    setUser(demoUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOAuth,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
