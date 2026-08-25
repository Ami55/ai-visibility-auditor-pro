import React from "react";
import { ArrowUpRight, Check, ShieldCheck, HeartCrack, Crosshair, Users } from "lucide-react";
import { CompetitorChart } from "./Charts";
import { AuditReport } from "../types";

interface CompetitorProps {
  report: AuditReport;
  darkMode: boolean;
}

export default function CompetitorComparisonView({ report, darkMode }: CompetitorProps) {
  const compCount = report.competitors ? report.competitors.length : 0;

  return (
    <div className={`p-6 rounded-2xl border transition-colors ${
      darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
    }`} id="competitors-comparison-module">
      
      <div className="border-b border-inherit pb-4 flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-display font-black text-xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
            Module 7: Competitor SEC Analysis
          </h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Compare your LLM indexing and citation footprint relative to industry competitors.
          </p>
        </div>
        <div className={`px-2.5 py-1 text-xs border rounded-lg font-mono flex items-center gap-1.5 ${
          darkMode ? "bg-slate-800/50 border-slate-700/60 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <Users className="h-3.5 w-3.5 text-indigo-500" />
          <span>{compCount > 0 ? `${compCount} Competitors Indexed` : "No Competitors Added"}</span>
        </div>
      </div>

      {compCount > 0 ? (
        <div className="space-y-6">
          {/* Recharts chart on top */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            {/* Chart Area */}
            <div className="lg:col-span-2">
              <span className={`text-[10px] uppercase font-mono tracking-widest block mb-1.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Score Comparison Visualizer
              </span>
              <CompetitorChart
                myScore={report.overallScore}
                myEntity={report.entityScore}
                myAuth={report.authorityScore}
                myContent={report.contentScore}
                competitors={report.competitors}
                darkMode={darkMode}
              />
            </div>

            {/* Score matrix table right */}
            <div className="space-y-3">
              <span className={`text-[10px] uppercase font-mono tracking-widest block mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Metric Table Overview
              </span>
              
              <div className="border border-inherit rounded-xl divide-y divide-inherit overflow-hidden font-mono text-xs">
                {/* You */}
                <div className="p-3 bg-indigo-500/5 flex items-center justify-between">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 truncate">You ({report.brandName})</span>
                  <span className="font-black text-indigo-500">{report.overallScore} / 100</span>
                </div>

                {/* Competitors */}
                {report.competitors.map((comp, idx) => (
                   <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-800/20">
                     <span className="text-slate-300 font-semibold truncate">{comp.name}</span>
                     <span className="font-black text-indigo-400">{comp.visibilityScore} / 100</span>
                   </div>
                ))}
              </div>

              <div className={`p-4 rounded-xl border border-inherit text-xs leading-relaxed ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}>
                <Info className="h-4 w-4 text-indigo-500 inline mr-1 mb-0.5" />
                Scores correspond strictly to retrieval probability index, entity link strength, E-E-A-T signals weight, and structural readiness parameters.
              </div>
            </div>

          </div>

          {/* Qualitative Analysis Advantages/Disadvantages/Missed Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-inherit pt-6">
            
            {/* Edge Advantages */}
            <div className={`p-4 rounded-xl border border-inherit space-y-3 ${
              darkMode ? "bg-slate-950/25" : "bg-slate-50"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 font-display">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                <span>Your Core Advantages</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {report.advantages.map((adv, idx) => (
                  <li key={idx} className="flex gap-2 text-slate-300 dark:text-slate-300">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Disadvantages */}
            <div className={`p-4 rounded-xl border border-inherit space-y-3 ${
              darkMode ? "bg-slate-950/25" : "bg-slate-50"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 font-display">
                <HeartCrack className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                <span>Your Core Vulnerabilities</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
                {report.disadvantages.map((dis, idx) => (
                  <li key={idx} className="flex gap-2 text-slate-300 dark:text-slate-300">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Missed Opportunities */}
            <div className={`p-4 rounded-xl border border-inherit space-y-3 bg-linear-to-tr from-indigo-500/5 to-transparent`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 font-display">
                <Crosshair className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                <span>Missed Competitor Gaps</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {report.missedOpportunities.map((gap, idx) => (
                  <li key={idx} className="flex gap-2 text-slate-300 dark:text-slate-300">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      ) : (
        /* Empty / CTA to add competitors */
        <div className="py-12 text-center space-y-3 border border-dashed border-slate-700/30 rounded-2xl">
          <span className="text-2xl text-slate-500 block">👥</span>
          <p className="text-xs font-bold">No Competitor Domains Profiled</p>
          <p className={`text-xs max-w-sm mx-auto ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            To enable advanced Module 7 competitor comparison matrix, please enter competitor domain names (such as <span className="text-indigo-500 font-bold font-mono">viator.com, getyourguide.com</span>) in the optional competitors form input block and re-run the scan.
          </p>
        </div>
      )}

    </div>
  );
}

// Minimal interface to keep helper functions compiling
interface InfoProps {
  className?: string;
}

function Info({ className }: InfoProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}
