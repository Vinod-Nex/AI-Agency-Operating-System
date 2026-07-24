"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Plus,
  ArrowRight,
  FileCheck2,
  Receipt,
  FileSpreadsheet
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Quick Action Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Welcome back, Vinod</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
              Agency Owner
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Apex Digital Studio • 80.4% workflow automated this week
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/proposals"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Proposal</span>
          </Link>
          <Link
            href="/invoices"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">$48,250</p>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Client Accounts</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">14 Accounts</p>
            <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
              <span>3 onboarding this week</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Proposals Delivered</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">28 Generated</p>
            <div className="flex items-center gap-1 mt-1 text-purple-400 text-xs font-semibold">
              <span>85% Win Rate</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Hours Saved by AI</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-white">142 Hours</p>
            <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs font-semibold">
              <span>~$11,300 labor value</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick Launch Modules Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Automated Core Modules</span>
          </h3>
          <span className="text-xs text-slate-400">Select module to launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/proposals"
            className="glass-panel-interactive p-4 rounded-xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  Proposal Generator
                </p>
                <p className="text-[11px] text-slate-400">Custom client decks</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/contracts"
            className="glass-panel-interactive p-4 rounded-xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                  SOW & Contracts
                </p>
                <p className="text-[11px] text-slate-400">Legal scope & IP</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/invoices"
            className="glass-panel-interactive p-4 rounded-xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  AI Invoice Builder
                </p>
                <p className="text-[11px] text-slate-400">Stripe payment sync</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/jira"
            className="glass-panel-interactive p-4 rounded-xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                  Jira Generator
                </p>
                <p className="text-[11px] text-slate-400">Stories & Criteria</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Grid Layout: Active Projects & AI Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Table / Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Active Agency Projects</h3>
                <p className="text-xs text-slate-400">Status and sprint progress across client deliverables</p>
              </div>
              <Link href="/projects" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {/* Project 1 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-200">Nexus Healthcare Platform</p>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                      Sprint 3 of 6
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Client: Nexus Health Inc. • Value: $42,500</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-300">65% Done</span>
                  <div
                    role="progressbar"
                    aria-label="Nexus Healthcare Platform Progress"
                    aria-valuenow={65}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="progress-bar progress w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden"
                  >
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-200">Vortex AI E-Commerce Store</p>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                      Phase 2 Architecture
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Client: Vortex Commerce • Value: $28,000</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-300">30% Done</span>
                  <div
                    role="progressbar"
                    aria-label="Vortex AI E-Commerce Store Progress"
                    aria-valuenow={30}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="progress-bar progress w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden"
                  >
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-200">AeroLogistics Mobile Suite</p>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-semibold border border-purple-500/20">
                      Discovery & SOW
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Client: Aero Global • Value: $54,000</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-300">15% Done</span>
                  <div
                    role="progressbar"
                    aria-label="AeroLogistics Mobile Suite Progress"
                    aria-valuenow={15}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="progress-bar progress w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden"
                  >
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* AI Recent Activity Feed */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>AI System Activity Log</span>
            </h3>

            <div className="space-y-3.5 relative border-l border-slate-800 pl-4 ml-1">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#080c14]" />
                <p className="text-xs font-semibold text-slate-200">Proposal Generated</p>
                <p className="text-[11px] text-slate-400">Created 12-page RFP proposal for Nexus Health.</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">10 minutes ago</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#080c14]" />
                <p className="text-xs font-semibold text-slate-200">SOW Auto-Drafted</p>
                <p className="text-[11px] text-slate-400">Synthesized 14 Jira stories into formal SOW.</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">1 hour ago</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-[#080c14]" />
                <p className="text-xs font-semibold text-slate-200">Invoice Payment Received</p>
                <p className="text-[11px] text-slate-400">Stripe auto-settled $12,500 milestone invoice.</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
