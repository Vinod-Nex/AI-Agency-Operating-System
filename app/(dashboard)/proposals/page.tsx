"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, FileText, Download, Copy, Check, Send, RefreshCw } from "lucide-react";

export default function ProposalGeneratorPage() {
  const [clientName, setClientName] = useState("Acme Global Systems");
  const [projectBudget, setProjectBudget] = useState("$45,000");
  const [timeline, setTimeline] = useState("8 Weeks");
  const [industry, setIndustry] = useState("Enterprise SaaS");
  const [techStack, setTechStack] = useState("Next.js 15, TypeScript, Tailwind CSS, PostgreSQL");
  const [requirements, setRequirements] = useState(
    "Client requires an enterprise web application portal for multi-tenant analytics, AI automated reporting, SOC2 security compliance, and billing integration."
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateOutputText = (cName: string, budget: string, time: string, ind: string, tech: string, req: string) => {
    return `# ENTERPRISE PROJECT PROPOSAL: ${(cName || "CLIENT").toUpperCase()}

**Client**: ${cName || "Client Name"}
**Industry**: ${ind}
**Estimated Budget**: ${budget}
**Timeline**: ${time}
**Tech Stack**: ${tech}

---

## 1. Executive Summary
Apex Digital Studio proposes an end-to-end digital transformation solution for **${cName || "Client"}**. Utilizing modern web architecture, we will construct a high-availability platform tailored to ${ind} specifications.

## 2. Scope of Work & Key Requirements
${req}

## 3. Financial Investment & Payment Schedule
- **Phase 1: Project Kickoff & Discovery**: 30%
- **Phase 2: Full-Stack Web Development (${tech})**: 40%
- **Phase 3: Final Acceptance & Production Launch**: 30%
- **Total Investment**: ${budget} (${time} SLA warranty included)

## 4. Acceptance & Sign-off
This proposal is valid for 30 days. Contact Apex Digital Studio to approve and initiate agreement.`;
  };

  const [validationError, setValidationError] = useState<string | null>(null);
  const [proposalOutput, setProposalOutput] = useState(
    generateOutputText("Acme Global Systems", "$45,000", "8 Weeks", "Enterprise SaaS", "Next.js 15, TypeScript, Tailwind CSS, PostgreSQL", "Client requires an enterprise web application portal for multi-tenant analytics, AI automated reporting, SOC2 security compliance, and billing integration.")
  );


  useEffect(() => {
    if (!clientName.trim()) {
      setValidationError("Validation Error: Client Name is required.");
      setProposalOutput("");
    } else {
      setValidationError(null);
      setProposalOutput(generateOutputText(clientName, projectBudget, timeline, industry, techStack, requirements));
    }
  }, [clientName, projectBudget, timeline, industry, techStack, requirements]);

  const handleGenerate = () => {
    if (!clientName.trim()) {
      setValidationError("Validation Error: Client Name is required.");
      setProposalOutput("");
      return;
    }
    setValidationError(null);
    setIsGenerating(true);
    setProposalOutput(generateOutputText(clientName, projectBudget, timeline, industry, techStack, requirements));
    setTimeout(() => {
      setIsGenerating(false);
    }, 100);
  };


  const handleCopy = () => {
    if (!proposalOutput) return;
    navigator.clipboard.writeText(proposalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>AI Proposal Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesize client requirements into high-converting client proposals in seconds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
          <button
            onClick={() => alert("Downloading PDF Proposal bundle...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => alert("Proposal sent to client portal!")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Client</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Controls Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Proposal Prompt Configuration</span>
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Client Name / Organization</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Budget</label>
                <input
                  type="text"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  placeholder="Budget"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Timeline</label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="Timeline"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Vertical</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Recommended Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Requirements & Project Scope</label>
              <textarea
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Project Scope"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Proposal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Proposal Document Output */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between min-h-[520px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Live Document Preview
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                Client Ready • Synchronized
              </span>
            </div>

            <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[550px] font-sans">
              {validationError ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  {validationError}
                </div>
              ) : (
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {proposalOutput}
                </pre>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}



