"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Sparkles, Copy, Check, ExternalLink, RefreshCw, BarChart2, Layers, CheckCircle2 } from "lucide-react";

export default function JiraGeneratorPage() {
  const [meetingNotes, setMeetingNotes] = useState(
    "Client wants a responsive user profile management page where users can update avatar image, edit bio text, change password with current password verification, toggle email notifications, and download account GDPR data dump."
  );

  const [copied, setCopied] = useState(false);
  const [synced, setSynced] = useState(false);
  const [stories, setStories] = useState<any[]>([
    {
      id: "AGENCY-101",
      title: "User Profile Avatar & Bio Update Interface",
      points: 3,
      priority: "High",
      type: "Feature",
      epic: "Enterprise Authentication & Profile",
      description: "As a registered agency client user, I want to edit my profile bio and upload a custom avatar picture so that my team members can identify me.",
      acceptance: [
        "Given user is on Profile Settings page",
        "When avatar image (<5MB PNG/JPG) is uploaded",
        "Then system previews image and updates S3 bucket URL",
        "And displays success toast notification"
      ]
    },
    {
      id: "AGENCY-102",
      title: "Password Verification & Auth Security Flow",
      points: 5,
      priority: "Highest",
      type: "Security",
      epic: "Enterprise Authentication & Profile",
      description: "As a security-conscious user, I want password updates to require current password verification and multi-factor validation.",
      acceptance: [
        "Verify current password against bcrypt hash",
        "Enforce 12+ character complexity requirement",
        "Invalidate active refresh tokens on successful update"
      ]
    }
  ]);

  const handleGenerate = () => {
    setStories([
      ...stories,
      {
        id: `AGENCY-${103 + stories.length}`,
        title: "GDPR Account Data Dump & Download",
        points: 2,
        priority: "Medium",
        type: "Compliance",
        epic: "Compliance & Data Governance",
        description: "As a compliant platform user, I want to request and download a ZIP file of all my stored personal data.",
        acceptance: [
          "Generate JSON package of account audit logs and profile records",
          "Provide secure 24-hour signed download link"
        ]
      }
    ]);
  };

  const handleSyncSprint = () => {
    setSynced(true);
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(stories, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-400" />
            <span>Jira Integration Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synchronized agile sprint metrics, ticket distribution, and automated backlog generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied JSON!" : "Copy JSON"}</span>
          </button>
          <button
            onClick={handleSyncSprint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${synced ? "animate-spin" : ""}`} />
            <span>Sync sprint status updates</span>
          </button>
        </div>
      </div>

      {synced && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center gap-3 text-purple-300 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
          <span>Sprint status updates synchronized with Atlassian Jira Cloud!</span>
        </div>
      )}

      {/* Sprint Metrics & Ticket Distribution Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5" /> Sprint Metrics
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-black text-white">42 Story Pts</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">85% Completed</span>
          </div>
          <p className="text-[11px] text-slate-400">Sprint 14 • 4 Days Remaining</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Ticket Distribution
          </span>
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold">To Do: 3</span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-bold">In Progress: 5</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded font-bold">Done: 14</span>
          </div>
          <p className="text-[11px] text-slate-400">Total 22 Active Jira Issues</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Epic Progress
          </span>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-200">
              <span>Enterprise Auth & Profile</span>
              <span className="text-purple-300">75%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[75%]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">2 Active Epics Tracked</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4 border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Meeting Notes / PRD Requirements</span>
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Paste Unstructured Requirements:</label>
              <textarea
                rows={6}
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize Jira Backlog</span>
            </button>
          </div>
        </div>

        {/* Right Output Stories */}
        <div className="lg:col-span-7 space-y-4">
          {stories.map((story) => (
            <div key={story.id} className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/30">
                    {story.id}
                  </span>
                  <span className="text-xs font-bold text-white">{story.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Points: {story.points}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {story.priority}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wide">Epic: {story.epic}</p>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {story.description}
              </p>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Acceptance Criteria (Gherkin):</p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {story.acceptance.map((crit: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

