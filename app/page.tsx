"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import AuthModal from "@/components/AuthModal";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Inline Hero Quick Login State
  const [heroEmail, setHeroEmail] = useState("");
  const [heroPassword, setHeroPassword] = useState("");
  const [showHeroPassword, setShowHeroPassword] = useState(false);
  const [heroIsLoading, setHeroIsLoading] = useState(false);
  const [heroIsGoogleLoading, setHeroIsGoogleLoading] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  const handleHeroEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroError(null);

    if (!heroEmail || !heroEmail.includes("@")) {
      setHeroError("Please enter a valid work email.");
      return;
    }

    if (!heroPassword || heroPassword.length < 6) {
      setHeroError("Password must be at least 6 characters.");
      return;
    }

    setHeroIsLoading(true);

    setTimeout(() => {
      setHeroIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "agencyos_user",
          JSON.stringify({
            email: heroEmail,
            authProvider: "email",
            loginTime: new Date().toISOString()
          })
        );
      }
      router.push("/dashboard");
    }, 1000);
  };

  const handleHeroGoogleAuth = () => {
    setHeroError(null);
    setHeroIsGoogleLoading(true);

    setTimeout(() => {
      setHeroIsGoogleLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "agencyos_user",
          JSON.stringify({
            email: "user@agencyos.ai",
            name: "Google Workspace User",
            authProvider: "google",
            loginTime: new Date().toISOString()
          })
        );
      }
      router.push("/dashboard");
    }, 1200);
  };

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors">
      {/* Auth Modal Triggered from Header / CTAs */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-b border-blue-500/20 py-2 px-4 text-center text-xs font-medium text-slate-200">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30 text-[10px] font-bold uppercase tracking-wide mr-2">
          New Version 2.4
        </span>
        AI Agency OS with Multi-Model Prompt Chaining & Jira Automation is now live!{" "}
        <button
          onClick={() => openAuth("login")}
          className="text-blue-400 underline font-semibold hover:text-blue-300 ml-1"
        >
          Sign In to Workspace &rarr;
        </button>
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
          <a href="#auth-section" className="hover:text-blue-600 dark:hover:text-white transition-colors">Sign In</a>
          <a href="#pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-white transition-colors">Case Studies</a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => openAuth("login")}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuth("signup")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open AI OS</span>
          </button>
        </div>
      </header>

      {/* Hero Section with Integrated Login Form */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 mb-8 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Reduce Agency Operational Work by &gt;80%</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              The Complete <span className="gradient-text">AI Operating System</span> for Modern Agencies
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Automate client onboarding, AI proposals, Statements of Work, legal contracts, invoicing, meeting synthesis, and Jira stories in one unified enterprise platform.
            </p>

            {/* Quick Action Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Google OAuth 2.0 Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Email & Password Auth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>14-Day Free Trial</span>
              </div>
            </div>

            {/* Metric Badges */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
              <div className="glass-panel p-4 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">80%+</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Manual Effort Saved</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">10x</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Faster Proposals</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl text-center">
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">$3.4M+</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Contracts Generated</p>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Hero Login & Sign-up Card */}
          <div id="auth-section" className="lg:col-span-5">
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Sign In to AgencyOS</span>
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Google OAuth or Work Email Authentication</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                  Instant Access
                </span>
              </div>

              {heroError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{heroError}</span>
                </div>
              )}

              {/* Google Authentication Button */}
              <button
                type="button"
                onClick={handleHeroGoogleAuth}
                disabled={heroIsGoogleLoading || heroIsLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99] disabled:opacity-50"
              >
                {heroIsGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{heroIsGoogleLoading ? "Authenticating Google..." : "Continue with Google"}</span>
              </button>

              {/* Or Divider */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative px-3 bg-white dark:bg-[#0f172a] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Or Email Login
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleHeroEmailLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="alex@digitalagency.com"
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => openAuth("login")}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showHeroPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={heroPassword}
                      onChange={(e) => setHeroPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowHeroPassword(!showHeroPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showHeroPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={heroIsLoading || heroIsGoogleLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform active:scale-[0.99] disabled:opacity-50"
                >
                  {heroIsLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switch to Sign Up */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an agency account yet?{" "}
                  <button
                    type="button"
                    onClick={() => openAuth("signup")}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-0.5"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            18 Enterprise Modules. <span className="gradient-text">Zero Friction.</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Proposal Generator</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate high-converting, custom client proposals complete with executive summaries, tech stacks, milestones, and pricing models in under 60 seconds.
              </p>
            </div>
            <Link href="/proposals" className="mt-6 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
              Try Proposal Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI SOW & Contract Generator</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Draft legally compliant Statements of Work and contracts with custom IP clauses, payment schedules, and SLA guarantees ready for client e-signatures.
              </p>
            </div>
            <Link href="/contracts" className="mt-6 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
              Try SOW Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Invoice & Billing Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Convert approved SOW milestones directly into branded invoices with automated Stripe payment links, tax calculations, and recurring billing.
              </p>
            </div>
            <Link href="/invoices" className="mt-6 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
              Try Invoice Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Jira Story Generator</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Turn unstructured meeting notes or client requests into comprehensive user stories, Gherkin acceptance criteria, and estimation points.
              </p>
            </div>
            <Link href="/jira" className="mt-6 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline">
              Try Jira Generator <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">360° Client CRM</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Manage organization contacts, document repositories, billing histories, communication logs, and active contracts in one unified workspace.
              </p>
            </div>
            <Link href="/clients" className="mt-6 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline">
              Manage Clients <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Agile Project Hub</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track project health, sprint progress, deliverable timelines, team allocation, risk logs, and automated status reports for clients.
              </p>
            </div>
            <Link href="/projects" className="mt-6 text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline">
              View Projects <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Pricing for <span className="gradient-text">Agencies of Any Scale</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">Choose the plan that matches your monthly client volume and team size.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For freelancers and solo agency consultants.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$29</span>
                <span className="text-xs text-slate-500 dark:text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Up to 10 AI Proposals / mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>AI SOW & Contract Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>5 Client Organizations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Basic Analytics & PDF Export</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth("signup")}
              className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs text-center transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Professional Plan (Featured) */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative border-blue-500/50 glow-blue bg-gradient-to-b from-blue-950/20 to-slate-900">
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
            <button
              onClick={() => openAuth("signup")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-500/20 transition-all"
            >
              Start Free 14-Day Trial
            </button>
          </div>

          {/* Agency Plan */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between relative border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Agency Scale</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For established digital studios and enterprise teams.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$199</span>
                <span className="text-xs text-slate-500 dark:text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Unlimited Everything & Priority Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Custom AI Model Prompting & Guardrails</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Unlimited Team Seats & Client Portals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>SOC2 & HIPAA Compliant Security</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => openAuth("login")}
              className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs text-center transition-all"
            >
              Contact Sales
            </button>
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
