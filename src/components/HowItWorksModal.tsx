import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Search, 
  Cpu, 
  Network, 
  Layers, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Database,
  Compass,
  Zap,
  Globe
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function HowItWorksModal({ isOpen, onClose, darkMode }: HowItWorksModalProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "geo_vs_seo" | "modules" | "scoring">("pipeline");

  if (!isOpen) return null;

  const pipelineSteps = [
    {
      step: "01",
      title: "Target & Entity Discovery",
      icon: Search,
      badge: "Real-time Discovery",
      description: "Our crawler scans your target domain, extracting core brand entities, digital profiles, Wikidata linkages, Knowledge Graph identifiers, and schema markup structures across your key digital footprint.",
      details: ["Schema.org JSON-LD parsing", "Wikidata & Knowledge Panel lookup", "Official social & press entity resolution"]
    },
    {
      step: "02",
      title: "Live LLM & Search Grounding",
      icon: Database,
      badge: "Gemini Grounding",
      description: "Using Gemini and live web grounding, we evaluate discoverable signals that can influence whether answer engines understand, cite, and recommend your brand.",
      details: ["Active web search cache interrogation", "Citation frequency & source verification", "Hallucination & sentiment risk analysis"]
    },
    {
      step: "03",
      title: "E-E-A-T & Authority Verification",
      icon: ShieldCheck,
      badge: "Trust Engine",
      description: "We evaluate real-world authority signals: independent review aggregators (Trustpilot, G2, BBB), expert author credentials, press mentions, and brand co-occurrences that LLMs weight during answer synthesis.",
      details: ["Independent platform consensus", "Author entity validation", "Backlink & PR authority footprint"]
    },
    {
      step: "04",
      title: "Multi-Dimensional 7-Module Scoring",
      icon: Layers,
      badge: "Diagnostic Matrix",
      description: "Every audit calculates a deterministic 0–100 score across 7 mission-critical generative search dimensions, benchmarking your readiness against direct industry competitors.",
      details: ["Bot accessibility & crawler permissions", "Entity clarity & disambiguation", "Direct competitor gap analysis"]
    },
    {
      step: "05",
      title: "Prioritized ROI Action Roadmap",
      icon: TrendingUp,
      badge: "Executable Strategy",
      description: "The engine synthesizes a practical, prioritized remediation roadmap with estimated score gain projections (+5 to +15 pts), difficulty ratings, and copy-paste code snippets for immediate implementation.",
      details: ["High / Medium / Low priority sorting", "Ready-to-use JSON-LD schema snippets", "Robots.txt & llms.txt directives"]
    }
  ];

  const modulesList = [
    { id: 1, name: "AI Crawlers & Robots Access", desc: "Verifies GPTBot, Google-Extended, PerplexityBot, and ClaudeBot permissions." },
    { id: 2, name: "Schema & Structured Data", desc: "Inspects JSON-LD Organization, Product, FAQ, and Article entity markup." },
    { id: 3, name: "Brand & Entity Authority", desc: "Checks Wikidata IDs, Knowledge Panels, and disambiguated knowledge graph presence." },
    { id: 4, name: "Brand Mentions & Citations", desc: "Calculates digital footprint across authoritative third-party review sites & media." },
    { id: 5, name: "E-E-A-T Signal Strength", desc: "Audits author bios, verified reviews, certifications, and trustworthiness factors." },
    { id: 6, name: "Content Citability & Structure", desc: "Evaluates factual density, direct Q&A phrasing, bulleted summaries, and table data." },
    { id: 7, name: "Competitor Comparison Gap", desc: "Benchmarks your brand vs direct market competitors across generative answer share." }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in no-print">
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between shrink-0 ${
          darkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/75"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display tracking-tight">
                  How AI Visibility Auditor Works
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase">
                  GEO Methodology
                </span>
              </div>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Generative Engine Optimization (GEO) architecture & evaluation framework
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              darkMode ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-6 pt-3 border-b flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0 ${
          darkMode ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white"
        }`}>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "pipeline" 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            1. 5-Step Audit Pipeline
          </button>
          <button
            onClick={() => setActiveTab("geo_vs_seo")}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "geo_vs_seo" 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            2. GEO vs Traditional SEO
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "modules" 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            3. The 7 Audit Modules
          </button>
          <button
            onClick={() => setActiveTab("scoring")}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "scoring" 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            4. Scoring & Action Plan
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: PIPELINE */}
          {activeTab === "pipeline" && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-emerald-950"
              }`}>
                <h3 className="font-bold text-sm mb-2">How to run your audit</h3>
                <ol className="space-y-1.5 leading-relaxed list-decimal pl-4">
                  <li>Enter the website domain, brand name, industry and primary country.</li>
                  <li>Add up to three competitor domains, separated by commas, for comparison.</li>
                  <li>Select <strong>Analyze AI Visibility</strong> and keep this page open while the live scan completes.</li>
                  <li>Review the Executive Summary first, then examine the modules, competitor gaps and roadmap tabs.</li>
                  <li>Prioritize high-impact roadmap items, implement them, and rerun the audit to track progress.</li>
                  <li>Use Print in the header to save or share the finished report as a PDF.</li>
                </ol>
                <p className="mt-3 text-[11px] opacity-80">
                  Results are an AI-assisted diagnostic based on discoverable web signals. Confirm important findings manually before making business or technical decisions.
                </p>
              </div>
              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-indigo-950/20 border-indigo-500/20 text-indigo-200" : "bg-indigo-50/70 border-indigo-200 text-indigo-900"
              }`}>
                <p className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-indigo-500" />
                  Real-time Grounded Analysis Engine
                </p>
                <p className="leading-relaxed opacity-90">
                  When you initiate an audit, the backend performs a multi-stage analysis of available web signals, entity clarity, AI crawler accessibility, content structure, authority indicators and potential citation readiness.
                </p>
              </div>

              <div className="space-y-3 mt-4">
                {pipelineSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        darkMode ? "bg-slate-950/40 border-slate-800/80 hover:border-slate-700" : "bg-slate-50/60 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 font-mono font-bold text-xs border border-indigo-500/20">
                          {step.step}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StepIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              <h4 className="font-bold text-sm">{step.title}</h4>
                            </div>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {step.badge}
                            </span>
                          </div>
                          <p className={`leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                            {step.description}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {step.details.map((d, dIdx) => (
                              <span 
                                key={dIdx} 
                                className={`text-[10px] px-2 py-0.5 rounded-md border font-mono flex items-center gap-1 ${
                                  darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-600"
                                }`}
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 text-indigo-500" />
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GEO VS SEO */}
          {activeTab === "geo_vs_seo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traditional SEO */}
                <div className={`p-5 rounded-xl border space-y-3 ${
                  darkMode ? "bg-slate-950/40 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}>
                  <div className="flex items-center gap-2 border-b border-inherit pb-2">
                    <span className="text-base">🔍</span>
                    <div>
                      <h4 className="font-bold text-sm">Traditional SEO (10 Blue Links)</h4>
                      <p className="text-[11px] text-slate-400">Google / Bing Web Search Era</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span><strong>Ranking Mechanism:</strong> Position 1–10 on SERP based on keywords, backlinks, and domain authority.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span><strong>User Goal:</strong> Click-through rate (CTR) to visit your website URL directly.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span><strong>Content Focus:</strong> Keyword density, meta tags, H1/H2 structure, and anchor text links.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span><strong>Output:</strong> A list of links where the user browses and reads each page individually.</span>
                    </li>
                  </ul>
                </div>

                {/* Generative Engine Optimization */}
                <div className={`p-5 rounded-xl border border-indigo-500/30 space-y-3 ${
                  darkMode ? "bg-indigo-950/20 text-slate-200" : "bg-indigo-50/50 text-indigo-950"
                }`}>
                  <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <div>
                      <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">GEO: Generative Engine Optimization</h4>
                      <p className="text-[11px] text-slate-400">ChatGPT, Perplexity, Gemini, Copilot Era</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>Ranking Mechanism:</strong> Inclusion in direct AI synthesized answers as a primary source citation and top recommendation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>User Goal:</strong> Immediate conversational answer where AI recommends your brand with direct attribution.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>Content Focus:</strong> Disambiguated schema entities, Wikidata IDs, factual bullet points, verified third-party reviews, and bot permissions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span><strong>Output:</strong> Direct brand endorsement, citation footnotes, and conversational follow-up triggers.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* GEO Key Takeaways */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <h5 className="font-bold text-xs uppercase font-mono tracking-wider mb-2 text-indigo-600 dark:text-indigo-400">
                  Why GEO is Vital for Your Business
                </h5>
                <p className={`leading-relaxed text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Over 40% of search queries are now shifting into AI Overviews, Perplexity answers, and LLM search agents. If AI models cannot verify your entity relationships or crawl your domain via GPTBot/PerplexityBot, your brand is effectively invisible in modern answer engines.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MODULES */}
          {activeTab === "modules" && (
            <div className="space-y-3">
              <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Our system evaluates your site across 7 distinct analytical dimensions. Each module contributes to your weighted composite score:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modulesList.map((m) => (
                  <div 
                    key={m.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-500 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      0{m.id}
                    </span>
                    <div>
                      <h5 className="font-bold text-xs">{m.name}</h5>
                      <p className={`text-[11px] mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCORING & ROADMAP */}
          {activeTab === "scoring" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-xl border text-center ${
                  darkMode ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-900"
                }`}>
                  <div className="text-2xl font-black font-mono">85–100</div>
                  <div className="font-bold text-xs mt-1">Grade A (Excellent)</div>
                  <p className="text-[10px] opacity-80 mt-1">Prime citation readiness & high LLM presence</p>
                </div>
                <div className={`p-3.5 rounded-xl border text-center ${
                  darkMode ? "bg-blue-500/10 border-blue-500/20 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-900"
                }`}>
                  <div className="text-2xl font-black font-mono">70–84</div>
                  <div className="font-bold text-xs mt-1">Grade B (Strong)</div>
                  <p className="text-[10px] opacity-80 mt-1">Good authority with minor structured data gaps</p>
                </div>
                <div className={`p-3.5 rounded-xl border text-center ${
                  darkMode ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-900"
                }`}>
                  <div className="text-2xl font-black font-mono">50–69</div>
                  <div className="font-bold text-xs mt-1">Grade C (Average)</div>
                  <p className="text-[10px] opacity-80 mt-1">Vulnerable to competitor displacement</p>
                </div>
                <div className={`p-3.5 rounded-xl border text-center ${
                  darkMode ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-900"
                }`}>
                  <div className="text-2xl font-black font-mono">&lt; 50</div>
                  <div className="font-bold text-xs mt-1">Grade D (Needs Action)</div>
                  <p className="text-[10px] opacity-80 mt-1">Blocked crawlers or missing entity anchors</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${
                darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <h5 className="font-bold text-xs flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  How to Use the Implementation Roadmap
                </h5>
                <p className={`leading-relaxed text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Every recommendation in the Roadmap tab is ranked by <strong>Impact (Estimated Point Gain)</strong> and <strong>Implementation Difficulty</strong>. We provide instant code snippets (e.g. JSON-LD, Robots.txt, meta tags) that your engineering or SEO team can deploy directly to boost your LLM citation visibility.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
          darkMode ? "border-slate-800 bg-slate-950/80" : "border-slate-100 bg-slate-50"
        }`}>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>AI Visibility Auditor • Developed by Ami - SEO Girl</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 cursor-pointer transition-colors"
            >
              Got it, Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
