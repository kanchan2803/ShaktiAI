// NewsCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Clock, Bookmark, ExternalLink } from "lucide-react";

export default function NewsCard({ item, onOpen, bookmarked, onToggleBookmark }) {
  const categoryColors = {
    "Laws & Amendments": "from-blue-500 to-indigo-600",
    "Court Rulings": "from-purple-500 to-pink-500",
    "Women’s Rights": "from-pink-500 to-rose-500",
    "Cyber & Digital Safety": "from-cyan-400 to-blue-500",
    "Government Policies": "from-yellow-400 to-orange-500",
    "Awareness & Education": "from-green-400 to-emerald-500",
  };

  const gradient = categoryColors[item.category] || "from-slate-400 to-slate-600";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.12), 0 5px 10px rgba(0,0,0,0.06)",
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl p-5 border shadow-md transition-all duration-300
        bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800
        border-black/30 dark:border-slate-600
        hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] 
        dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
      `}
    >
      <div className="flex gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <svg
            className="w-6 h-6 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 4h16v4H4z"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-3">
            <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">
              {item.title}
            </h3>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onToggleBookmark}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <Bookmark
                  size={16}
                  className={
                    bookmarked
                      ? "text-yellow-400"
                      : "text-slate-500 dark:text-slate-300"
                  }
                />
              </button>
            </div>
          </div>

          <p
            className="text-sm text-slate-700 dark:text-slate-200 mt-2 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: item.summary }}
          />

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-300">
              <span
                className={`px-2 py-0.5 rounded-full text-white text-xs bg-gradient-to-r ${gradient} shadow-sm`}
              >
                {item.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />{" "}
                {new Date(item.published_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpen}
                className="text-sm px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-medium hover:scale-105 transition"
              >
                Read More
              </button>
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-yellow-400 transition"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
