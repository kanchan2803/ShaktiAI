// src/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { autocomplete, geocode } from "../../utils/geocode";

/**
 * Props:
 *  - value (string)
 *  - onChange (fn newValue)
 *  - onSelect (fn resultObj {lat,lng,display_name})  // called when user picks a suggestion OR when Search resolves
 *  - userLocation (optional) - used to bias autocomplete viewbox
 */
export default function SearchBar({ value, onChange, onSelect, userLocation }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debRef = useRef(null);

  // positioning
  const inputRef = useRef(null);
  const [stylePos, setStylePos] = useState(null);

  // compute viewbox if userLocation provided
  const viewbox = userLocation
    ? [
        userLocation.lng - 0.5,
        userLocation.lat + 0.5,
        userLocation.lng + 0.5,
        userLocation.lat - 0.5,
      ]
    : null;

  // debounce autocomplete
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const items = await autocomplete(value, { viewbox });
        setSuggestions(items || []);
        setOpen(true);
        computePos();
      } catch (err) {
        console.warn("autocomplete err", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debRef.current) clearTimeout(debRef.current);
    };
  }, [value, userLocation]);

  // compute dropdown absolute/fixed position to render on body
  function computePos() {
    const el = inputRef.current;
    if (!el) return setStylePos(null);
    const r = el.getBoundingClientRect();
    setStylePos({
      position: "fixed",
      left: `${r.left}px`,
      top: `${r.bottom + 8}px`,
      width: `${r.width}px`,
      zIndex: 20000,
      maxHeight: "320px",
      overflow: "auto",
    });
  }

  useEffect(() => {
    if (!open) return;
    const onResize = () => computePos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  // when user clicks Search: attempt forward geocode then call onSelect
  async function handleManualSearch() {
    if (!value || value.trim().length < 1) return;
    setLoading(true);
    try {
      const result = await geocode(value);
      if (result) {
        onSelect && onSelect(result);
        setSuggestions([]);
        setOpen(false);
      } else {
        // fallback: try autocomplete suggestions list if any
        if (suggestions && suggestions.length) {
          const s = suggestions[0];
          onSelect &&
            onSelect({ lat: parseFloat(s.lat), lng: parseFloat(s.lon), display_name: s.display_name });
          setOpen(false);
          setSuggestions([]);
        } else {
          alert("No location found for that query. Try a different name or use suggestions.");
        }
      }
    } catch (err) {
      console.warn("geocode error", err);
      alert("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // handle suggestion click (use onMouseDown to avoid blur race)
  function handleSuggestionClick(s) {
    const payload = { lat: parseFloat(s.lat), lng: parseFloat(s.lon), display_name: s.display_name };
    onSelect && onSelect(payload);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-3 rounded-xl flex items-center gap-3 shadow-lg bg-white/90 backdrop-blur-md"
      >
        <div className="flex items-center gap-2 flex-1">
          <Search className="text-slate-600" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            onFocus={() => {
              setOpen(true);
              computePos();
            }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleManualSearch();
              }
            }}
            placeholder="Search hospitals, police, NGOs..."
            className="w-full bg-transparent outline-none placeholder:text-slate-400 text-sm"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleManualSearch}
          className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#3550A6] to-[#E91E63] text-white font-semibold text-sm flex items-center gap-2"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.25" fill="none" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          ) : (
            "Search"
          )}
        </motion.button>
      </motion.div>

      {/* Suggestions dropdown rendered into body to avoid map z-index problems */}
      {open && suggestions.length > 0 && stylePos &&
        createPortal(
          <div style={stylePos} className="bg-white rounded-lg shadow-xl mt-2 border border-gray-200">
            {suggestions.map((s) => (
              <button
                key={s.place_id || s.osm_id}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  handleSuggestionClick(s);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                <div className="text-sm font-medium">{s.display_name}</div>
                <div className="text-xs text-slate-500">{s.type || s.class}</div>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}



// latest working code
// // src/components/SearchBar.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { createPortal } from "react-dom";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";
// import { autocomplete } from "../utils/geocode";

// export default function SearchBar({ value, onChange, onSelect, userLocation }) {
//   const [suggestions, setSuggestions] = useState([]);
//   const [open, setOpen] = useState(false);
//   const deb = useRef(null);

//   // refs used for dropdown positioning
//   const wrapperRef = useRef(null);
//   const inputRef = useRef(null);
//   const [dropdownStyle, setDropdownStyle] = useState(null);

//   // Build a viewbox around user location (small box ~ city area) to bias suggestions
//   const viewbox = userLocation
//     ? [
//         userLocation.lng - 0.5, // left
//         userLocation.lat + 0.5, // top
//         userLocation.lng + 0.5, // right
//         userLocation.lat - 0.5, // bottom
//       ]
//     : null;

//   useEffect(() => {
//     if (!value || value.trim().length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     if (deb.current) clearTimeout(deb.current);
//     deb.current = setTimeout(async () => {
//       try {
//         const res = await autocomplete(value, { viewbox });
//         setSuggestions(res || []);
//         setOpen(true);
//         // compute position once suggestions arrive
//         requestAnimationFrame(() => computeDropdownPosition());
//       } catch (err) {
//         console.warn("autocomplete err", err);
//       }
//     }, 300);

//     return () => {
//       if (deb.current) clearTimeout(deb.current);
//     };
//   }, [value]);

//   // compute dropdown screen position relative to input
//   function computeDropdownPosition() {
//     const el = inputRef.current || wrapperRef.current;
//     if (!el) return setDropdownStyle(null);
//     const rect = el.getBoundingClientRect();
//     const style = {
//       position: "fixed",
//       left: rect.left + "px",
//       top: rect.bottom + 8 + "px",
//       width: rect.width + "px",
//       zIndex: 20000,
//       maxHeight: "320px",
//       overflow: "auto",
//     };
//     setDropdownStyle(style);
//   }

//   // reposition on window resize / scroll while open
//   useEffect(() => {
//     if (!open) return;
//     const onResize = () => computeDropdownPosition();
//     window.addEventListener("resize", onResize);
//     window.addEventListener("scroll", onResize, true);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("scroll", onResize, true);
//     };
//   }, [open]);

//   return (
//     <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 6 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="glass p-3 rounded-xl flex items-center gap-3 shadow-lg bg-white/90 backdrop-blur-md"
//       >
//         <div className="flex items-center gap-2 flex-1">
//           <Search className="text-slate-600" />
//           <input
//             ref={inputRef}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             onFocus={() => {
//               setOpen(true);
//               computeDropdownPosition();
//             }}
//             onBlur={() => setTimeout(() => setOpen(false), 150)}
//             placeholder="Search hospitals, police, NGOs..."
//             className="w-full bg-transparent outline-none placeholder:text-slate-400"
//           />
//         </div>
//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           onClick={() => {
//             // clicking Search passes the raw string to parent (parent will geocode)
//             onSelect && onSelect(value);
//           }}
//           className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#3550A6] to-[#E91E63] text-white font-semibold"
//         >
//           Search
//         </motion.button>
//       </motion.div>

//       {/* Suggestions dropdown rendered into body so it always floats above the map */}
//       {open && suggestions.length > 0 &&
//         createPortal(
//           <div
//             style={dropdownStyle}
//             className="bg-white rounded-lg shadow-xl mt-2 border border-gray-200"
//           >
//             {suggestions.map((s) => (
//               <button
//                 key={s.place_id || s.osm_id}
//                 onMouseDown={(ev) => {
//                   ev.preventDefault(); // prevent losing focus before click
//                   onSelect &&
//                     onSelect({
//                       lat: parseFloat(s.lat),
//                       lng: parseFloat(s.lon),
//                       display_name: s.display_name,
//                     });
//                   setOpen(false);
//                 }}
//                 className="w-full text-left px-3 py-2 hover:bg-gray-100"
//               >
//                 <div className="text-sm font-medium">{s.display_name}</div>
//                 <div className="text-xs text-slate-500">{s.type || s.class}</div>
//               </button>
//             ))}
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// }
