import React, { useState, useEffect } from "react";
import { Sparkles, BarChart3, AlertCircle, RefreshCw, Send, CheckCircle, Globe, Compass, ShieldCheck, HelpCircle } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import AuditForm from "./components/AuditForm";
import ExecutiveSummaryView from "./components/ExecutiveSummaryView";
import ModulesGridView from "./components/ModulesGridView";
import CompetitorComparisonView from "./components/CompetitorComparisonView";
import RoadmapView from "./components/RoadmapView";
import HowItWorksModal from "./components/HowItWorksModal";
import { AuditReport, AuditHistoryEntry } from "./types";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [history, setHistory] = useState<AuditHistoryEntry[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"overview" | "modules" | "competitors" | "roadmap">("overview");
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai_visibility_audit_history");
      if (stored) {
        const parsed = JSON.parse(stored) as AuditHistoryEntry[];
        setHistory(parsed);
        // Load the most recent scan if available by default
        if (parsed.length > 0) {
          setReport(parsed[0].report);
          setCurrentId(parsed[0].id);
        }
      }
    } catch (e) {
      console.warn("Could not retrieve audit cache.", e);
    }

    // Check query params if user shared a link
    try {
      const params = new URLSearchParams(window.location.search);
      const queryDomain = params.get("domain");
      if (queryDomain && queryDomain.length > 0) {
        // Find if we have it in history, and pre-fill or wait
        // (Just preset form to queryDomain or offer a notification)
      }
    } catch (e) {
      // Ignored in sandbox
    }
  }, []);

  // Sync theme configurations on dark class body helper
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Save history element to local storage helper
  const saveToHistory = (newReport: AuditReport) => {
    try {
      const newEntry: AuditHistoryEntry = {
        id: `scan-${Date.now()}`,
        domain: newReport.domain,
        brandName: newReport.brandName,
        overallScore: newReport.overallScore,
        grade: newReport.grade,
        scannedAt: newReport.scannedAt,
        report: newReport
      };

      // Filter out double scans for same domain to keep list clean
      const cleanedHistory = history.filter(h => h.domain.toLowerCase() !== newReport.domain.toLowerCase());
      const updated = [newEntry, ...cleanedHistory].slice(0, 10); // Limit cache entries to 10
      setHistory(updated);
      localStorage.setItem("ai_visibility_audit_history", JSON.stringify(updated));
      
      setReport(newReport);
      setCurrentId(newEntry.id);
    } catch (e) {
      console.warn("Could not write audit cache.", e);
    }
  };

  const handleSelectHistoryId = (id: string) => {
    const match = history.find(h => h.id === id);
    if (match) {
      setReport(match.report);
      setCurrentId(match.id);
      setActiveWorkspaceTab("overview");
      setError(null);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem("ai_visibility_audit_history");
    setHistory([]);
    setReport(null);
    setCurrentId(null);
  };

  const handleFormSubmit = async (formData: {
    domain: string;
    brandName: string;
    competitors: string;
    industry: string;
    country: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Standard fetch post request to server-side Express Endpoint
      const response = await fetch("https://gemini-proxy-2-pearl.vercel.app/api/ai-visibility-auditor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Cloud Server responded with status: ${response.status}`);
      }

      const rawResult = await response.json();
      if (!rawResult || !rawResult.report) {
        throw new Error("Invalid or empty audit report format from core endpoint.");
      }

      saveToHistory(rawResult.report);
      setActiveWorkspaceTab("overview");
    } catch (err: any) {
      console.error("Audit post execution failed:", err);
      setError(
        err.message || 
        "Network connection constraint. Ensure your dev server is active and Gemini API key resides in workspace secrets."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-350 ${
      darkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* 1. COMPONENT HEADER BAR */}
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        history={history}
        currentId={currentId}
        onSelectHistory={handleSelectHistoryId}
        onClearHistory={handleClearHistory}
        domainName={report ? report.domain : null}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* TOPLINE OVERVIEW CARD AND INPUT FORM MODULE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <AuditForm
              darkMode={darkMode}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              error={error}
            />
            
            {/* Run New CTA helper info when audit already present */}
            {report && !isLoading && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                darkMode ? "bg-slate-900/30 border-slate-800/80 text-slate-400" : "bg-white border-slate-200 text-slate-500"
              }`}>
                <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin-slow inline mr-1.5" />
                <span>You can model another brand by changing inputs and pressing <strong>Analyze</strong> again. The current audit remains cache-loaded on your history.</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            {report ? (
              /* DYNAMIC WORKSPACE TABS SECTION WHEN AUDIT REPORT ACTIVE */
              <div className="space-y-6 animate-fade-in">
                
                {/* Horizontal navigation rail indicators */}
                <div className="flex border-b border-slate-200 dark:border-slate-800/80 pb-1.5 gap-1.5 overflow-x-auto no-print scrollbar-none">
                  {[
                    { id: "overview" as const, name: "Executive Summary" },
                    { id: "modules" as const, name: "Modules Grid (1-6)" },
                    { id: "competitors" as const, name: "Competitor Comparison" },
                    { id: "roadmap" as const, name: "AI Visibility Roadmap" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveWorkspaceTab(tab.id)}
                      className={`px-4 py-2 text-xs font-bold font-display rounded-lg transition-all border shrink-0 cursor-pointer ${
                        activeWorkspaceTab === tab.id
                          ? (darkMode ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold" : "bg-indigo-50 border-indigo-200 text-indigo-700")
                          : (darkMode ? "bg-transparent border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200" : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100")
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Submodule layout render based on active workspace index selection */}
                {activeWorkspaceTab === "overview" && (
                  <div className="animate-fade-in duration-300">
                    <ExecutiveSummaryView report={report} darkMode={darkMode} />
                  </div>
                )}

                {activeWorkspaceTab === "modules" && (
                  <div className="animate-fade-in duration-300">
                    <ModulesGridView report={report} darkMode={darkMode} />
                  </div>
                )}

                {activeWorkspaceTab === "competitors" && (
                  <div className="animate-fade-in duration-300">
                    <CompetitorComparisonView report={report} darkMode={darkMode} />
                  </div>
                )}

                {activeWorkspaceTab === "roadmap" && (
                  <div className="animate-fade-in duration-300">
                    <RoadmapView report={report} darkMode={darkMode} />
                  </div>
                )}

              </div>
            ) : (
              /* 2. ONBOARDING OVERVIEW CONTEXT WHEN ZERO AUDITS EXIST */
              <div className={`p-8 rounded-2xl border flex flex-col justify-between h-full space-y-8 ${
                darkMode ? "bg-slate-900/30 border-slate-800/80" : "bg-white border-slate-200"
              }`} id="onboarding-cards">
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-bold text-indigo-400 font-mono">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>The Era of Generative AI Search</span>
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight">
                    Traditional SEO is changing. Are you prepared?
                  </h2>
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    AI search models do not crawl looking for mere keyword matches to output link lists. Systems like <strong>ChatGPT</strong>, <strong>Gemini</strong>, and <strong>Perplexity</strong> parse websites to answer questions, cite trustworthy entities, and recommend solutions directly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className={`p-4 rounded-xl border border-inherit space-y-2 ${
                    darkMode ? "bg-slate-950/20" : "bg-slate-50"
                  }`}>
                    <span className="text-lg">🤖</span>
                    <h4 className="text-xs font-bold font-display uppercase tracking-wider">AI Visibility Score</h4>
                    <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Citations potential of your brand across global LLM indexes based on historical pre-training records.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border border-inherit space-y-2 ${
                    darkMode ? "bg-slate-950/20" : "bg-slate-50"
                  }`}>
                    <span className="text-lg">🏢</span>
                    <h4 className="text-xs font-bold font-display uppercase tracking-wider">Entity Verification</h4>
                    <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Connecting schema connections and SameAs metadata to resolve ambiguities in absolute knowledge graphs.
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border border-inherit space-y-2 ${
                    darkMode ? "bg-slate-950/20" : "bg-slate-50"
                  }`}>
                    <span className="text-lg">⚙</span>
                    <h4 className="text-xs font-bold font-display uppercase tracking-wider">Crawl Ready SEO</h4>
                    <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Optimizing robots guidelines for user agents like GPTBot, enabling perfect data structuring for LLM parsers.
                    </p>
                  </div>

                </div>

                <div className={`p-4 rounded-xl border border-dashed border-slate-700/30 flex items-start gap-3 text-xs leading-relaxed ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  <Globe className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-semibold block ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Real-time Search Grounding Enabled</span>
                    We use server-side Gemini 3 series APIs backed by active web searches. This identifies if Wikidata pages, reviews profiles, or schema signals are truly discoverable in live search caches.
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </main>

      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        darkMode={darkMode}
      />

      {/* FOOTER METRIC BRAND */}
      <footer className={`border-t py-6 text-center text-xs mt-12 no-print ${
        darkMode ? "border-slate-900/60 bg-slate-950/40 text-slate-500" : "border-slate-200 bg-white text-slate-400"
      }`}>
        <p>© 2026 AI Visibility Auditor. Developed by <strong className={darkMode ? "text-slate-300" : "text-slate-700"}>Ami - SEO Girl</strong>. All rights reserved.</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-indigo-500">
          AI visibility, entity authority and generative search readiness
        </p>
      </footer>

    </div>
  );
}
