import React, { useState } from "react";
import { ArrowUpDown, HelpCircle, Hammer, Sparkles, Filter, CheckCircle2, AlertOctagon } from "lucide-react";
import { OpportunityMatrixChart, TrendLineChart } from "./Charts";
import { AuditReport, RoadmapItem } from "../types";

interface RoadmapProps {
  report: AuditReport;
  darkMode: boolean;
}

export default function RoadmapView({ report, darkMode }: RoadmapProps) {
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterModule, setFilterModule] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"gain" | "difficulty">("gain");

  // Get difficulty score numerical approximation for sorting
  const getDifficultyScore = (diff: 'Easy' | 'Medium' | 'Hard') => {
    if (diff === "Easy") return 1;
    if (diff === "Medium") return 2;
    return 3;
  };

  const priorityColors = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case "High":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/15";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/15";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/15";
    }
  };

  const difficultyColors = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case "Easy":
        return "bg-slate-100 dark:bg-slate-800 text-emerald-400 font-bold";
      case "Medium":
        return "bg-slate-100 dark:bg-slate-800 text-amber-500 font-bold";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-rose-500 font-bold";
    }
  };

  const filteredRoadmap = report.roadmap
    .filter((item) => filterPriority === "All" || item.priority === filterPriority)
    .filter((item) => filterModule === "All" || item.module === filterModule)
    .sort((a, b) => {
      if (sortBy === "gain") {
        return b.estimatedGain - a.estimatedGain; // high gain first
      } else {
        return getDifficultyScore(a.difficulty) - getDifficultyScore(b.difficulty); // easy first
      }
    });

  // Unique modules list in roadmap for filter options
  const modulesList = Array.from(new Set(report.roadmap.map((item) => item.module)));

  return (
    <div className="space-y-6" id="visibility-roadmap-module">
      
      {/* 6-Month Trajectory Trend Plot */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
      }`}>
        <div className="border-b border-inherit pb-3 mb-4">
          <h3 className={`font-display font-black text-lg ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
            6-Month AI Optimization Pathway
          </h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Visualizing domain trajectory if recommendations are deployed over the next two quarters.
          </p>
        </div>

        <TrendLineChart trendData={report.trendData} darkMode={darkMode} />
      </div>

      {/* 2D Opportunity Matrix Plot on Left and recommendation on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Matrix Plot (Looming Priorities) */}
        <div className={`p-6 rounded-2xl border transition-colors lg:col-span-1 ${
          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
        }`}>
          <div className="border-b border-inherit pb-3 mb-4">
            <h3 className={`font-display font-black text-base ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              Prioritization Matrix
            </h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Scatter plots relative to priority ease (x-axis) and impact (y-axis).
            </p>
          </div>

          <OpportunityMatrixChart matrixData={report.opportunityMatrix} darkMode={darkMode} />
        </div>

        {/* Dynamic Recomendation Listing items (Right) */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 transition-colors ${
          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
        }`}>
          
          {/* Controls Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-inherit mb-4 gap-3 no-print">
            <h3 className={`font-display font-black text-base ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              Detailed Action Items ({filteredRoadmap.length})
            </h3>
            
            {/* Filtering Tools row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Module Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/40 border dark:border-slate-850 px-2 py-1 rounded-lg text-xs leading-none">
                <Filter className="h-3 w-3 text-slate-500" />
                <select
                  className="bg-transparent text-[11px] font-semibold font-mono outline-none text-inherit uppercase"
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                >
                  <option value="All">All Areas</option>
                  {modulesList.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/40 border dark:border-slate-850 px-2 py-1 rounded-lg text-xs leading-none">
                <select
                  className="bg-transparent text-[11px] font-semibold font-mono outline-none text-inherit uppercase"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Sorting Sort */}
              <button
                onClick={() => setSortBy(sortBy === "gain" ? "difficulty" : "gain")}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold font-mono border flex items-center gap-1 transition-colors hover:bg-slate-800 ${
                  darkMode ? "bg-slate-850 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
                title="Toggle Sorting order"
              >
                <ArrowUpDown className="h-3 w-3 text-indigo-500" />
                <span>Sort: {sortBy === "gain" ? "Gain" : "Difficulty"}</span>
              </button>
            </div>
          </div>

          {/* Core Roadmap Recommendations vertical list */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {filteredRoadmap.length > 0 ? (
              filteredRoadmap.map((item, idx) => (
                <div key={item.id} className={`p-4 rounded-xl border border-inherit space-y-2.5 transition-colors ${
                  darkMode ? "bg-slate-950/20 hover:bg-slate-950/45" : "bg-slate-50 hover:bg-slate-100/50"
                }`}>
                  
                  {/* Top line badges */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-widest uppercase font-mono ${priorityColors(item.priority)}`}>
                        {item.priority} Priority
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest uppercase font-mono ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {item.module}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-[10px] font-mono text-indigo-400 font-black">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      <span>Gain: +{item.estimatedGain} Points</span>
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold leading-tight font-display text-inherit flex gap-2">
                      <span className={`inline-block font-mono text-[10px] pr-1 border-r border-slate-700 text-slate-500`}>
                        0{idx + 1}
                      </span>
                      <span>{item.title}</span>
                    </h4>
                    <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Micro characteristics grid */}
                  <div className="flex items-center gap-4 text-[10px] font-mono font-medium text-slate-500 justify-end pt-1">
                    <div>IMPACT: <strong className="text-slate-300">{item.impact.toUpperCase()}</strong></div>
                    <div>DIFFICULTY: <strong className={item.difficulty === 'Easy' ? 'text-emerald-500' : item.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}>{item.difficulty.toUpperCase()}</strong></div>
                  </div>

                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-slate-700/30 rounded-xl text-center text-xs text-slate-500">
                No active recommendations match selected criteria filters.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
