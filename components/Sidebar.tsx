"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Receipt,
  FileSpreadsheet,
  Users,
  Briefcase,
  Settings,
  Sparkles,
  ChevronRight,
  Zap,
  Building2
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proposal Generator", href: "/proposals", icon: FileText, badge: "AI" },
  { name: "SOW & Contracts", href: "/contracts", icon: FileCheck2, badge: "AI" },
  { name: "Invoice Generator", href: "/invoices", icon: Receipt, badge: "AI" },
  { name: "Jira Story Generator", href: "/jira", icon: FileSpreadsheet, badge: "AI" },
  { name: "Client Management", href: "/clients", icon: Users },
  { name: "Project Management", href: "/projects", icon: Briefcase },
  { name: "Settings & Billing", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d131f] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              AgencyOS <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">AI Operating System</p>
          </div>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 py-3">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200">Apex Digital Studio</p>
              <p className="text-[10px] text-slate-400">12 Team Members</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Core OS Workflow
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usage Indicator & Pro Plan Banner */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-medium text-[11px]">AI Tokens Used</span>
            <span className="text-blue-400 font-bold text-[11px]">42.8k / 100k</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2.5">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[42%]" />
          </div>
          <p className="text-[10px] text-slate-400">80% Manual work saved this month</p>
        </div>
      </div>
    </aside>
  );
}
