import React from "react";
import { CheckCircle2, AlertOctagon, TrendingUp, HelpCircle, ShieldAlert, Award, Calendar, Lightbulb } from "lucide-react";
import { ScoreGauge } from "./Charts";
import { AuditReport } from "../types";

interface ExecutiveProps {
  report: AuditReport;
  darkMode: boolean;
}

export default function ExecutiveSummaryView({ report, darkMode }: ExecutiveProps) {
  const getGradeStyles = (grade: string) => {
    switch (grade) {
      case "A":
        return { bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", text: "Excellent" };
      case "B":
        return { bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", text: "Strong" };
      case "C":
        return { bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", text: "Average" };
      case "D":
        return { bg: "bg-orange-500/10 text-orange-400 border-orange-500/20", text: "Weak" };
      default:
        return { bg: "bg-rose-500/10 text-rose-400 border-rose-500/20", text: "Poor" };
    }
  };

  const gradeInfo = getGradeStyles(report.grade);

  return (
    <div className="space-y-6" id="executive-summary-section">
      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Score & Grade Card */}
        <div className={`p-6 rounded-2xl border flex flex-col items-center justify-between text-center transition-colors ${
          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
        }`}>
          <div>
            <div className="flex items-center gap-1.5 justify-center">
              <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className={`text-[10px] uppercase font-mono tracking-widest ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Scoring Profile
              </span>
            </div>
            <h3 className={`font-display font-black text-xl mt-1 leading-snug ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              AI Visibility Index
            </h3>
          </div>

          {/* Interactive Custom Gauge */}
          <ScoreGauge score={report.overallScore} label="Overall" size={190} darkMode={darkMode} />

          {/* Large Letter Grade visual */}
          <div className="w-full pt-4 border-t border-inherit flex items-center justify-around">
            <div className="text-left">
              <span className={`text-[10px] font-mono block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                VISIBILITY RATING
              </span>
              <span className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                {gradeInfo.text}
              </span>
            </div>
            <div className={`px-4 py-1.5 rounded-xl border text-2xl font-display font-black tracking-wide ${gradeInfo.bg}`}>
              {report.grade}
            </div>
          </div>
        </div>

        {/* Audit Meta Parameters */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between lg:col-span-2 transition-colors ${
          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="space-y-0.5">
                <span className={`text-[10px] uppercase tracking-wider font-mono ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Audit Context Scope
                </span>
                <h3 className={`font-display font-black text-lg ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  {report.brandName || report.domain}
                </h3>
              </div>
              <div className={`text-xs px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1.5 ${
                darkMode ? "bg-slate-800/60 border-slate-700/60 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <Calendar className="h-3 w-3 text-indigo-500" />
                <span>{new Date(report.scannedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 border border-inherit rounded-xl">
                <span className={`text-[10px] font-mono block mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>DOMAIN</span>
                <span className="text-xs font-bold truncate block">{report.domain}</span>
              </div>
              <div className="p-3 border border-inherit rounded-xl">
                <span className={`text-[10px] font-mono block mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>INDUSTRY</span>
                <span className="text-xs font-bold truncate block">{report.industry || "General Business"}</span>
              </div>
              <div className="p-3 border border-inherit rounded-xl">
                <span className={`text-[10px] font-mono block mb-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>COUNTRY</span>
                <span className="text-xs font-bold truncate block">{report.country || "Global"}</span>
              </div>
              <div className="p-3 border border-inherit rounded-xl bg-indigo-500/5">
                <span className={`text-[10px] font-mono block mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>COMPETITORS</span>
                <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {report.competitors && report.competitors.length > 0 ? report.competitors.length : 0} Profiled
                </span>
              </div>
            </div>

            {/* Structured calculation breakdown explainer */}
            <div className={`p-4 rounded-xl border flex gap-3 text-xs items-start leading-relaxed ${
              darkMode ? "bg-slate-950/40 border-slate-800/80 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}>
              <HelpCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">How is the overall score computed?</p>
                <p>
                  We compile your index visibility and citation likelihood using a weighted AI Search index algorithm:
                </p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono text-slate-500">
                  <div>🤖 AI Visibility: <strong>25%</strong></div>
                  <div>🏛️ Entity Signals: <strong>20%</strong></div>
                  <div>✍️ Content Signals: <strong>20%</strong></div>
                  <div>🛡️ Trust & Citations: <strong>20%</strong></div>
                  <div>⚙️ Tech AI Structure: <strong>15%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Strengths and Weaknesses Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Strengths */}
        <div className={`p-6 rounded-2xl border transition-colors ${
          darkMode ? "bg-slate-900/40 border-slate-800/80 text-slate-100" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex items-center space-x-2 pb-3 border-b border-inherit mb-4">
            <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-display font-semibold text-lg">Top 5 LLM Indexing Strengths</h3>
          </div>
          <ul className="space-y-3.5">
            {report.topStrengths.map((strength, idx) => (
              <li key={idx} className="flex items-start text-xs leading-relaxed gap-2.5">
                <span className="h-5 w-5 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  0{idx + 1}
                </span>
                <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Weaknesses */}
        <div className={`p-6 rounded-2xl border transition-colors ${
          darkMode ? "bg-slate-900/40 border-slate-800/80 text-slate-100" : "bg-white border-slate-200 text-slate-800"
        }`}>
          <div className="flex items-center space-x-2 pb-3 border-b border-inherit mb-4">
            <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
            <h3 className="font-display font-semibold text-lg">Top 5 Citation Bottlenecks</h3>
          </div>
          <ul className="space-y-3.5">
            {report.topWeaknesses.map((weakness, idx) => (
              <li key={idx} className="flex items-start text-xs leading-relaxed gap-2.5">
                <span className="h-5 w-5 rounded-md bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  0{idx + 1}
                </span>
                <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Biggest Opportunities banner */}
      <div className="p-6 rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-transparent">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-700/10 dark:border-slate-800/80 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <h3 className="font-display font-bold text-lg">Biggest Opportunities for Citation Gains</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.biggestOpportunities.map((opportunity, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-indigo-500/10 bg-slate-50 dark:bg-slate-900/25 flex gap-3 text-xs leading-relaxed">
              <span className="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                ★
              </span>
              <p className={darkMode ? "text-slate-300" : "text-slate-600"}>{opportunity}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
