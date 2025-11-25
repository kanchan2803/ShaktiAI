// SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar({ query, setQuery, placeholder = "Search..." }) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-3 border border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          aria-label="Search updates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {query && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setQuery("")} className="text-sm text-indigo-600">Clear</motion.button>
        )}
      </div>
    </div>
  );
}
