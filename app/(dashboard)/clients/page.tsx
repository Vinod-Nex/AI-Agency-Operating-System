"use client";

import React, { useState } from "react";
import { Users, Plus, Search, Building2, Mail, Phone, ExternalLink, X, FileText, CheckCircle2, Briefcase } from "lucide-react";

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  status: string;
  revenue: string;
  projects: number;
  linkedProject: string;
  summary: string;
}

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const clients: Client[] = [
    {
      id: "1",
      name: "Nexus Health Inc.",
      contact: "Dr. Aris Vance",
      email: "vance@nexushealth.org",
      phone: "+1 (415) 890-2341",
      status: "Active Contract",
      revenue: "$85,000",
      projects: 2,
      linkedProject: "Nexus Healthcare Platform (65% Complete)",
      summary: "Multi-tenant healthcare analytics portal with HIPAA compliance and real-time patient metric tracking."
    },
    {
      id: "2",
      name: "Vortex Commerce",
      contact: "Elena Rostova",
      email: "elena@vortexcommerce.com",
      phone: "+1 (310) 452-9102",
      status: "Active Contract",
      revenue: "$54,000",
      projects: 1,
      linkedProject: "Vortex AI E-Commerce Store (90% Complete)",
      summary: "High-conversion automated e-commerce storefront with Stripe checkout integration."
    },
    {
      id: "3",
      name: "Aero Logistics Global",
      contact: "Marcus Sterling",
      email: "sterling@aerologistics.io",
      phone: "+44 20 7946 0912",
      status: "Onboarding",
      revenue: "$120,000",
      projects: 3,
      linkedProject: "AeroLogistics Mobile Suite (20% Complete)",
      summary: "Global freight tracking system with IoT telemetry sync and automated invoice processing."
    },
  ];

  const filtered = clients.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);

    const sf = statusFilter.trim().toLowerCase();
    const matchesStatus =
      !sf ||
      sf === "all" ||
      sf === "all statuses" ||
      c.status.toLowerCase().includes(sf);

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>360° Client Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Directory of organization accounts, documents, proposals and billing histories
          </p>
        </div>

        <button
          onClick={() => alert("Open Add Client Modal...")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search and Status Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 border-slate-800">
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a client by name..."
            className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active Contract">Active Contract</option>
            <option value="Onboarding">Onboarding</option>
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((client) => (
            <div key={client.id} className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {client.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{client.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Primary Lead: {client.contact}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</span>
                  <p className="text-sm font-extrabold text-amber-400">{client.revenue}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(client)}
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  Profile <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border-slate-800 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No client records match your search</h3>
          <p className="text-xs text-slate-500">Try clearing your search term or changing the status filter.</p>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-6 border-slate-700 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{selectedClient.name}</h2>
                  <p className="text-xs text-slate-400">Account ID: {selectedClient.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900 p-4 rounded-xl space-y-2 border border-slate-800">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Client Record Details</h4>
                <p className="text-slate-300"><strong className="text-slate-400">Primary Contact:</strong> {selectedClient.contact}</p>
                <p className="text-slate-300"><strong className="text-slate-400">Email:</strong> {selectedClient.email}</p>
                <p className="text-slate-300"><strong className="text-slate-400">Phone:</strong> {selectedClient.phone}</p>
                <p className="text-slate-300"><strong className="text-slate-400">Status:</strong> {selectedClient.status}</p>
                <p className="text-slate-300"><strong className="text-slate-400">Contract Value:</strong> {selectedClient.revenue}</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl space-y-2 border border-slate-800">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Linked Project Details
                </h4>
                <p className="font-bold text-amber-300">{selectedClient.linkedProject}</p>
                <p className="text-slate-400 leading-relaxed">{selectedClient.summary}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

