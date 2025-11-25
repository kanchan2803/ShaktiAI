//newest code
// frontend/src/components/helplines/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search by name, category or state...",
  categoriesList = [],
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-8">
      {/* Search input */}
      <div className="bg-white rounded-3xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          aria-label="Search helplines"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none py-3 px-2 text-gray-700 placeholder-gray-400 bg-transparent"
          placeholder={placeholder}
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="text-sm text-blue-600 hover:underline hidden sm:inline"
          >
            Clear
          </button>
        )}
      </div>

      
    </div>
  );
}

// oldest code
// // frontend/src/components/helplines/SearchBar.jsx
// import React from "react";
// import { Search } from "lucide-react";

// export default function SearchBar({ query, setQuery, placeholder = "Search by name, category or state..." }) {
//   return (
//     <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-8">
//       <div className="bg-white rounded-3xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
//         <Search className="w-5 h-5 text-gray-400" />
//         <input
//           aria-label="Search helplines"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-1 outline-none py-3 px-2 text-gray-700 placeholder-gray-400 bg-transparent"
//           placeholder={placeholder}
//         />
//         <button
//           aria-label="Clear search"
//           onClick={() => setQuery("")}
//           className="text-sm text-blue-600 hover:underline hidden sm:inline"
//         >
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }


// FOR FILTER CHIPS AND SMALL SEARCH BAR
// frontend/src/components/helplines/SearchBar.jsx
// import React from "react";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";

// export default function SearchBar({
//   query,
//   setQuery,
//   categoriesList = [],
//   selectedCategory,
//   setSelectedCategory,
// }) {
//   return (
//     <section className="relative flex flex-col items-center justify-center text-center py-10">
//       <motion.div
//         initial={{ y: 40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-xl px-4"
//       >
//         {/* Search Input */}
//         <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
//           <Search className="ml-4 text-gray-500" size={20} />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search helpline by name, category, or state..."
//             className="flex-grow px-4 py-3 text-gray-700 focus:outline-none rounded-r-full"
//           />
//         </div>

//         {/* Filter Chips */}
//         <div className="flex flex-wrap justify-center mt-6 gap-3">
//           {categoriesList.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setSelectedCategory(cat)}
//               className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
//                 selectedCategory === cat
//                   ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md"
//                   : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </motion.div>
//     </section>
//   );
// }


