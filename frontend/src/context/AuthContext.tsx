"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan: string;
}

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  plan: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  loginAsDemo: (role?: "admin" | "recruiter") => void;
  logout: () => void;
}

const SESSION_KEY = "fireflies_current_session";
const USERS_DB_KEY = "fireflies_users_database";

// Pre-seeded initial registered accounts
const INITIAL_ACCOUNTS: RegisteredAccount[] = [
  {
    id: "usr_admin",
    name: "Ninad Sharma",
    email: "ninadsharma27@gmail.com",
    password: "password123",
    role: "Workspace Owner",
    avatar: "NS",
    plan: "Pro Workspace",
    createdAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "usr_demo",
    name: "Demo Evaluator",
    email: "demo@fireflies.ai",
    password: "password123",
    role: "Hiring Manager",
    avatar: "DE",
    plan: "Pro Workspace",
    createdAt: "2026-09-02T00:00:00.000Z",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper to get registered accounts
  const getRegisteredAccounts = (): RegisteredAccount[] => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Seed default accounts
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  };

  // Helper to save registered accounts
  const saveRegisteredAccounts = (accounts: RegisteredAccount[]) => {
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error("Failed to save accounts database", e);
    }
  };

  // Check active session on mount
  useEffect(() => {
    try {
      // Ensure default accounts exist
      getRegisteredAccounts();

      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.email) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to read auth state", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // SIGN IN: Verifies against registered user database
  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setIsLoading(false);
      throw new Error("Please enter a valid email address.");
    }
    if (!cleanPass) {
      setIsLoading(false);
      throw new Error("Please enter your password.");
    }

    const accounts = getRegisteredAccounts();
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (!existing) {
      setIsLoading(false);
      throw new Error(
        `No account found with "${cleanEmail}". Please Sign Up first to create your account.`
      );
    }

    if (existing.password !== cleanPass) {
      setIsLoading(false);
      throw new Error("Incorrect password. Please check your credentials and try again.");
    }

    const sessionUser: User = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
      avatar: existing.avatar,
      plan: existing.plan,
    };

    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setIsLoading(false);
    return true;
  };

  // SIGN UP: Registers a new user account
  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanName || cleanName.length < 2) {
      setIsLoading(false);
      throw new Error("Please enter your full name (minimum 2 characters).");
    }
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setIsLoading(false);
      throw new Error("Please enter a valid work email address.");
    }
    if (!cleanPass || cleanPass.length < 6) {
      setIsLoading(false);
      throw new Error("Password must be at least 6 characters long.");
    }

    const accounts = getRegisteredAccounts();
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (existing) {
      setIsLoading(false);
      throw new Error(
        `An account with "${cleanEmail}" already exists. Please Sign In instead.`
      );
    }

    const initials = cleanName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() || "")
      .join("") || "US";

    const newAccount: RegisteredAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: "Member",
      avatar: initials,
      plan: "Pro Workspace",
      createdAt: new Date().toISOString(),
    };

    const updated = [...accounts, newAccount];
    saveRegisteredAccounts(updated);

    const sessionUser: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      avatar: newAccount.avatar,
      plan: newAccount.plan,
    };

    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setIsLoading(false);
    return true;
  };

  // Fast Demo 1-Click Evaluation Login
  const loginAsDemo = (role: "admin" | "recruiter" = "admin") => {
    const targetEmail = role === "admin" ? "ninadsharma27@gmail.com" : "demo@fireflies.ai";
    const accounts = getRegisteredAccounts();
    const account =
      accounts.find((acc) => acc.email === targetEmail) ||
      (role === "admin" ? INITIAL_ACCOUNTS[0] : INITIAL_ACCOUNTS[1]);

    const sessionUser: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
      plan: account.plan,
    };

    setUser(sessionUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
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
