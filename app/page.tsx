"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  FileCheck2,
  Receipt,
  FileSpreadsheet,
  Users,
  Briefcase,
  TrendingUp,
  Cpu,
  Star,
  Globe,
  ChevronRight
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-b border-blue-500/20 py-2 px-4 text-center text-xs font-medium text-slate-200">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30 text-[10px] font-bold uppercase tracking-wide mr-2">
          New Version 2.4
        </span>
        AI Agency OS with Multi-Model Prompt Chaining & Jira Automation is now live!{" "}
        <Link href="/dashboard" className="text-blue-400 underline font-semibold hover:text-blue-300 ml-1">
          Explore Dashboard &rarr;
        </Link>
      </div>

      {/* Navigation Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              AgencyOS <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Enterprise AI Operating System</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-blue-600 dark:hover:text-white transition-colors">AI Workflow</a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-white transition-colors">Case Studies</a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open AI OS</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto w-full text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 mb-8 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Reduce Agency Operational Work by &gt;80%</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          The Complete <span className="gradient-text">AI Operating System</span> for Modern Agencies
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Automate client onboarding, AI proposals, Statements of Work, legal contracts, invoicing, meeting synthesis, and Jira stories in one unified enterprise platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Agency Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-semibold transition-all"
          >
            <span>View Pricing Plans</span>
          </a>
        </div>

        {/* Metric Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">80%+</p>
            <p className="text-xs text-slate-400 mt-1">Manual Effort Saved</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">10x</p>
            <p className="text-xs text-slate-400 mt-1">Faster Proposal Delivery</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">$3.4M+</p>
            <p className="text-xs text-slate-400 mt-1">Client Contracts Generated</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">99.9%</p>
            <p className="text-xs text-slate-400 mt-1">Enterprise Uptime</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            18 Enterprise Modules. <span className="gradient-text">Zero Friction.</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Built specifically for Web Design Agencies, Marketing Consultancies, AI Agencies, and Development Studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Proposal Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-converting, custom client proposals complete with executive summaries, tech stacks, milestones, and pricing models in under 60 seconds.
              </p>
            </div>
            <Link href="/proposals" className="mt-6 text-xs font-semibold text-blue-400 flex items-center gap-1 hover:text-blue-300">
              Try Proposal Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI SOW & Contract Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Draft legally compliant Statements of Work and contracts with custom IP clauses, payment schedules, and SLA guarantees ready for client e-signatures.
              </p>
            </div>
            <Link href="/contracts" className="mt-6 text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:text-indigo-300">
              Try SOW Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Invoice & Billing Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Convert approved SOW milestones directly into branded invoices with automated Stripe payment links, tax calculations, and recurring billing.
              </p>
            </div>
            <Link href="/invoices" className="mt-6 text-xs font-semibold text-emerald-400 flex items-center gap-1 hover:text-emerald-300">
              Try Invoice Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Jira Story Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn unstructured meeting notes or client requests into comprehensive user stories, Gherkin acceptance criteria, and estimation points.
              </p>
            </div>
            <Link href="/jira" className="mt-6 text-xs font-semibold text-purple-400 flex items-center gap-1 hover:text-purple-300">
              Try Jira Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">360° Client CRM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage organization contacts, document repositories, billing histories, communication logs, and active contracts in one unified workspace.
              </p>
            </div>
            <Link href="/clients" className="mt-6 text-xs font-semibold text-amber-400 flex items-center gap-1 hover:text-amber-300">
              Manage Clients <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Agile Project Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track project health, sprint progress, deliverable timelines, team allocation, risk logs, and automated status reports for clients.
              </p>
            </div>
            <Link href="/projects" className="mt-6 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:text-cyan-300">
              View Projects <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Transparent Pricing for <span className="gradient-text">Agencies of Any Scale</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3">Choose the plan that matches your monthly client volume and team size.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">For freelancers and solo agency consultants.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">$29</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Up to 10 AI Proposals / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>AI SOW & Contract Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>5 Client Organizations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Basic Analytics & PDF Export</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Professional Plan (Featured) */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative border-blue-500/50 glow-blue bg-gradient-to-b from-blue-950/30 to-slate-900">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Professional</h3>
              <p className="text-xs text-slate-400 mt-1">For growing web, AI, and marketing agencies.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">$79</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Unlimited AI Proposals & SOWs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>AI Jira Story & Meeting Minutes Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>25 Active Client Accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>5 Team Members Workspace</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Stripe Invoice Sync & Custom Branding</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-500/20 transition-all"
            >
              Start Free 14-Day Trial
            </Link>
          </div>

          {/* Agency Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Agency Scale</h3>
              <p className="text-xs text-slate-400 mt-1">For established digital studios and enterprise teams.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-white">$199</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Unlimited Everything & Priority Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Custom AI Model Prompting & Guardrails</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Unlimited Team Seats & Client Portals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>SOC2 & HIPAA Compliant Security</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-300">AI Agency Operating System</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Documentation</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
