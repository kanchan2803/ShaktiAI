// src/pages/LegalUpdatesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAllNews, fetchRealNews } from "../services/newsApi";
import { sampleNews } from "../data/sampleNews";
import { 
  Plus, Moon, Sun, Search, TrendingUp, BookOpen, 
  Filter, ChevronRight, Bookmark 
} from "lucide-react";
import NewsCard from "../components/news/NewsCard";
import NewsModal from "../components/news/NewsModal";
import LoadingShimmer from "../components/news/LoadingShimmer";
import EmptyState from "../components/news/EmptyState";
import HelplinesFooter from "../components/helplines/HelplinesFooter";
import { useLocalStorage } from "../services/useLocalStorage";

export default function LegalUpdatesPage() {
  const [data, setData] = useState(null); // Stores current view data
  const [allLoadedData, setAllLoadedData] = useState([]); // Stores EVERYTHING (for bookmarks lookup)
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [bookmarks, setBookmarks] = useLocalStorage("bookmarks", {});
  const [dark, setDark] = useLocalStorage("ui_dark", false);

  const categories = [
    "All",
    "Laws & Amendments", 
    "Court Rulings", 
    "Women's Rights", 
    "Cyber & Digital Safety", 
    "Government Policies"
  ];

  // 1. Fetch Data whenever Category changes
  useEffect(() => {
    const loadNews = async () => {
      setData(null); // Show loading state
      try {
        // Fetch specific category from GNews
        const realTimeNews = await fetchRealNews(category); 
        
        // Fetch user updates (always same)
        const dbNews = await fetchAllNews();
        
        // Combine them
        let combined = [...dbNews, ...realTimeNews];
        
        // If API fails or returns nothing, fallback to samples ONLY if it's "All"
        // (Otherwise keep empty to show "No results")
        if (combined.length === 0 && category === "All") {
            combined = sampleNews;
        }

        setData(combined);
        
        // Keep a history of all loaded items so bookmarks sidebar doesn't break
        setAllLoadedData(prev => {
            const newItems = combined.filter(n => !prev.find(p => p.id === n.id));
            return [...prev, ...newItems, ...sampleNews];
        });

      } catch (err) {
        console.error("Failed to load news", err);
        setData(sampleNews); 
      }
    };

    loadNews();
  }, [category]); // <--- FIX: Re-run when category changes

  // 2. Client-side Search Filtering
  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    
    return data.filter((n) => {
      const matchesQ = !q || n.title?.toLowerCase().includes(q) || n.summary?.toLowerCase().includes(q);
      // We rely on the API to handle category filtering now, but we double check tags
      // or simply pass everything returned by the API for that category.
      return matchesQ;
    });
  }, [data, query]);

  const featuredItem = filtered.length > 0 ? filtered[0] : null;
  const listItems = filtered.length > 0 ? filtered.slice(1) : [];

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  };

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* HERO HEADER */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white pb-32 pt-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob"/>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full mix-blend-overlay filter blur-[80px] opacity-20 animate-blob animation-delay-2000"/>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-blue-100 mb-4 backdrop-blur-md">
                <TrendingUp size={14} className="text-yellow-400" />
                <span>Live Updates • GNews Integrated</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">News & Rights</span>
              </h1>
              <p className="mt-4 text-lg text-blue-100/80 max-w-2xl">
                Real-time reporting on courts, laws, and women's safety policies in India.
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
               <button onClick={() => setDark(!dark)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all">
                  {dark ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <Link to="/add-update" className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-indigo-900 font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                  <Plus size={18} /> <span className="hidden sm:inline">Add Update</span>
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        
        {/* Search Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-2 flex items-center gap-2 border border-slate-100 dark:border-slate-700 mb-10"
        >
          <div className="p-3 text-slate-400"><Search size={22} /></div>
          <input 
            type="text" 
            placeholder="Search news..." 
            className="flex-1 bg-transparent outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: News Grid */}
          <div className="lg:col-span-8 space-y-8">
            {!data ? <LoadingShimmer /> : featuredItem && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 onClick={() => setSelected(featuredItem)}
                 className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-2xl transition-all duration-300"
               >
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent z-10"/>
                 <div className={`h-64 w-full bg-gradient-to-br ${featuredItem.image_url ? '' : 'from-blue-600 to-purple-600'} bg-cover bg-center`}
                      style={{ backgroundImage: featuredItem.image_url ? `url(${featuredItem.image_url})` : undefined }}>
                 </div>
                 
                 <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3">
                      Featured • {featuredItem.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                      {featuredItem.title}
                    </h2>
                    <p className="text-slate-200 text-sm md:text-base line-clamp-2 mb-4">{featuredItem.summary}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <span>{new Date(featuredItem.published_at).toDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">Read Full Update <ChevronRight size={14}/></span>
                    </div>
                 </div>
               </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
               {listItems.length > 0 ? (
                 listItems.map((item) => (
                   <NewsCard 
                     key={item.id} 
                     item={item} 
                     onOpen={() => setSelected(item)}
                     bookmarked={!!bookmarks[item.id]}
                     onToggleBookmark={() => toggleBookmark(item.id)}
                   />
                 ))
               ) : (
                 data && <div className="col-span-2"><EmptyState query={query}/></div>
               )}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Category Filter */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24 z-10">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                 <Filter size={18} className="text-indigo-500"/> Filter by Topic
               </h3>
               <div className="flex flex-wrap gap-2">
                 {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setCategory(cat)}
                     className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
                       category === cat 
                         ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700" 
                         : "bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100"
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            {/* Bookmarks Widget */}
            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Bookmark size={18} className="text-pink-500"/> Your Bookmarks
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {Object.keys(bookmarks).length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No bookmarks yet.</p>
                ) : (
                  Object.keys(bookmarks).map(id => {
                     // FIX: Search in allLoadedData to find the item
                     const item = allLoadedData.find(n => n.id === id);
                     if(!item) return null;
                     return (
                       <div key={id} onClick={() => setSelected(item)} className="cursor-pointer group border-b border-indigo-50 dark:border-slate-700 last:border-0 pb-2 mb-2">
                          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(item.published_at).toLocaleDateString()}</p>
                       </div>
                     )
                  })
                )}
              </div>
            </div>

            {/* Glossary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                 <BookOpen size={18} className="text-emerald-500"/> Quick Terms
               </h3>
               <ul className="space-y-3 text-sm">
                 <li className="flex gap-2">
                   <span className="font-semibold text-slate-700 dark:text-slate-300">IPC/BNS:</span>
                   <span className="text-slate-500">Indian Penal Code / Bharatiya Nyaya Sanhita.</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="font-semibold text-slate-700 dark:text-slate-300">Zero FIR:</span>
                   <span className="text-slate-500">File FIR at any station regardless of location.</span>
                 </li>
               </ul>
            </div>
          </aside>
        </div>
      </div>

      {selected && <NewsModal item={selected} onClose={() => setSelected(null)} />}
      <HelplinesFooter />
    </div>
  );
}