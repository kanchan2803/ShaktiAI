// src/components/news/NewsCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Clock, Bookmark, ExternalLink, ChevronRight } from "lucide-react";

export default function NewsCard({ item, onOpen, bookmarked, onToggleBookmark }) {
  const categoryColors = {
    "Laws & Amendments": "bg-blue-100 text-blue-700",
    "Court Rulings": "bg-purple-100 text-purple-700",
    "Women’s Rights": "bg-pink-100 text-pink-700",
    "Cyber & Digital Safety": "bg-cyan-100 text-cyan-700",
    "Government Policies": "bg-amber-100 text-amber-700",
    "Awareness & Education": "bg-emerald-100 text-emerald-700",
    "Default": "bg-slate-100 text-slate-700"
  };

  const badgeClass = categoryColors[item.category] || categoryColors["Default"];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
    >
      {/* Optional Image Header */}
      {item.image_url && (
        <div className="h-40 w-full bg-gray-200 overflow-hidden relative">
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
             <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition text-slate-600 hover:text-pink-500"
            >
              <Bookmark size={16} className={bookmarked ? "fill-pink-500 text-pink-500" : ""} />
            </button>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header (Category + Date) */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
            {item.category || "General"}
          </span>
          {!item.image_url && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
              className="text-slate-400 hover:text-pink-500 transition"
            >
              <Bookmark size={18} className={bookmarked ? "fill-pink-500 text-pink-500" : ""} />
            </button>
          )}
        </div>

        {/* Title & Summary */}
        <h3 
          className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          onClick={onOpen}
        >
          {item.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 flex-1">
          {item.summary}
        </p>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
             <Clock size={12} />
             {new Date(item.published_at).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })}
          </div>
          
          <div className="flex gap-3">
             {item.source_url && (
               <a 
                 href={item.source_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-500 transition"
                 title="Source"
               >
                 <ExternalLink size={16} />
               </a>
             )}
             <button 
               onClick={onOpen}
               className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
             >
               Read <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}