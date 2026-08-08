"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  Download,
  Copy,
  Check,
  Send,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Brain,
  FileCode
} from "lucide-react";
import { exportToWordDoc, exportToPdf } from "@/lib/exportUtils";
import { generateRichQuotationAI, DEFAULT_AGENCY_COMPANY } from "@/lib/aiService";

export default function ProposalGeneratorPage() {
  // Input Configuration State
  const [clientName, setClientName] = useState("Acme Global Systems");
  const [clientEmail, setClientEmail] = useState("proposals@acmeglobal.com");
  const [projectBudget, setProjectBudget] = useState("$75,000");
  const [timeline, setTimeline] = useState("10 Weeks");
  const [industry, setIndustry] = useState("Enterprise SaaS & FinTech");
  const [techStack, setTechStack] = useState("Next.js 15, Spring Boot, PostgreSQL, Redis, OpenAI GPT-4o, AWS ECS");
  const [proposalTone, setProposalTone] = useState<"enterprise" | "technical" | "persuasive">("enterprise");
  const [aiModel, setAiModel] = useState<"gpt-4o" | "claude-3-5" | "gemini-2-flash">("gpt-4o");

  // Requirements & Add-ons
  const [requirements, setRequirements] = useState(
    "Client requires an enterprise web application portal for multi-tenant analytics, AI automated reporting, SOC 2 Type II security compliance, Stripe billing integration, and real-time dashboard analytics."
  );
  const [includeSoc2Addon, setIncludeSoc2Addon] = useState(true);
  const [includeSlaRetainer, setIncludeSlaRetainer] = useState(true);

  // Status & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [proposalOutput, setProposalOutput] = useState("");

  // Trigger AI generation whenever inputs change
  useEffect(() => {
    if (!clientName.trim()) {
      setValidationError("Validation Error: Client Organization Name is required.");
      setProposalOutput("");
    } else {
      setValidationError(null);
      generateRichQuotationAI({
        clientName,
        clientEmail,
        projectBudget,
        timeline,
        industry,
        techStack,
        requirements,
        company: DEFAULT_AGENCY_COMPANY
      }).then((doc) => setProposalOutput(doc));
    }
  }, [
    clientName,
    clientEmail,
    projectBudget,
    timeline,
    industry,
    techStack,
    requirements,
    proposalTone,
    aiModel,
    includeSoc2Addon,
    includeSlaRetainer
  ]);

  const handleGenerate = async () => {
    if (!clientName.trim()) {
      setValidationError("Validation Error: Client Organization Name is required.");
      setProposalOutput("");
      return;
    }
    setValidationError(null);
    setIsGenerating(true);

    const doc = await generateRichQuotationAI({
      clientName,
      clientEmail,
      projectBudget,
      timeline,
      industry,
      techStack,
      requirements,
      company: DEFAULT_AGENCY_COMPANY
    });

    setProposalOutput(doc);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!proposalOutput) return;
    navigator.clipboard.writeText(proposalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    if (!proposalOutput) return;
    exportToWordDoc(`Quotation_${clientName.replace(/\s+/g, "_")}`, `Quotation Proposal - ${clientName}`, proposalOutput);
  };

  const handleDownloadPdf = () => {
    if (!proposalOutput) return;
    exportToPdf(`Quotation_${clientName.replace(/\s+/g, "_")}`, `Quotation Proposal - ${clientName}`, proposalOutput);
  };

  const handleSendToClient = () => {
    setSentStatus(true);
    setTimeout(() => setSentStatus(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>AI Quotation & SOW Proposal Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate detailed company quotations and SOW proposals hit with AI models, formatted for PDF & Word exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!proposalOutput}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
          <button
            onClick={handleDownloadWord}
            disabled={!proposalOutput}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Word (.doc)</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={!proposalOutput}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleSendToClient}
            disabled={!proposalOutput}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {sentStatus ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Send className="w-3.5 h-3.5" />}
            <span>{sentStatus ? "Sent to Client!" : "Send to Client"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Controls Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Quotation Configuration</span>
              </span>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                Engine: {aiModel.toUpperCase()}
              </span>
            </h2>

            {/* AI Model & Tone Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">AI API Engine</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="gpt-4o">OpenAI GPT-4o API</option>
                  <option value="claude-3-5">Anthropic Claude 3.5</option>
                  <option value="gemini-2-flash">Google Gemini API</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Document Style</label>
                <select
                  value={proposalTone}
                  onChange={(e) => setProposalTone(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="enterprise">Commercial Enterprise</option>
                  <option value="technical">Technical Specification</option>
                  <option value="persuasive">Persuasive Proposal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Client Organization Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Acme Global Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Client Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="billing@acme.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Estimated Budget</label>
                <input
                  type="text"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  placeholder="$75,000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Timeline</label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="10 Weeks"
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
                placeholder="Enterprise SaaS & FinTech"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Recommended Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="Next.js 15, Spring Boot, PostgreSQL, AWS"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Requirements & Project Scope</label>
              <textarea
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe specific features, API integrations, and security guarantees..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Enterprise Add-ons Toggles */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSoc2Addon}
                  onChange={(e) => setIncludeSoc2Addon(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Include SOC 2 Type II Security Package</span>
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSlaRetainer}
                  onChange={(e) => setIncludeSlaRetainer(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Include 90-Day Post-Launch SLA Warranty</span>
                </span>
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Querying AI Engine & Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Detailed AI Quotation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Proposal Document Output */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between min-h-[550px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Quotation & SOW Blueprint (Company Detailed)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Word & PDF Export Ready</span>
                </span>
              </div>
            </div>

            <div className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-xl p-6 overflow-y-auto max-h-[580px] font-sans">
              {validationError ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              ) : (
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed selection:bg-blue-600 selection:text-white">
                  {proposalOutput}
                </pre>
              )}
            </div>

            {/* Bottom Info Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Includes Company Details, Tax ID & Wire Info</span>
              <span>Supported Exports: PDF & Microsoft Word (.doc)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
