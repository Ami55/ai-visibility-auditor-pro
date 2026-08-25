import React, { useState } from "react";
import {
  Globe,
  Cpu,
  BookOpen,
  Award,
  Download,
  Terminal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Search,
  BookMarked
} from "lucide-react";
import { AuditReport, VisibilityPlatform, EntitySignal, ContentAuditElement } from "../types";
import { ScoreGauge } from "./Charts";

interface ModulesGridProps {
  report: AuditReport;
  darkMode: boolean;
}

export default function ModulesGridView({ report, darkMode }: ModulesGridProps) {
  const [activeTab, setActiveTab] = useState<"visibility" | "entity" | "content" | "authority" | "retrieval" | "technical">("visibility");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const getStatusColor = (status: 'Detected' | 'Partial' | 'Missing' | 'Optimized' | 'Needs Work' | 'Absent') => {
    switch (status) {
      case 'Detected':
      case 'Optimized':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Partial':
      case 'Needs Work':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  const menuItems = [
    { id: "visibility" as const, name: "Module 1: AI Visibility", icon: Globe, score: Math.round((report.visibilityPlatforms.chatgpt.score + report.visibilityPlatforms.gemini.score + report.visibilityPlatforms.claude.score + report.visibilityPlatforms.perplexity.score + report.visibilityPlatforms.googleAiOverviews.score) / 5) },
    { id: "entity" as const, name: "Module 2: Entity Status", icon: Cpu, score: report.entityScore },
    { id: "content" as const, name: "Module 3: Content Clarity", icon: BookOpen, score: report.contentScore },
    { id: "authority" as const, name: "Module 4: Authority & Trust", icon: Award, score: report.authorityScore },
    { id: "retrieval" as const, name: "Module 5: Retrieval Readiness", icon: Download, score: report.retrievalScore },
    { id: "technical" as const, name: "Module 6: Technical AI SEO", icon: Terminal, score: report.technicalScore },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="core-modules-container">
      
      {/* 1. MODULES SELECT SIDEBAR */}
      <div className="lg:col-span-1 space-y-2 no-print">
        <span className={`text-[10px] uppercase font-mono tracking-wider block px-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          SELECT MODULE REPORT
        </span>
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                  isActive
                    ? (darkMode ? "bg-slate-800 border-indigo-600 text-white shadow-lg shadow-indigo-600/5" : "bg-white border-indigo-600 text-slate-800 shadow-sm")
                    : (darkMode ? "bg-slate-900/35 border-slate-800/60 hover:border-slate-700 text-slate-400 hover:text-slate-200" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`} />
                  <span className="truncate">{item.name.replace("Module ", "")}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-sm font-mono text-[10px] select-none ${getScoreColor(item.score)}`}>
                  {item.score}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB VIEWPORT SECTION */}
      <div className={`lg:col-span-3 p-6 rounded-2xl border transition-colors ${
        darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
      }`}>
        
        {/* ================= MODULE 1: AI VISIBILITY ANALYSIS ================= */}
        {activeTab === "visibility" && (
          <div className="space-y-6" id="module-ai-visibility">
            <div className="border-b border-inherit pb-3 flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  AI Visibility Analysis
                </h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Check citation likelihood across leading LLM search agents.
                </p>
              </div>
              <Cpu className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(report.visibilityPlatforms).map(([key, val]) => {
                const platform = val as VisibilityPlatform;
                return (
                  <div key={key} className={`p-4 rounded-xl border border-inherit space-y-3 ${
                    darkMode ? "bg-slate-950/30" : "bg-slate-50"
                  }`}>
                    {/* Platform Head */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className={`text-11px font-mono tracking-wide px-1.5 py-0.5 rounded-sm capitalize ${
                          platform.rating === "Strong" 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : platform.rating === "Moderate" 
                              ? "bg-amber-500/10 text-amber-500" 
                              : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {platform.name}
                        </span>
                        <p className={`text-[10px] font-mono ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          Rating: {platform.rating}
                        </p>
                      </div>
                      <span className={`text-lg font-display font-black tracking-tighter ${
                        platform.score >= 80 ? "text-emerald-500" : platform.score >= 60 ? "text-amber-500" : "text-rose-500"
                      }`}>
                        {platform.score}/100
                      </span>
                    </div>

                    {/* Description text */}
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {platform.explanation}
                    </p>

                    {/* Explanatory bullets reasons lists */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5 dark:border-white/5 border-slate-200">
                      <span className={`text-[9px] uppercase font-mono tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        Factors Detected
                      </span>
                      <ul className="space-y-1">
                        {platform.reasons.map((reason, rIdx) => (
                          <li key={rIdx} className="text-[11px] flex items-start gap-1.5 text-slate-400">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= MODULE 2: ENTITY UNDERSTANDING ================= */}
        {activeTab === "entity" && (
          <div className="space-y-6" id="module-entity-understanding">
            <div className="border-b border-inherit pb-4 flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  Entity Understanding Score
                </h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Evaluate how well AI maps this brand in its central Knowledge Graphs.
                </p>
              </div>
              <span className={`text-lg font-display font-black tracking-tighter ${getScoreColor(report.entityScore)} px-2.5 py-1 rounded-lg border`}>
                {report.entityScore}/100
              </span>
            </div>

            {/* Checklist elements */}
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-mono tracking-wider block pb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Structure & Entity Signals Audit
              </span>
              <div className="border border-inherit rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800/80">
                {Object.entries(report.entitySignals).map(([key, signal]) => {
                  const sig = signal as EntitySignal;
                  return (
                    <div key={key} className={`p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                      darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-50"
                    }`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold block">{sig.name}</span>
                          <span className={`text-[8px] tracking-[0.05em] uppercase px-1 rounded-sm border font-bold ${
                            sig.importance === "High" ? "bg-red-500/5 text-rose-500 border-rose-500/10" : "bg-slate-500/5 text-slate-500 border-slate-500/10"
                          }`}>
                            {sig.importance} Priority
                          </span>
                        </div>
                        <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {sig.description}
                        </p>
                      </div>
                      <div className="flex items-center shrink-0">
                        <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold ${getStatusColor(sig.status)}`}>
                          {sig.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths and Gaps lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-inherit rounded-xl bg-emerald-500/5">
                <span className="text-xs font-bold text-emerald-400 block mb-2 font-display">
                  ✓ Semantic Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {report.entityStrengths.map((st, idx) => (
                    <li key={idx} className="flex gap-2 text-slate-300 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border border-inherit rounded-xl bg-rose-500/5">
                <span className="text-xs font-bold text-rose-400 block mb-2 font-display">
                  ⚠ Missing Entity Anchors
                </span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {report.entityMissing.map((ms, idx) => (
                    <li key={idx} className="flex gap-2 text-rose-400 dark:text-rose-400">
                      <span className="font-bold">•</span>
                      <span>{ms}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 3: CONTENT UNDERSTANDING ================= */}
        {activeTab === "content" && (
          <div className="space-y-6" id="module-content-understanding">
            <div className="border-b border-inherit pb-4 flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  Content Understanding Score
                </h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Ensure your key directories and resources are legible for AI pre-training scrapers.
                </p>
              </div>
              <span className={`text-lg font-display font-black tracking-tighter ${getScoreColor(report.contentScore)} px-2.5 py-1 rounded-lg border`}>
                {report.contentScore}/100
              </span>
            </div>

            {/* Content areas list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(report.contentAnalysis).map(([key, page]) => {
                const p = page as ContentAuditElement;
                return (
                  <div key={key} className="p-3 border border-inherit rounded-xl flex items-start gap-3">
                    <span className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border text-[10px] font-bold ${getStatusColor(p.status)}`}>
                      {p.status === "Optimized" ? "✓" : p.status === "Needs Work" ? "⚠" : "✗"}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block">{p.name}</span>
                      <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Covered vs Missing Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-inherit pt-4">
              <div className="space-y-2">
                <span className={`text-[10px] font-mono uppercase font-bold tracking-widest block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Topics Adequately Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.topicsCovered.map((topic, idx) => (
                    <span key={idx} className={`px-2 py-1 text-xs rounded-lg border ${
                      darkMode ? "bg-slate-800/40 border-slate-700/60 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}>
                      📘 {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className={`text-[10px] font-mono uppercase font-bold tracking-widest block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Missing High-Intent Content Gaps
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.topicsMissing.map((topic, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs rounded-lg border bg-rose-500/10 text-rose-400 border-rose-500/15">
                      ✗ {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 4: AUTHORITY & TRUST ================= */}
        {activeTab === "authority" && (
          <div className="space-y-6" id="module-authority-trust">
            <div className="border-b border-inherit pb-4 flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  AI Authority & Trust Score
                </h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Does the brand possess backlinks and mentions on high-authority AI hubs?
                </p>
              </div>
              <span className={`text-lg font-display font-black tracking-tighter ${getScoreColor(report.authorityScore)} px-2.5 py-1 rounded-lg border`}>
                {report.authorityScore}/100
              </span>
            </div>

            {/* Mentions Sources list */}
            <div className="space-y-2">
              <span className={`text-[10px] font-mono uppercase tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Scanned Mention Channels (Forums, Review sites, News hubs)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {report.mentionSources.map((source, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                    darkMode ? "bg-slate-950/35 border-slate-800/80" : "bg-slate-50 border-slate-200"
                  }`}>
                    <Search className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="truncate">{source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Found trust vs missing trust */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-inherit bg-emerald-500/5 text-xs space-y-2">
                <span className="font-bold text-emerald-400 block font-display">✓ Trust Signals Found</span>
                <ul className="space-y-1.5 leading-relaxed text-slate-300">
                  {report.trustSignalsFound.map((ts, idx) => (
                    <li key={idx} className="flex gap-2 align-top text-slate-300 dark:text-slate-300">
                      <span>•</span>
                      <span>{ts}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-inherit bg-rose-500/5 text-xs space-y-2">
                <span className="font-bold text-rose-400 block font-display">⚠ Missing Trust Anchors</span>
                <ul className="space-y-1.5 leading-relaxed text-slate-400 dark:text-slate-400">
                  {report.trustSignalsMissing.map((ts, idx) => (
                    <li key={idx} className="flex gap-2 align-top text-rose-400 dark:text-rose-400">
                      <span>•</span>
                      <span>{ts}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 5: AI RETRIEVAL READINESS ================= */}
        {activeTab === "retrieval" && (
          <div className="space-y-6" id="module-retrieval-readiness">
            <div className="border-b border-inherit pb-4 flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  AI Retrieval Readiness Score
                </h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Are your templates structured correctly for RAG systems (Vectara, LangChain, LLM agents)?
                </p>
              </div>
              <span className={`text-lg font-display font-black tracking-tighter ${getScoreColor(report.retrievalScore)} px-2.5 py-1 rounded-lg border`}>
                {report.retrievalScore}/100
              </span>
            </div>

            {/* Retrieval details metrics */}
            <div className="space-y-2.5 text-xs">
              <span className={`text-[10px] uppercase font-mono tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                RAG Suitability Analysis
              </span>
              <div className="border border-inherit rounded-xl divide-y divide-slate-200 dark:divide-slate-800/80 overflow-hidden">
                {Object.entries(report.retrievalDetails).map(([key, desc]) => (
                  <div key={key} className={`p-3 flex flex-col md:flex-row justify-between gap-2 md:items-center ${
                    darkMode ? "hover:bg-slate-800/20" : "hover:bg-slate-50"
                  }`}>
                    <span className="font-mono font-bold capitalize text-slate-400 shrink-0 md:w-44">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <p className={`text-xs max-w-xl leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and recommendations split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-3 border border-inherit rounded-xl space-y-1.5">
                <span className="text-xs font-bold font-display text-emerald-400 block pb-1 border-b border-inherit">
                  ✓ Structural Strengths
                </span>
                <ul className="space-y-1 text-xs">
                  {report.retrievalStrengths.map((s, idx) => (
                    <li key={idx} className="text-slate-300 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 border border-inherit rounded-xl space-y-1.5">
                <span className="text-xs font-bold font-display text-emerald-400 block pb-1 border-b border-inherit">
                  ★ Optimization Recommendations
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {report.retrievalRecommendations.map((r, idx) => (
                    <li key={idx} className="text-slate-300 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULE 6: TECHNICAL AI SEO ================= */}
        {activeTab === "technical" && (
          <div className="space-y-6" id="module-technical-ai-seo">
            <div className="border-b border-inherit pb-4 flex items-center justify-between">
              <div>
                <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  Technical AI SEO Score
                </h3>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Evaluate hard JSON-LD structures, article schemas, breadcrumbs, robots.txt, and indices.
                </p>
              </div>
              <span className={`text-lg font-display font-black tracking-tighter ${getScoreColor(report.technicalScore)} px-2.5 py-1 rounded-lg border`}>
                {report.technicalScore}/100
              </span>
            </div>

            {/* Interactive diagnostics panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Implemented schemas */}
              <div className={`p-4 rounded-xl border border-inherit ${darkMode ? "bg-slate-950/25" : "bg-slate-50"}`}>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 border-b border-inherit pb-2 mb-3 font-display">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Implemented Microdata Structures</span>
                </div>
                {report.technicalDetails.implemented.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    {report.technicalDetails.implemented.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No structured markup detected on home route.</p>
                )}
              </div>

              {/* Missing schemas */}
              <div className={`p-4 rounded-xl border border-inherit ${darkMode ? "bg-slate-950/25" : "bg-slate-50"}`}>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 border-b border-inherit pb-2 mb-3 font-display">
                  <span className="text-rose-400 font-bold shrink-0">✗</span>
                  <span>Missing Microdata (High Risk)</span>
                </div>
                {report.technicalDetails.missing.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    {report.technicalDetails.missing.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-slate-400 dark:text-rose-400 font-mono">
                        <span className="font-bold border px-1 rounded-sm bg-rose-500/10 text-[9px]">CRITICAL</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-500 italic">All essential core schemas present.</p>
                )}
              </div>

              {/* Crawl index Diagnostics / Errors */}
              <div className={`p-4 rounded-xl border border-inherit md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-linear-to-tr from-rose-500/5 to-transparent`}>
                {/* Diagnostics lists */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 font-display">
                    <XCircle className="h-4 w-4 shrink-0" />
                    <span>Schema Parsing Errors ({report.technicalDetails.errors.length})</span>
                  </div>
                  {report.technicalDetails.errors.length > 0 ? (
                    <ul className="space-y-1.5 text-xs">
                      {report.technicalDetails.errors.map((err, idx) => (
                        <li key={idx} className="p-2 rounded bg-rose-500/5 text-rose-400 font-mono text-[10px] border border-rose-500/10 leading-relaxed">
                          {err}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-500 italic font-mono text-[10px]">Zero schema formatting errors detected.</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 font-display">
                    <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" />
                    <span>Crawler Accessibility Warnings ({report.technicalDetails.warnings.length})</span>
                  </div>
                  {report.technicalDetails.warnings.length > 0 ? (
                    <ul className="space-y-1.5 text-xs">
                      {report.technicalDetails.warnings.map((warn, idx) => (
                        <li key={idx} className="p-2 rounded bg-amber-500/5 text-amber-400 font-mono text-[10px] border border-amber-500/10 leading-relaxed">
                          {warn}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-500 italic font-mono text-[10px]">Zero Crawler restrictions detected.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
