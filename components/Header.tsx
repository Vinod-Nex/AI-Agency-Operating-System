"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sparkles,
  Command,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  LogIn
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import { getCurrentSession, onAuthStateChange, signOutUser } from "@/lib/supabaseClient";

interface HeaderProps {
  title?: string;
  onOpenCommandPalette?: () => void;
}

export default function Header({ title = "Dashboard", onOpenCommandPalette }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    // Sync initial Supabase user or local user
    getCurrentSession().then(({ user }) => {
      if (user) {
        setCurrentUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split("@")[0]
        });
      } else if (typeof window !== "undefined") {
        const localUserStr = localStorage.getItem("agencyos_user");
        if (localUserStr) {
          try {
            const parsed = JSON.parse(localUserStr);
            setCurrentUser({ email: parsed.email, name: parsed.name });
          } catch (e) {
            // ignore JSON error
          }
        }
      }
    });

    const sub = onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0]
        });
      } else {
        // Clear local storage if logged out
        if (typeof window !== "undefined") {
          localStorage.removeItem("agencyos_user");
        }
        setCurrentUser(null);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    if (typeof window !== "undefined") {
      localStorage.removeItem("agencyos_user");
    }
    setCurrentUser(null);
    setUserMenuOpen(false);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return "AG";
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors">
        {/* Title / Breadcrumbs */}
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Workspace / {title}</p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Command Palette Launcher */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700 transition-all text-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Search AI tools or command...</span>
            <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* AI Quick Generator Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Generate Document</span>
          </button>

          {/* Theme Toggle (Sun/Moon) */}
          <ThemeToggle />

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-[#0b0f17]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-2.5">
                  <span>Notifications</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                    <p className="font-semibold text-slate-900 dark:text-slate-200">AI Proposal Generated</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Enterprise Cloud Migration Proposal for Nexus Corp</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">5m ago</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                    <p className="font-semibold text-slate-900 dark:text-slate-200">SOW Signed by Client</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Vortex AI Web Application Statement of Work</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">1h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Action */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-2 cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name || "Authenticated User"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email || "user@agencyos.ai"}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                      <Shield className="w-3 h-3" /> Supabase Session Active
                    </div>
                  </div>

                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-xs text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Account Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-semibold text-xs text-left mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out / Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Shared Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}

