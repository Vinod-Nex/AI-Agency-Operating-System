"use client";

import React, { useState } from "react";
import { Sparkles, FileText, FileCheck2, Receipt, FileSpreadsheet, X, ArrowRight, Bot, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"proposal" | "sow" | "invoice" | "jira">("proposal");

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedOutput(null);
    
    setTimeout(() => {
      setIsGenerating(false);
      if (selectedType === "proposal") {
        setGeneratedOutput(`# AI PROPOSAL: ${prompt}\n\n**Executive Summary**\nOur agency proposes an enterprise AI-driven web platform designed to streamline operational bottlenecks, increase conversion rates by 35%, and deliver seamless UX.\n\n**Scope & Deliverables**\n1. Full UI/UX Design System & Prototypes\n2. Next.js 14 Web Application Development\n3. Cloud Infrastructure & Security Compliance\n\n**Total Estimated Value**: $38,500`);
      } else if (selectedType === "sow") {
        setGeneratedOutput(`# STATEMENT OF WORK (SOW)\n\n**Project**: ${prompt}\n**Timeline**: 6 Weeks | Sprint-Based Delivery\n\n**Phase 1: Discovery & Architecture** (Week 1-2)\n- Technical Specification Document\n- Database ERD & Schema Design\n\n**Phase 2: Core Development** (Week 3-5)\n- API Integration & Microservices\n- Automated Testing & QA Matrix`);
      } else {
        setGeneratedOutput(`# GENERATED ARTIFACT\n\nCompleted specification for: "${prompt}". Ready for client signature or Jira export.`);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Agency Command Engine</h3>
              <p className="text-[11px] text-slate-400">Generate proposals, SOWs, contracts & user stories in seconds</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Type Selector */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 grid grid-cols-4 gap-2">
          <button
            onClick={() => setSelectedType("proposal")}
            className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedType === "proposal"
                ? "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[11px]">Proposal</span>
          </button>
          <button
            onClick={() => setSelectedType("sow")}
            className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedType === "sow"
                ? "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span className="text-[11px]">SOW / Contract</span>
          </button>
          <button
            onClick={() => setSelectedType("invoice")}
            className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedType === "invoice"
                ? "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span className="text-[11px]">Invoice</span>
          </button>
          <button
            onClick={() => setSelectedType("jira")}
            className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
              selectedType === "jira"
                ? "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold"
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-[11px]">Jira Stories</span>
          </button>
        </div>

        {/* Prompt Input */}
        <div className="p-4 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Describe client requirements, project scope or goals:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a $45,000 Next.js web application proposal for Nexus Healthcare with HIPAA compliance, patient portal & telemedicine SDK integration..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>Model: Claude 3.5 Sonnet + Custom Agency Prompting</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Preview */}
        {generatedOutput && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Output Ready
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Copied to clipboard!")}
                  className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
                >
                  Copy Text
                </button>
                <Link
                  href={`/${selectedType === "sow" ? "contracts" : selectedType}s`}
                  onClick={onClose}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  Open Full Generator <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <pre className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono overflow-x-auto whitespace-pre-wrap max-h-48">
              {generatedOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
