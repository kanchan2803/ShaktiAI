// EmptyState.jsx
import React from "react";
import { MotionConfig, motion } from "framer-motion";

export default function EmptyState({ query }) {
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-8 text-center border border-gray-100 dark:border-slate-700">
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none"><rect width="120" height="80" rx="12" fill="#E8F0FE" /></svg>
      </motion.div>
      <h3 className="mt-4 font-semibold">No updates found {query ? `for "${query}"` : ""}</h3>
      <p className="text-sm text-slate-500 mt-2">Try clearing filters or add a new update.</p>
    </div>
  );
}
