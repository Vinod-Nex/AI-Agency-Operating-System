"use client";

import React, { useState } from "react";
import { FileCheck2, Sparkles, Download, Copy, Check, ShieldCheck, Scale, FileText } from "lucide-react";

export default function SOWContractsPage() {
  const [docType, setDocType] = useState<"sow" | "contract">("sow");
  const [clientName, setClientName] = useState("Vortex AI Labs");
  const [effectiveDate, setEffectiveDate] = useState("August 1, 2026");
  const [ipOwnership, setIpOwnership] = useState("Client Ownership upon Full Payment");
  const [governingLaw, setGoverningLaw] = useState("State of California, USA");

  const [copied, setCopied] = useState(false);
  const [contractText, setContractText] = useState(`# STATEMENT OF WORK (SOW) #SOW-2026-089

**Effective Date**: August 1, 2026
**Client**: Vortex AI Labs
**Service Provider**: Apex Digital Studio

---

## 1. Project Objectives
Service Provider shall perform software design, cloud engineering, and web development services to create the **Vortex AI Web Application Platform**.

## 2. Deliverables & Acceptance Criteria
- **Deliverable A (UI/UX System)**: Complete component design system in Figma with responsive mobile & desktop breakpoints.
- **Deliverable B (Web Application)**: Production Next.js 14 codebase integrated with client REST APIs, unit tests (>80% coverage), and deployment scripts.
- **Deliverable C (Documentation)**: Developer knowledge base and DevOps deployment runbook.

## 3. Payment Milestones
- **Milestone 1**: $12,000 upon execution of this SOW.
- **Milestone 2**: $14,000 upon delivery and client review of Deliverable B.
- **Milestone 3**: $8,000 upon final production launch acceptance.

## 4. Intellectual Property Rights
Upon receipt of full payment under Section 3, Service Provider hereby assigns all right, title, and interest in and to the custom deliverables to Client.`);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!clientName.trim()) {
      setValidationError("Validation Error: Client Name is required for contract generation.");
      setContractText("");
      return;
    }
    setValidationError(null);
    if (docType === "sow") {

      setContractText(`# STATEMENT OF WORK (SOW) #${Math.floor(1000 + Math.random() * 9000)}

**Effective Date**: ${effectiveDate}
**Client**: ${clientName}
**Service Provider**: Apex Digital Studio

---

## 1. Project Objectives
Apex Digital Studio will execute design, development, and system integration for **${clientName}**.

## 2. Scope & Timeline
- Sprint 1-2: Requirements Gathering & Figma UX System
- Sprint 3-5: Next.js Platform & Microservice Engineering
- Sprint 6: Acceptance Testing & Production Cutover

## 3. Financial Terms
Total Value: $38,000 under milestone payment terms.

## 4. IP Rights & Governing Law
- IP Clause: ${ipOwnership}
- Jurisdiction: ${governingLaw}`);
    } else {
      setContractText(`# MASTER SERVICES AGREEMENT (MSA)

**This Agreement** is entered into as of ${effectiveDate}, by and between **${clientName}** ("Client") and **Apex Digital Studio** ("Provider").

---

## 1. Services & Work Orders
Provider will perform development, design, and consulting services as set forth in individual Statements of Work executed under this Agreement.

## 2. Intellectual Property
${ipOwnership}. Provider retains rights to general reusable utilities, open-source libraries, and foundational frameworks.

## 3. Confidentiality & Non-Disclosure
Both parties agree to hold all proprietary trade secrets, user data, and financial records in strict confidence for a period of 5 years.

## 4. Governing Law
This Agreement shall be governed by and construed under the laws of ${governingLaw}.`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-400" />
            <span>AI SOW & Legal Contract Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate compliant Statements of Work, IP assignments, and Master Service Agreements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Agreement"}</span>
          </button>
          <button
            onClick={() => alert("Exporting contract document...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Docx / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Contract Terms & Parameters</span>
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Document Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDocType("sow")}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    docType === "sow"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Statement of Work (SOW)
                </button>
                <button
                  onClick={() => setDocType("contract")}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                    docType === "contract"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Master Services (MSA)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Client Legal Entity</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Effective Commencement Date</label>
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">IP & Work-for-Hire Terms</label>
              <input
                type="text"
                value={ipOwnership}
                onChange={(e) => setIpOwnership(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Jurisdiction / Governing Law</label>
              <input
                type="text"
                value={governingLaw}
                onChange={(e) => setGoverningLaw(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Legal Document</span>
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between min-h-[520px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Legal Document Preview
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Ready for E-Sign
              </span>
            </div>

            <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-5 overflow-y-auto max-h-[550px]">
              {validationError ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  {validationError}
                </div>
              ) : (
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {contractText}
                </pre>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
