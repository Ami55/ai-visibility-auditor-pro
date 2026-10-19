import React, { useState } from "react";
import { Search, Globe, Shield, Sparkles, AlertTriangle, ListFilter, RotateCcw } from "lucide-react";

interface AuditFormProps {
  darkMode: boolean;
  onSubmit: (formData: {
    domain: string;
    brandName: string;
    competitors: string;
    industry: string;
    country: string;
  }) => void;
  isLoading: boolean;
  error: string | null;
}

const PRESETS = [
  { domain: "example.com", brandName: "Example Travel", competitors: "competitor-one.example, competitor-two.example", industry: "Travel & Tours", country: "United States" },
  { domain: "figma.com", brandName: "Figma", competitors: "canva.com, sketch.com", industry: "SaaS Design Tools", country: "Global" },
  { domain: "notion.so", brandName: "Notion", competitors: "asana.com, monday.com", industry: "Productivity", country: "Global" }
];

export default function AuditForm({ darkMode, onSubmit, isLoading, error }: AuditFormProps) {
  const [domain, setDomain] = useState("");
  const [brandName, setBrandName] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // States for simulating analysis logs during load
  const [scanningIndex, setScanningIndex] = useState(0);
  const loadingSteps = [
    "Establishing endpoint connection with GenAI standard server...",
    "Evaluating entity and visibility signals...",
    "Running search-grounded index query for Wikidata signals...",
    "Scanning crawl bot accessibility (robots.txt, LLM crawler rules)...",
    "Parsing metadata structure & organization schemas (JSON-LD)...",
    "Analyzing competitor positioning index scores...",
    "Computing AI citation and retrieval suitability indicators...",
    "Compiling Weighted Overall scorecard values..."
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setScanningIndex(0);
      interval = setInterval(() => {
        setScanningIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : 0));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    onSubmit({
      domain: domain.trim(),
      brandName: brandName.trim(),
      competitors: competitors.trim(),
      industry: industry.trim(),
      country: country.trim()
    });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setDomain(preset.domain);
    setBrandName(preset.brandName);
    setCompetitors(preset.competitors);
    setIndustry(preset.industry);
    setCountry(preset.country);
  };

  const clearForm = () => {
    setDomain("");
    setBrandName("");
    setCompetitors("");
    setIndustry("");
    setCountry("");
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      darkMode 
        ? "bg-slate-900/40 border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" 
        : "bg-white border-slate-200 shadow-[0_4px_24px_rgba(148,163,184,0.06)]"
    }`} id="audit-form-container">
      
      {!isLoading ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-inherit">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <h2 className={`font-display font-bold text-lg ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                Initialize AI Visibility Audit
              </h2>
            </div>
            <button
              type="button"
              onClick={clearForm}
              className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 text-xs flex items-center gap-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              title="Clear Values"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Preset Buttons helper */}
          <div className="space-y-1.5">
            <label className={`text-[11px] font-mono uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    darkMode 
                      ? "bg-slate-800/50 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 text-slate-300" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {p.brandName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Domain Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="domain" className="block text-xs font-bold text-inherit">
                Domain URL (Required) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  id="domain"
                  required
                  placeholder="e.g., example.com"
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode 
                      ? "bg-slate-800/40 border-slate-700/60 text-white focus:border-indigo-500 focus:bg-slate-800/80" 
                      : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-505"
                  }`}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>
            </div>

            {/* Optional Brand Name */}
            <div className="space-y-1.5">
              <label htmlFor="brandName" className="block text-xs font-semibold text-inherit">
                Brand / Company Name (Optional)
              </label>
              <input
                type="text"
                id="brandName"
                placeholder="e.g., Example Travel"
                className={`block w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                  darkMode 
                    ? "bg-slate-800/40 border-slate-700/60 text-white focus:border-indigo-500" 
                    : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            {/* Optional Competitor Domains */}
            <div className="space-y-1.5">
              <label htmlFor="competitors" className="block text-xs font-semibold text-inherit">
                Competitor Domains (Optional, comma-separated)
              </label>
              <input
                type="text"
                id="competitors"
                placeholder="e.g., viator.com, getyourguide.com"
                className={`block w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                  darkMode 
                    ? "bg-slate-800/40 border-slate-700/60 text-white focus:border-indigo-500" 
                    : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }`}
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`text-xs font-semibold flex items-center space-x-1 hover:underline cursor-pointer ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <ListFilter className="h-3 w-3 text-indigo-500" />
              <span>{showAdvanced ? "Hide Context Parameters" : "Edit Industry & Target Location (Optional)"}</span>
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 animate-fade-in">
                {/* Optional Industry */}
                <div className="space-y-1.5">
                  <label htmlFor="industry" className="block text-xs font-semibold text-inherit">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    id="industry"
                    placeholder="e.g., Travel, Design Tools, Fintech"
                    className={`block w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? "bg-slate-800/40 border-slate-700/60 text-white focus:border-indigo-500" 
                        : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>

                {/* Optional Country */}
                <div className="space-y-1.5">
                  <label htmlFor="country" className="block text-xs font-semibold text-inherit">
                    Target Location / Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    placeholder="e.g., United States, United Kingdom, Global"
                    className={`block w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? "bg-slate-800/40 border-slate-700/60 text-white focus:border-indigo-500" 
                        : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-2 text-red-400 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Execution Warning</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              id="submit-audit-btn"
              type="submit"
              disabled={isLoading || !domain}
              className={`w-full py-3 px-4 rounded-xl font-display font-semibold text-white tracking-wide shadow-lg flex items-center justify-center space-x-2 transition-all ${
                domain 
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10 active:scale-98 cursor-pointer" 
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Analyze AI Visibility Index</span>
            </button>
          </div>
        </form>
      ) : (
        /* LOADING ANIMATIONS & SIMULATED STEPS LOGS */
        <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in" id="loading-stage">
          {/* Pulsing multi-colored loader */}
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-slate-700/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-indigo-400 border-b-indigo-800 rounded-full animate-spin"></div>
            <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className={`font-display font-semibold text-base ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
              Auditing Brand Citation Suitability...
            </h3>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              This may take up to 10 seconds. We are executing deep web search scans and computing entity graphs for <span className="font-mono text-indigo-400 font-bold">{domain}</span> inside the live AI indexes.
            </p>
          </div>

          {/* Interactive Logs Window */}
          <div className={`w-full max-w-lg p-3 rounded-xl border text-left font-mono text-[11px] h-28 flex flex-col justify-end space-y-1.5 shadow-inner ${
            darkMode ? "bg-black/45 border-slate-800/80 text-indigo-400" : "bg-slate-900 text-slate-200 border-slate-900"
          }`}>
            <div className="opacity-40 select-none pb-1 border-b border-white/5 flex justify-between items-center text-[9px] uppercase tracking-wider">
              <span>System Telemetry console</span>
              <span className="animate-ping h-1.5 w-1.5 bg-indigo-400 rounded-full"></span>
            </div>
            
            <div className="space-y-1 overflow-hidden">
              {loadingSteps.slice(Math.max(0, scanningIndex - 2), scanningIndex + 1).map((step, idx) => (
                <div key={idx} className={`truncate flex items-center gap-1.5 ${idx === Math.min(2, scanningIndex) ? "text-indigo-400 opacity-100" : "opacity-35"}`}>
                  <span>{idx === Math.min(2, scanningIndex) ? "⚡" : "✓"}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust warning section in page bottom */}
      <div className={`mt-4 pt-3 border-t border-inherit flex items-start gap-2.5 text-[10px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        <Shield className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
        <p>
          Enterprise Grade Security: All analysis is secured server-side. No API keys or custom identifiers are indexable in browser trackers.
        </p>
      </div>

    </div>
  );
}
