"use client";

import React, { useState } from "react";
import { Settings, Shield, Key, Users, CreditCard, Check, Sparkles, Building2 } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"workspace" | "ai" | "team" | "billing">("workspace");
  const [agencyName, setAgencyName] = useState("Apex Digital Studio");
  const [openaiKey, setOpenaiKey] = useState("sk-proj-••••••••••••••••••••••••");
  const [claudeKey, setClaudeKey] = useState("sk-ant-••••••••••••••••••••••••");
  const [geminiKey, setGeminiKey] = useState("AIzaSy••••••••••••••••••••••••");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            <span>Workspace Settings & Billing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure agency branding, AI model API keys, team access roles, and subscription tier
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
          <span>{saved ? "Settings Saved!" : "Save Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "workspace"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" /> Workspace & Branding
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ai"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Key className="w-4 h-4" /> AI Models & API Keys
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "team"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> Team Members & Roles
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "billing"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Billing & Plan
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "workspace" && (
        <div className="glass-panel p-6 rounded-2xl max-w-2xl space-y-4 border-slate-800">
          <h2 className="text-sm font-bold text-white">Agency Branding & Details</h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Agency Email</label>
            <input
              type="email"
              defaultValue="admin@apexdigital.io"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Notification Preferences & Email Alerts</label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0" />
                <span>Email Digest & Proposal Notifications</span>
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0" />
                <span>Slack & Jira Integration Real-time Webhook Alerts</span>
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0" />
                <span>Weekly Agency Executive Performance Summary</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="glass-panel p-6 rounded-2xl max-w-2xl space-y-4 border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>BYOK (Bring Your Own Key) AI Configuration</span>
          </h2>
          <p className="text-xs text-slate-400">
            Provide your API keys to enable custom high-limit prompt synthesis across Anthropic, OpenAI, and Google Gemini models.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Anthropic Claude API Key</label>
            <input
              type="password"
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="glass-panel p-6 rounded-2xl max-w-2xl space-y-6 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Team Members & Role Access</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage agency team members, admin privileges, and project assignments.</p>
            </div>
            <button
              onClick={() => alert("Invite Team Member...")}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
            >
              + Invite Member
            </button>
          </div>

          <div className="space-y-3">
            {[
              { id: 1, name: "Vinod Kumar", email: "vinod@apexdigital.io", role: "Owner / Admin", status: "Active" },
              { id: 2, name: "Sarah Jenkins", email: "sarah@apexdigital.io", role: "Lead Architect", status: "Active" },
              { id: 3, name: "Alex Chen", email: "alex@apexdigital.io", role: "Senior Engineer", status: "Active" },
              { id: 4, name: "Elena Rostova", email: "elena@apexdigital.io", role: "UX Designer", status: "Invited" }
            ].map((member) => (
              <div key={member.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-200">{member.name}</p>
                  <p className="text-[11px] text-slate-400">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    aria-label={`Role for ${member.name}`}
                    defaultValue={member.role}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Owner / Admin">Owner / Admin</option>
                    <option value="Lead Architect">Lead Architect</option>
                    <option value="Senior Engineer">Senior Engineer</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    member.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {activeTab === "billing" && (
        <div className="glass-panel p-6 rounded-2xl max-w-2xl space-y-6 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Current Subscription</h2>
              <p className="text-xs text-slate-400 mt-0.5">Professional Agency Plan ($79/mo)</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Active Plan
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Next Billing Date:</span>
              <span className="font-semibold">August 23, 2026</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Payment Card:</span>
              <span className="font-mono">Visa ending in •••• 4242</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
