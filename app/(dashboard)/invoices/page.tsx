"use client";

import React, { useState, useEffect } from "react";
import {
  Receipt,
  Plus,
  Trash2,
  Send,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  RefreshCw,
  Building,
  CreditCard,
  FileCode,
  Copy,
  Check
} from "lucide-react";
import { exportToWordDoc, exportToPdf } from "@/lib/exportUtils";
import { generateRichInvoiceAI, DEFAULT_AGENCY_COMPANY } from "@/lib/aiService";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-0042");
  const [clientName, setClientName] = useState("Nexus Health Inc.");
  const [clientEmail, setClientEmail] = useState("billing@nexushealth.com");
  const [dueDate, setDueDate] = useState("August 15, 2026");
  const [status, setStatus] = useState<"Paid" | "Pending" | "Overdue">("Pending");
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Line items state
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Phase 1: React / Next.js Architecture & DB Setup", quantity: 1, rate: 12500 },
    { id: "2", description: "Figma Design System & Responsive UI Tokens", quantity: 1, rate: 6000 },
    { id: "3", description: "Stripe Payment Gateway & Webhook Integration", quantity: 1, rate: 4500 },
    { id: "4", description: "SOC 2 Type II Compliance & Security Audit", quantity: 1, rate: 3500 }
  ]);

  const [aiInvoiceMarkdown, setAiInvoiceMarkdown] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update AI Invoice Markdown whenever items or client details change
  useEffect(() => {
    generateRichInvoiceAI({
      invoiceNumber,
      clientName,
      clientEmail,
      dueDate,
      items,
      company: DEFAULT_AGENCY_COMPANY
    }).then((doc) => setAiInvoiceMarkdown(doc));
  }, [invoiceNumber, clientName, clientEmail, dueDate, items]);

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "Additional Milestone Deliverable",
      quantity: 1,
      rate: 2500
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    const doc = await generateRichInvoiceAI({
      invoiceNumber,
      clientName,
      clientEmail,
      dueDate,
      items,
      company: DEFAULT_AGENCY_COMPANY
    });
    setAiInvoiceMarkdown(doc);
    setIsGeneratingAi(false);
  };

  const handleSendInvoice = () => {
    if (!clientName.trim()) {
      setValidationError("Validation Error: Client Name is required.");
      return;
    }
    const hasInvalidItems = items.some((item) => Number(item.quantity) <= 0 || Number(item.rate) <= 0);
    if (hasInvalidItems) {
      setValidationError("Validation Error: Item quantities and unit prices must be greater than zero.");
      return;
    }
    setValidationError(null);
    setStatus("Paid");
    setSentSuccess(true);
  };

  const handleDownloadPdf = () => {
    exportToPdf(`${invoiceNumber}_${clientName.replace(/\s+/g, "_")}`, `Invoice ${invoiceNumber}`, aiInvoiceMarkdown);
  };

  const handleDownloadWord = () => {
    exportToWordDoc(`${invoiceNumber}_${clientName.replace(/\s+/g, "_")}`, `Invoice ${invoiceNumber}`, aiInvoiceMarkdown);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(aiInvoiceMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>AI Invoice & Commercial Billing Builder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate detailed company invoices with bank transfer details, tax breakdowns, Stripe ACH portals, and Word/PDF export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Raw"}</span>
          </button>
          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Word (.doc)</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleSendInvoice}
            aria-label="Create and send the invoice"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Create & Send Invoice</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold">
          <span>{validationError}</span>
        </div>
      )}

      {sentSuccess && (
        <div role="alert" className="invoice-sent-confirmation p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Invoice {invoiceNumber} created and sent to {clientName} successfully! Status updated to Paid/Sent.</span>
        </div>
      )}

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6 border-slate-800">
            {/* Company Profile Card Header */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{DEFAULT_AGENCY_COMPANY.companyName}</h3>
                  <p className="text-[11px] text-slate-400">{DEFAULT_AGENCY_COMPANY.taxId} • {DEFAULT_AGENCY_COMPANY.email}</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Company Verified
              </span>
            </div>

            {/* Invoice Top Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Invoice Reference Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Payment Due Date</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>
            </div>

            {/* Client Info Input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Billed To (Client Name)</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Client Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
              </div>
            </div>

            {/* Line Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Itemized Line Items</h3>
                <button
                  onClick={addItem}
                  type="button"
                  aria-label="+ Add Item"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Line Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 text-center"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 text-right"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-rose-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs">
              <button
                onClick={handleGenerateAi}
                disabled={isGeneratingAi}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isGeneratingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>AI Re-Synthesize Invoice</span>
              </button>

              <div className="w-56 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-200">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (8%):</span>
                  <span className="font-semibold text-slate-200">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-1.5">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-400">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Document Preview Column */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-6 rounded-3xl h-full flex flex-col justify-between border-slate-800 min-h-[550px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Live Document Preview (Company Detailed)</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Word & PDF Ready
              </span>
            </div>

            <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-[580px] font-sans">
              <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed selection:bg-emerald-600 selection:text-white">
                {aiInvoiceMarkdown}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
