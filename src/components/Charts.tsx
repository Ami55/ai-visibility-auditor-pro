import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";
import { CompetitorData } from "../types";

// ==================== 1. CUSTOM SVG SEMI-GAUGE ====================
interface GaugeProps {
  score: number;
  label: string;
  size?: number;
  darkMode?: boolean;
}

export function ScoreGauge({ score, label, size = 180, darkMode = true }: GaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine colors based on score
  let colorClass = "stroke-indigo-600 text-indigo-600";
  let bgStroke = darkMode ? "stroke-slate-800" : "stroke-slate-200";
  
  if (score < 50) {
    colorClass = "stroke-rose-500 text-rose-500";
  } else if (score < 70) {
    colorClass = "stroke-amber-500 text-amber-500";
  } else if (score < 85) {
    colorClass = "stroke-indigo-400 text-indigo-400";
  }

  // Calculate coordinates for needle
  const angle = (score / 100) * 180 - 180; // scale from 0 to 180 degrees, offset to align flat left
  const radians = (angle * Math.PI) / 180;
  const needleLength = 55;
  const needleX = 100 + needleLength * Math.cos(radians);
  const needleY = 100 + needleLength * Math.sin(radians);

  return (
    <div className="flex flex-col items-center justify-center p-3 relative" id={`gauge-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <svg width={size} height={size / 1.1} viewBox="0 0 200 200" className="overflow-visible">
        {/* Background Track (semi circle) */}
        <path
          d="M 30,150 A 70,70 0 0,1 170,150"
          fill="none"
          className={bgStroke}
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Fill Track */}
        <path
          d="M 30,150 A 70,70 0 0,1 170,150"
          fill="none"
          className={colorClass}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={220 - (score / 100) * 220}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        {/* Score text in center */}
        <text
          x="100"
          y="130"
          textAnchor="middle"
          className={`font-display font-bold text-3xl ${darkMode ? 'fill-white' : 'fill-slate-900'}`}
        >
          {score}
        </text>
        <text
          x="100"
          y="155"
          textAnchor="middle"
          className={`text-xs font-medium uppercase tracking-widest ${darkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
        >
          {label}
        </text>
        <text
          x="30"
          y="175"
          textAnchor="middle"
          className="text-[10px] font-mono fill-slate-500"
        >
          0
        </text>
        <text
          x="170"
          y="175"
          textAnchor="middle"
          className="text-[10px] font-mono fill-slate-500"
        >
          100
        </text>
      </svg>
    </div>
  );
}

// ==================== 2. COMPETITOR COMPARISON CHART ====================
interface CompetitorChartProps {
  myScore: number;
  myEntity: number;
  myAuth: number;
  myContent: number;
  competitors: CompetitorData[];
  darkMode?: boolean;
}

export function CompetitorChart({
  myScore,
  myEntity,
  myAuth,
  myContent,
  competitors,
  darkMode = true
}: CompetitorChartProps) {
  const data = [
    {
      name: "Visibility",
      "You": myScore,
      ...(competitors[0] ? { [competitors[0].name]: competitors[0].visibilityScore } : {}),
      ...(competitors[1] ? { [competitors[1].name]: competitors[1].visibilityScore } : {}),
    },
    {
      name: "Entity",
      "You": myEntity,
      ...(competitors[0] ? { [competitors[0].name]: competitors[0].entityScore } : {}),
      ...(competitors[1] ? { [competitors[1].name]: competitors[1].entityScore } : {}),
    },
    {
      name: "Authority",
      "You": myAuth,
      ...(competitors[0] ? { [competitors[0].name]: competitors[0].authorityScore } : {}),
      ...(competitors[1] ? { [competitors[1].name]: competitors[1].authorityScore } : {}),
    },
    {
      name: "Content",
      "You": myContent,
      ...(competitors[0] ? { [competitors[0].name]: competitors[0].contentScore } : {}),
      ...(competitors[1] ? { [competitors[1].name]: competitors[1].contentScore } : {}),
    }
  ];

  const gridStroke = darkMode ? "#334155" : "#e2e8f0";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1e293b", border: "1px solid #475569", color: "#f8fafc" }
    : { backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#0f172a" };

  return (
    <div className="w-full h-80" id="competitor-comparison-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} />
          <YAxis domain={[0, 100]} stroke={darkMode ? "#94a3b8" : "#64748b"} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ paddingTop: 12 }} />
          <Bar dataKey="You" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          {competitors[0] && (
            <Bar dataKey={competitors[0].name} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          )}
          {competitors[1] && (
            <Bar dataKey={competitors[1].name} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ==================== 3. VISIBILITY TREND CHART ====================
interface TrendLineChartProps {
  trendData: { month: string; current: number; optimized: number }[];
  darkMode?: boolean;
}

export function TrendLineChart({ trendData, darkMode = true }: TrendLineChartProps) {
  const gridStroke = darkMode ? "#334155" : "#e2e8f0";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1e293b", border: "1px solid #475569", color: "#f8fafc" }
    : { backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#0f172a" };

  return (
    <div className="w-full h-80" id="visibility-trend-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="month" stroke={darkMode ? "#94a3b8" : "#64748b"} />
          <YAxis domain={[30, 100]} stroke={darkMode ? "#94a3b8" : "#64748b"} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Line
            type="monotone"
            dataKey="current"
            name="Current (No optimizations)"
            stroke={darkMode ? "#94a3b8" : "#64748b"}
            strokeDasharray="5 5"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="optimized"
            name="AI-Optimized Pathway"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ==================== 4. OPPORTUNITY MATRIX SCATTER CHART ====================
interface OpportunityMatrixProps {
  matrixData: { name: string; difficulty: number; impact: number; priority: 'High' | 'Medium' | 'Low' }[];
  darkMode?: boolean;
}

export function OpportunityMatrixChart({ matrixData, darkMode = true }: OpportunityMatrixProps) {
  const gridStroke = darkMode ? "#334155" : "#e2e8f0";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1e293b", border: "1px solid #475569", color: "#f8fafc" }
    : { backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#0f172a" };

  return (
    <div className="w-full h-[360px] relative" id="opportunity-matrix-chart">
      {/* Visual quadrant labels */}
      <div className="absolute top-2 left-14 text-[10px] font-semibold text-emerald-500 uppercase tracking-wider select-none pointer-events-none">
        🏆 Quick Wins (Low Difficulty, High Impact)
      </div>
      <div className="absolute top-2 right-6 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider select-none pointer-events-none">
        🎯 Strategic Plays (High Difficulty, High Impact)
      </div>
      <div className="absolute bottom-12 left-14 text-[10px] font-semibold text-slate-500 uppercase tracking-wider select-none pointer-events-none">
        🧸 Fill-Ins (Low Difficulty, Low Impact)
      </div>
      <div className="absolute bottom-12 right-6 text-[10px] font-semibold text-amber-500 uppercase tracking-wider select-none pointer-events-none">
        ⛰️ Major Projects (High Difficulty, Low Impact)
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 24, right: 20, bottom: 20, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis
            type="number"
            dataKey="difficulty"
            name="Difficulty"
            domain={[0, 10]}
            stroke={darkMode ? "#94a3b8" : "#64748b"}
            label={{ value: "← Easy — DIFFICULTY (1-10) — Hard →", position: "bottom", offset: 5, fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="impact"
            name="Impact"
            domain={[0, 10]}
            stroke={darkMode ? "#94a3b8" : "#64748b"}
            label={{ value: "← Low — ESTIMATED IMPACT (1-10) — High →", angle: -90, position: "insideLeft", offset: 10, fill: darkMode ? "#94a3b8" : "#64748b", fontSize: 11 }}
          />
          <ZAxis type="number" range={[150, 450]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={tooltipStyle} />
          <Scatter name="Recommendations" data={matrixData}>
            {matrixData.map((entry, index) => {
              // Color base on priority
              let color = "#f59e0b"; // Medium
              if (entry.priority === "High") color = "#4f46e5"; // High Indigo
              else if (entry.priority === "Low") color = "#0ea5e9"; // Low Blue/Cyan
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
