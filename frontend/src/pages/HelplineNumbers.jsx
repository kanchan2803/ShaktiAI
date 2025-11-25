
// frontend/src/pages/HelplineNumbers.jsx
import React, { useMemo, useState } from "react";
import HeroSection from "../components/helplines/HeroSection";
import SearchBar from "../components/helplines/SearchBar";
import CategorySection from "../components/helplines/CategorySection";
import MissionVision from "../components/helplines/MissionVision";
import TeamSection from "../components/helplines/TeamSection";
import HelplinesFooter from "../components/helplines/HelplinesFooter";
import HelplineCard from "../components/helplines/HelplineCard";
import { motion } from "framer-motion";
import { 
  Shield, 
  HeartPulse, 
  CloudSun, 
  Phone, 
  Users, 
  Leaf, 
  AlertTriangle 
} from "lucide-react";


import { helplinesData as helplines } from "../data/helplinesData";


/**
 * Helpline Numbers Page
 * - Search / filter
 * - Category sections
 * - Mobile friendly and accessible
 */
export default function HelplineNumbers() {
  const [query, setQuery] = useState("");
  

//  for filter chips
  const [selectedCategory, setSelectedCategory] = useState("All");
    const categoriesList = [
    "All",
    "National Helplines",
    "Women's Safety Helplines",
    "Cybercrime / Online Fraud",
    "Health & Mental Health",
    "Disaster & Environment",
    "Agriculture & Rural Support",
    "Senior Citizens",
    "State-specific Helplines",
    ];
    
    // Color theme for category chips and badges
    const categoryColors = {
      "National Helplines": "from-blue-500 to-indigo-600",
      "Women's Safety Helplines": "from-pink-500 to-rose-600",
      "Cybercrime / Online Fraud": "from-purple-500 to-fuchsia-600",
      "Health & Mental Health": "from-green-500 to-emerald-600",
      "Disaster & Environment": "from-yellow-500 to-orange-600",
      "Agriculture & Rural Support": "from-lime-500 to-green-600",
      "Senior Citizens": "from-amber-500 to-orange-600",
      "State-specific Helplines": "from-teal-500 to-cyan-600",
      All: "from-gray-400 to-gray-500",
    };


    const categoryIcons = {
        "All": Phone,
        "National Helplines": Shield,
        "Women's Safety Helplines": HeartPulse,
        "Cybercrime / Online Fraud": AlertTriangle,
        "Health & Mental Health": HeartPulse,
        "Disaster & Environment": CloudSun,
        "Agriculture & Rural Support": Leaf,
        "Senior Citizens": Users,
        "State-specific Helplines": Shield,
        };



  // Filtered list computed with useMemo for perf
  // Filtered list computed with useMemo for perf (query + category filter)
  // Filtered list computed with useMemo for perf (query + normalized category filter)
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    // Map display categories to keywords likely present in data
    const categoryKeywords = {
      "National Helplines": ["national"],
      "Women's Safety Helplines": ["women", "woman", "lady", "female"],
      "Cybercrime / Online Fraud": ["cyber", "online", "fraud", "crime"],
      "Health & Mental Health": ["health", "mental"],
      "Disaster & Environment": ["disaster", "environment"],
      "Senior Citizens": ["senior", "citizen", "elder"],
      "Agriculture & Rural Support": ["agriculture", "rural", "farmer"],
      "State-specific Helplines": ["state"],
    };

    return helplines.filter((h) => {
      const category = (h.category || "").toLowerCase();
      const state = (h.state || "").toLowerCase();

      // ✅ Query filter
      const matchesQuery =
        !q ||
        h.name.toLowerCase().includes(q) ||
        (h.description && h.description.toLowerCase().includes(q)) ||
        category.includes(q) ||
        state.includes(q);

      // ✅ Category filter
      if (selectedCategory === "All") return matchesQuery;

      const keywords = categoryKeywords[selectedCategory] || [];
      const matchesCategory =
        keywords.some((kw) => category.includes(kw)) ||
        (selectedCategory === "State-specific Helplines" && state && state !== "all india");

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);



  // Group by categories for sections
const categories = useMemo(() => {
  const group = {
    "National Helplines": [],
    "Women's Safety Helplines": [],
    "Cybercrime / Online Fraud": [],
    "Health & Mental Health": [],
    "Disaster & Environment": [],
    "Senior Citizens": [],
    "Agriculture & Rural Support": [],
    "State-specific Helplines": [],
    "Other Helplines": [],
  };

  filtered.forEach((h) => {
    const cat = (h.category || "").toLowerCase();

    if (cat.includes("national")) group["National Helplines"].push(h);
    else if (cat.includes("women")) group["Women's Safety Helplines"].push(h);
    else if (cat.includes("cyber")) group["Cybercrime / Online Fraud"].push(h);
    else if (cat.includes("health") || cat.includes("mental")) group["Health & Mental Health"].push(h);
    else if (cat.includes("disaster") || cat.includes("environment")) group["Disaster & Environment"].push(h);
    else if (cat.includes("senior")) group["Senior Citizens"].push(h);
    else if (cat.includes("agriculture") || cat.includes("rural")) group["Agriculture & Rural Support"].push(h);
    else if (cat.includes("state")) group["State-specific Helplines"].push(h);
    else if (h.state && h.state.toLowerCase() !== "all india")
      group["State-specific Helplines"].push(h);
    else group["Other Helplines"].push(h);
  });

  return group;
}, [filtered]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">


      <HeroSection />
        {/* Add a little spacing below hero before search bar */}
        <div className="mt-10 md:mt-20">
        <SearchBar query={query} setQuery={setQuery} />

        {/* For filter chips */}
        {/* <SearchBar
            query={query}
            setQuery={setQuery}
            categoriesList={categoriesList}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            /> */}

        {/* Animated Category Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {categoriesList.map((category) => {
            const Icon = categoryIcons[category];
            const isActive = selectedCategory === category;
            const gradient = categoryColors[category] || "from-blue-500 to-indigo-500";

            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium shadow-md transition-all duration-300
                  border border-gray-200 backdrop-blur-md shadow-sm hover:shadow-md
                  ${
                    isActive
                      ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-blue-200`
                      : "bg-white text-gray-700 hover:text-blue-600"
                  }`}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-blue-500"} />
                </motion.div>
                {category}
              </motion.button>
            );
          })}
        </div>

        </div>


      {/* Category sections */}
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <p className="text-gray-600 mb-6">
            Showing <strong>{filtered.length}</strong> results for <span className="italic">{query || "all"}</span>.
          </p>
        </div>
        
        <CategorySection title="National Helplines" items={categories["National Helplines"]} />
        <CategorySection title="Women's Safety Helplines" items={categories["Women's Safety Helplines"]} />
        <CategorySection title="Cybercrime / Online Fraud" items={categories["Cybercrime / Online Fraud"]} />
        <CategorySection title="Health & Mental Health" items={categories["Health & Mental Health"]} />
        <CategorySection title="Disaster & Environment" items={categories["Disaster & Environment"]} />
        <CategorySection title="Senior Citizens" items={categories["Senior Citizens"]} />
        <CategorySection title="Agriculture & Rural Support" items={categories["Agriculture & Rural Support"]} />
        <CategorySection title="State-specific Helplines" items={categories["State-specific Helplines"]} />
        <CategorySection title="Other Helplines" items={categories["Other Helplines"]} />

      </main>

      <MissionVision />
      {/* <TeamSection /> */}
      <HelplinesFooter />
    </div>
  );
}
<style jsx="true">{`
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 0.75; }
  }
  @keyframes pulse-slower {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.15); opacity: 0.6; }
  }
  .animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
  }
  .animate-pulse-slower {
    animation: pulse-slower 12s ease-in-out infinite;
  }
`}</style>


          
          // // FILTER CHIPS BLUE GRADIENT ALL (CAN BE PASTED AT 171 LINE)
          // <div className="flex flex-wrap justify-center gap-3 mt-6">
          //   {categoriesList.map((category) => {
          //       const Icon = categoryIcons[category];
          //       const isActive = selectedCategory === category;
          //       return (
          //       <motion.button
          //           key={category}
          //           whileHover={{ scale: 1.1 }}
          //           whileTap={{ scale: 0.95 }}
          //           onClick={() => setSelectedCategory(category)}
          //           className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium shadow-md transition-all duration-300
          //           ${isActive 
          //               ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200" 
          //               : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"}`}
          //       >
          //           <motion.div
          //           animate={{ y: [0, -3, 0] }}
          //           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          //           >
          //           <Icon size={16} className={isActive ? "text-white" : "text-blue-500"} />
          //           </motion.div>
          //           {category}
          //       </motion.button>
          //       );
          //   })}
          //   </div>