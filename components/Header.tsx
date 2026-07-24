"use client";

import React, { useState } from "react";
import { Search, Bell, Sparkles, Command, User, HelpCircle, ChevronDown } from "lucide-react";

interface HeaderProps {
  title?: string;
  onOpenCommandPalette?: () => void;
}

export default function Header({ title = "Dashboard", onOpenCommandPalette }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Title / Breadcrumbs */}
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        <p className="text-xs text-slate-400">Workspace / {title}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Launcher */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search AI tools or command...</span>
          <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
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

        <div className="h-4 w-px bg-slate-800" />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#0b0f17]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-200 border-b border-slate-800 pb-2.5 mb-2.5">
                <span>Notifications</span>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">AI Proposal Generated</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Enterprise Cloud Migration Proposal for Nexus Corp</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5m ago</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="font-semibold text-slate-200">SOW Signed by Client</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Vortex AI Web Application Statement of Work</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
            VK
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
