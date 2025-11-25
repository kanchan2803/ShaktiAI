// FilterChips.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * categories: array
 * selected: string
 * onSelect: fn
 */
export default function FilterChips({ categories = [], selected, onSelect }) {
  // color map (tailwind gradient parts)
  const colorMap = {
    "Laws & Amendments": "from-blue-500 to-indigo-600",
    "Court Rulings": "from-purple-500 to-pink-500",
    "Women’s Rights": "from-pink-500 to-rose-500",
    "Awareness & Education": "from-green-400 to-emerald-500",
    "Cyber & Digital Safety": "from-cyan-400 to-blue-500",
    "Government Policies": "from-yellow-400 to-orange-500",
    "Legal Reforms": "from-fuchsia-500 to-purple-600",
    "Environment & Human Rights": "from-lime-400 to-emerald-500",
    "Business & Corporate Law": "from-slate-400 to-slate-600",
    "Criminal Justice": "from-amber-400 to-amber-600",
    "Property & Taxation": "from-indigo-400 to-blue-500"
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((c) => {
        const is = c === selected;
        const grad = colorMap[c] || "from-blue-400 to-indigo-400";
        return (
          <motion.button
            key={c}
            onClick={() => onSelect(c)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${is ? `bg-gradient-to-r ${grad} text-white shadow-lg` : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700"}`}
          >
            {c}
          </motion.button>
        );
      })}
    </div>
  );
}
