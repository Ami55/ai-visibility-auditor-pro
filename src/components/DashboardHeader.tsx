import React, { useState } from "react";
import { Sun, Moon, Share2, Printer, Search, History, Check, Globe, Compass } from "lucide-react";
import { AuditHistoryEntry } from "../types";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  history: AuditHistoryEntry[];
  currentId: string | null;
  onSelectHistory: (id: string) => void;
  onClearHistory: () => void;
  domainName: string | null;
  onOpenHowItWorks: () => void;
}

export default function DashboardHeader({
  darkMode,
  setDarkMode,
  history,
  currentId,
  onSelectHistory,
  onClearHistory,
  domainName,
  onOpenHowItWorks
}: HeaderProps) {
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const currentUrl = new URL(window.location.href);
    if (domainName) {
      currentUrl.searchParams.set("domain", domainName);
    }
    navigator.clipboard.writeText(currentUrl.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className={`border-b ${darkMode ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-white/85'} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 no-print`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo / Identity */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/10">
            <Globe className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className={`text-base font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              AI Visibility Auditor
            </h1>
            <p className={`text-[10px] font-mono tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Enterprise AI SEO Core • v1.1
            </p>
          </div>
          {domainName && (
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono ml-4 ${
              darkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-100 border-slate-200'
            }`}>
              <span className="text-slate-500 font-semibold uppercase">Target:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{domainName}</span>
            </div>
          )}
        </div>

        {/* Action toolbar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* How It Works Guide button */}
          <button
            id="how-it-works-btn"
            onClick={onOpenHowItWorks}
            className={`p-2 px-2.5 rounded-lg border text-sm flex items-center space-x-1.5 transition-all cursor-pointer ${
              darkMode 
                ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' 
                : 'border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="Learn how AI Visibility Auditor works"
          >
            <Compass className="h-4 w-4 text-indigo-500" />
            <span className="font-medium text-xs">How It Works</span>
          </button>

          {/* History Dropdown */}
          {history.length > 0 && (
            <div className="relative">
              <button
                id="history-btn"
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                className={`p-2 rounded-lg border text-sm flex items-center space-x-1.5 transition-all ${
                  darkMode 
                    ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title="View Audit History"
              >
                <History className="h-4 w-4" />
                <span className="hidden md:inline font-medium">History ({history.length})</span>
              </button>
              
              {showHistoryDropdown && (
                <div className={`absolute right-0 mt-2 w-72 rounded-xl border p-2 shadow-2xl z-50 ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-200' 
                    : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-inherit mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Scans</span>
                    <button 
                      onClick={() => {
                        onClearHistory();
                        setShowHistoryDropdown(false);
                      }}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {history.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => {
                          onSelectHistory(entry.id);
                          setShowHistoryDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          currentId === entry.id
                            ? (darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                            : (darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700')
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold truncate">{entry.domain}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(entry.scannedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className={`px-1.5 py-0.5 rounded-sm font-bold font-mono text-[10px] ${
                            entry.overallScore >= 80 
                              ? 'bg-indigo-500/10 text-indigo-400' 
                              : entry.overallScore >= 60 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            Score: {entry.overallScore}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Share Links button */}
          {domainName && (
            <button
              id="share-btn"
              onClick={handleCopyLink}
              className={`p-2 rounded-lg border text-sm flex items-center space-x-1.5 transition-all cursor-pointer ${
                darkMode 
                  ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="Shareable Report Link"
            >
              {copiedLink ? <Check className="h-4 w-4 text-indigo-500 animate-scale" /> : <Share2 className="h-4 w-4" />}
              <span className="hidden md:inline font-medium">{copiedLink ? "Copied!" : "Share Link"}</span>
            </button>
          )}

          {/* PDF Export / print button */}
          {domainName && (
            <button
              id="print-btn"
              onClick={handlePrint}
              className={`p-2 rounded-lg border text-sm flex items-center space-x-1.5 transition-all cursor-pointer ${
                darkMode 
                  ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title="Export Report to PDF (or Print)"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden md:inline font-medium">Export Report</span>
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            id="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              darkMode 
                ? 'border-slate-800 bg-slate-800/40 text-amber-400 hover:bg-slate-800 hover:text-amber-300' 
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
