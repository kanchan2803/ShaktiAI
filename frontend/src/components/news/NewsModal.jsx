// src/components/news/NewsModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Globe, ExternalLink, Share2, AlertCircle } from "lucide-react";

export default function NewsModal({ item, onClose }) {
  if (!item) return null;

  // Format Date gracefully
  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary,
        url: item.source_url
      }).catch(console.error);
    } else {
      alert("Link copied to clipboard!");
      navigator.clipboard.writeText(item.source_url);
    }
  };

  // Safe fallback image if API image is missing or broken
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
          className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-white/10"
        >
            
            {/* --- 1. HERO IMAGE HEADER --- */}
            <div className="h-56 md:h-72 w-full relative flex-shrink-0 group">
                <img
                    src={item.image_url || FALLBACK_IMAGE}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => e.target.src = FALLBACK_IMAGE}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                {/* Floating Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:rotate-90"
                >
                    <X size={22} />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-indigo-600 rounded-full shadow-lg border border-indigo-400">
                            {item.category || "Update"}
                        </span>
                        <span className="text-xs font-medium text-slate-300 flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                             <Globe size={12} /> {item.source || "Shakti Network"}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight drop-shadow-lg line-clamp-3">
                        {item.title}
                    </h2>
                </div>
            </div>

            {/* --- 2. METADATA STRIP --- */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" />
                    <span className="font-medium">{formatDate(item.published_at)}</span>
                </div>
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold transition-colors hover:bg-indigo-50 dark:hover:bg-slate-700 px-3 py-1 rounded-lg"
                >
                    <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
                </button>
            </div>

            {/* --- 3. SCROLLABLE ARTICLE CONTENT --- */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">
                <div className="prose dark:prose-invert max-w-none">
                    
                    {/* Summary Block */}
                    <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-100 font-medium border-l-4 border-indigo-500 pl-4 mb-6 bg-indigo-50 dark:bg-indigo-900/20 py-2 rounded-r-lg">
                        {item.summary}
                    </p>
                    
                    {/* Main Content or Fallback */}
                    {item.content ? (
                        <div 
                            className="text-base leading-7 text-slate-600 dark:text-slate-300 space-y-4 font-normal"
                            dangerouslySetInnerHTML={{ __html: item.content }} 
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
                            <p className="text-slate-500 dark:text-slate-400 italic max-w-sm">
                                To read the full details of this legal update, please visit the official publisher's website below.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- 4. FOOTER ACTIONS --- */}
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4 flex-shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Close
                </button>
                
                {item.source_url && (
                    <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Read Full Article <ExternalLink size={18} />
                    </a>
                )}
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}