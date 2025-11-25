// LegalUpdatesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import TypingHeader from "../components/news/TypingHeader";
import SearchBar from "../components/news/SearchBar";
import FilterChips from "../components/news/FilterChips";
import NewsCard from "../components/news/NewsCard";
import LoadingShimmer from "../components/news/LoadingShimmer";
import EmptyState from "../components/news/EmptyState";
import NewsModal from "../components/news/NewsModal";
import HelplinesFooter from "../components/helplines/HelplinesFooter";
import { sampleNews } from "../data/sampleNews";
import { useLocalStorage } from "../services/useLocalStorage";
import { Plus, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * LegalUpdatesPage
 * Frontend-only. Uses sampleNews as default. Filter, search, bookmark localStorage.
 */
export default function LegalUpdatesPage() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null); // for modal
  const [bookmarks, setBookmarks] = useLocalStorage("bookmarks", {}); // store id->true
  const [dark, setDark] = useLocalStorage("ui_dark", false);

  // simulate load
  useEffect(() => {
    setData(null);
    const t = setTimeout(() => setData(sampleNews), 600); // small delay for shimmer
    return () => clearTimeout(t);
  }, []);

  // categories
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    (sampleNews || []).forEach((n) => set.add(n.category || "Uncategorized"));
    return Array.from(set);
  }, []);

  // filter + search (client-side)
  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.filter((n) => {
      const matchesQ =
        !q ||
        (n.title || "").toLowerCase().includes(q) ||
        (n.summary || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q) ||
        (n.tags || "").toLowerCase().includes(q);
      const matchesCat = category === "All" || (n.category || "") === category;
      return matchesQ && matchesCat;
    });
  }, [data, query, category]);

  function toggleBookmark(id) {
    setBookmarks((prev) => {
      const copy = { ...(prev || {}) };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  }

  // keyboard shortcut to toggle dark
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-slate-900 text-slate-100"
          : "bg-gradient-to-b from-blue-50 to-white text-slate-900"
      }`}
    >
      {/* --- Hero Section (same as Helpline gradient) --- */}
      <header className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#60A5FA] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                  <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    Latest <span className="text-yellow-300">Legal Updates ⚖️</span>
                  </h1>
                  <p className="mt-4 text-lg text-blue-100">
                    Laws • Court Rulings • Women’s Rights • Digital Safety • Government Policies
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDark((d) => !d)}
                    className="p-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md hover:scale-105 transition"
                    aria-label="Toggle theme"
                  >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                  </button>

                  <Link to="/add-update" title="Add update (admin)">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-yellow-200/40"
                    >
                      <Plus size={16} /> Add Update
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <SearchBar
                query={query}
                setQuery={setQuery}
                placeholder="Search updates, acts, judgments..."
              />
            </div>

            <div className="mb-6">
              <FilterChips
                categories={categories}
                selected={category}
                onSelect={setCategory}
              />
            </div>

            {/* Content */}
            {!data && <LoadingShimmer />}

            {data && filtered.length === 0 && <EmptyState query={query} />}

            {data && filtered.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filtered.map((item, idx) => (
                  <NewsCard
                    key={item.id || idx}
                    item={item}
                    onOpen={() => setSelected(item)}
                    bookmarked={!!bookmarks[item.id]}
                    onToggleBookmark={() => toggleBookmark(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start">
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-white/10">
              <h4 className="text-sm font-semibold mb-3 text-slate-800 dark:text-slate-100">
                Quick Filters
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCategory("All")}
                  className="text-sm text-left w-full px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                >
                  All
                </button>
                {categories.slice(1).slice(0, 8).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className="text-sm text-left w-full px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="mt-5 border-t border-gray-200 dark:border-slate-600 pt-4 text-sm text-slate-700 dark:text-slate-300">
                <strong>Bookmarks</strong>
                <div className="mt-2">
                  {Object.keys(bookmarks || {}).length === 0 ? (
                    <div className="text-xs text-slate-400">
                      No bookmarks yet
                    </div>
                  ) : (
                    Object.keys(bookmarks).map((id) => {
                      const it = (sampleNews || []).find((s) => s.id === id);
                      if (!it) return null;
                      return (
                        <div key={id} className="text-xs py-1">
                          • {it.title.slice(0, 40)}...
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-white/60 dark:from-slate-800 dark:to-slate-900 border border-gray-100 dark:border-slate-700 shadow-md">
              <h5 className="font-semibold mb-3 text-slate-800 dark:text-slate-100">
                Glossary (preview)
              </h5>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>
                  <strong>Amendment:</strong> Change to existing law.
                </li>
                <li>
                  <strong>Judgment:</strong> Court ruling on a case.
                </li>
                <li>
                  <strong>Petition:</strong> A submitted legal request.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {selected && (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      )}
      <HelplinesFooter />
    </div>
  );
}




// previous code fetching GAC- GOOGLE SHEET
// // frontend/src/pages/LegalUpdatesPage.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { fetchNews } from "../api/gasApi";
// import TypingHeader from "../components/news/TypingHeader";
// import SearchBar from "../components/news/SearchBar";
// import NewsCard from "../components/news/NewsCard";
// import LoadingShimmer from "../components/news/LoadingShimmer";
// import AddUpdateModal from "../components/news/AddUpdateModal";

// // You can comment FilterChips if not ready
// // import FilterChips from "../components/news/FilterChips";

// export default function LegalUpdatesPage() {
//   const [news, setNews] = useState(null);
//   const [query, setQuery] = useState("");
//   const [category, setCategory] = useState("All");
//   const [showAdd, setShowAdd] = useState(false);

//   async function load() {
//     setNews(null);
//     try {
//       const data = await fetchNews();
//       console.log("Fetched data:", data);
//       setNews(data);
//     } catch (e) {
//       console.error("Error fetching data:", e);
//       setNews([]);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   const categories = useMemo(() => {
//     const set = new Set(["All"]);
//     (news || []).forEach((n) => set.add(n.category || "Uncategorized"));
//     return Array.from(set);
//   }, [news]);

//   const filtered = useMemo(() => {
//     if (!news) return [];
//     const q = query.trim().toLowerCase();
//     return news.filter((n) => {
//       const matchesQ =
//         !q ||
//         (n.title || "").toLowerCase().includes(q) ||
//         (n.summary || "").toLowerCase().includes(q) ||
//         (n.content || "").toLowerCase().includes(q) ||
//         (n.tags || "").toLowerCase().includes(q);
//       const matchesCat = category === "All" || (n.category || "") === category;
//       return matchesQ && matchesCat;
//     });
//   }, [news, query, category]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
//       <div className="max-w-6xl mx-auto relative z-10">
//         {/* Header + Button */}
//         <div className="flex items-center justify-between mb-6">
//           <TypingHeader text="Verified Legal & Government Updates (Curated)" />
//           <button
//             onClick={() => setShowAdd(true)}
//             className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:scale-105 transition-transform"
//           >
//             Add Update
//           </button>
//         </div>

//         {/* Search */}
//         <SearchBar
//           query={query}
//           setQuery={setQuery}
//           placeholder="Search updates, acts, judgments..."
//         />

//         {/* Categories (optional if you have FilterChips ready) */}
//         {/* <div className="mt-6">
//           <FilterChips
//             categories={categories}
//             selected={category}
//             onSelect={setCategory}
//           />
//         </div> */}

//         {/* Content */}
//         {!news && <LoadingShimmer />}

//         {news && filtered.length === 0 && (
//           <div className="text-center py-16 text-gray-500">
//             No updates found yet.
//           </div>
//         )}

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//           {filtered.map((item) => (
//             <NewsCard key={item.id || item.title} item={item} />
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {showAdd && (
//         <AddUpdateModal
//           onClose={() => setShowAdd(false)}
//           onSaved={() => {
//             setShowAdd(false);
//             load();
//           }}
//         />
//       )}
//     </div>
//   );
// }
