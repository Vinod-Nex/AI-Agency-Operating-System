"use client";

import React, { useState } from "react";
import { Briefcase, Plus, Filter, Calendar } from "lucide-react";

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  const projects = [
    {
      id: "PRJ-01",
      name: "Nexus Healthcare Platform",
      client: "Nexus Health Inc.",
      status: "In Progress",
      progress: 65,
      deadline: "Aug 30, 2026",
      budget: "$42,500",
      team: ["VK", "AV", "ER"],
    },
    {
      id: "PRJ-02",
      name: "Vortex AI E-Commerce Store",
      client: "Vortex Commerce",
      status: "In Review",
      progress: 90,
      deadline: "Aug 15, 2026",
      budget: "$28,000",
      team: ["VK", "MS"],
    },
    {
      id: "PRJ-03",
      name: "AeroLogistics Mobile Suite",
      client: "Aero Global",
      status: "Planning",
      progress: 20,
      deadline: "Oct 10, 2026",
      budget: "$54,000",
      team: ["VK", "AV"],
    },
    {
      id: "PRJ-04",
      name: "Stripe Automated Billing Engine",
      client: "Nexus Health Inc.",
      status: "Completed",
      progress: 100,
      deadline: "Jul 01, 2026",
      budget: "$18,500",
      team: ["VK", "ER"],
    },
  ];

  const filtered = projects.filter((prj) => {
    if (!statusFilter || statusFilter.trim().toLowerCase() === "all") return true;
    return prj.status.trim().toLowerCase() === statusFilter.trim().toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <span>Agile Project Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track deliverable milestones, sprint health, risk logs, and team capacity
          </p>
        </div>

        <button
          onClick={() => alert("Create Project Dialog...")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">Filter by Status:</span>
          <select
            aria-label="Filter project status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 ml-2"
          >
            <option value="All">All Projects</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Completed">Completed</option>
            <option value="Planning">Planning</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {["All", "In Progress", "In Review", "Completed", "Planning"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>


      {/* Projects Cards List */}
      <div className="space-y-4">
        {filtered.map((prj) => (
          <div key={prj.id} className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {prj.id}
                </span>
                <h3 className="text-base font-bold text-white">{prj.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  prj.status === "In Progress"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : prj.status === "In Review"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : prj.status === "Completed"
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                }`}>
                  {prj.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Client: <strong className="text-slate-200">{prj.client}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Deadline: {prj.deadline}
                </span>
                <span>•</span>
                <span>Budget: <strong className="text-cyan-400">{prj.budget}</strong></span>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Sprint Progress</span>
                <span className="font-bold text-white">{prj.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${prj.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {prj.team.map((member, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#0b0f17] flex items-center justify-center text-[10px] font-bold text-slate-200"
                  >
                    {member}
                  </div>
                ))}
              </div>
              <button
                onClick={() => alert(`Opening board details for ${prj.name}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 ml-2"
              >
                Board &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

