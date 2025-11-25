// LoadingShimmer.jsx
import React from "react";

export default function LoadingShimmer() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 animate-pulse">
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-1/2"></div>
          <div className="mt-6 h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
