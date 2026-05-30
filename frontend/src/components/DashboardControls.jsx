import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, FileText } from 'lucide-react';

const DashboardControls = ({ onRefresh }) => {
  const [seconds, setSeconds] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    setSeconds(30);
    if (onRefresh) onRefresh();
    
    // Simulate a brief loading state for UX
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [onRefresh]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          handleManualRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleManualRefresh]);

  // Calculate percentage for a visual countdown ring (optional flare)
  const progress = (seconds / 30) * 100;

  return (
    <div className="flex items-center gap-6 no-print bg-slate-900/40 p-2 pr-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
      {/* Timer Section */}
      <div className="flex items-center gap-3 pl-2">
        <div className="relative flex items-center justify-center w-10 h-10">
          {/* Background Circle */}
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="20" cy="20" r="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress Circle */}
            <circle
              cx="20" cy="20" r="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="113.1"
              strokeDashoffset={113.1 - (113.1 * progress) / 100}
              className="text-blue-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="text-[10px] font-mono font-bold text-blue-400 z-10">
            {seconds}s
          </span>
        </div>
        
        <div className="hidden sm:block">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter leading-none">
            Auto-Sync
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Live Intel Feed</p>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-slate-800" />

      {/* Actions Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleManualRefresh}
          className={`p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-all ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`}
          title="Force Refresh"
        >
          <RefreshCw size={16} />
        </button>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-950 px-4 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 shadow-lg shadow-blue-500/10"
        >
          <FileText size={14} />
          EXPORT REPORT
        </button>
      </div>
    </div>
  );
};

export default DashboardControls;