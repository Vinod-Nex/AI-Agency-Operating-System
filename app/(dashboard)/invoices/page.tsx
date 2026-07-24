"use client";

import React, { useState } from "react";
import { Receipt, Plus, Trash2, Send, Download, CheckCircle2, Clock } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-0042");
  const [clientName, setClientName] = useState("Nexus Health Inc.");
  const [dueDate, setDueDate] = useState("August 15, 2026");
  const [status, setStatus] = useState<"Paid" | "Pending" | "Overdue">("Pending");
  const [sentSuccess, setSentSuccess] = useState(false);

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Phase 1: React / Next.js Architecture Setup", quantity: 1, rate: 12500 },
    { id: "2", description: "Figma Component Design System & Responsive Tokens", quantity: 1, rate: 6000 },
    { id: "3", description: "Stripe Payment Gateway Integration & Webhook Handler", quantity: 1, rate: 4500 },
  ]);

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "Additional Milestone Deliverable",
      quantity: 1,
      rate: 2500,
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

  const [validationError, setValidationError] = useState<string | null>(null);

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

  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>AI Invoice & Billing Builder</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate branded client invoices synced with Stripe payment gateways
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Downloading PDF Invoice...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
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
          <span>Invoice {invoiceNumber} created and sent to {clientName} successfully! Status updated to Sent.</span>
        </div>
      )}



      {/* Invoice Card Container */}
      <div className="glass-panel p-8 rounded-3xl max-w-4xl mx-auto space-y-8 border-slate-800">
        {/* Invoice Top Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Invoice Number:</span>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-white"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Issued by: <strong className="text-slate-200">Apex Digital Studio LLC</strong></p>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              status === "Paid"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : status === "Pending"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}>
              <Clock className="w-3 h-3" />
              {status}
            </span>
            <p className="text-xs text-slate-400 mt-2">Due Date: <strong className="text-slate-200">{dueDate}</strong></p>
          </div>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed To / Client Name:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client Name"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Method:</label>
            <p className="text-xs text-slate-300 py-1.5">Stripe ACH / Credit Card Portal Enabled</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Invoice Line Items</h3>
            <button
              onClick={addItem}
              type="button"
              aria-label="+ Add Item"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 text-center"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 text-right"
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

        {/* Calculation Summary */}
        <div className="border-t border-slate-800 pt-6 flex justify-end">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-200">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (8%):</span>
              <span className="font-semibold text-slate-200">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-2">
              <span>Total Amount:</span>
              <span className="text-emerald-400">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

