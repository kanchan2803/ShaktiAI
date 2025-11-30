import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Loader2, MapPin } from "lucide-react";
import { autocomplete } from "../../utils/geocode.js";

export default function SearchBar({ value, onChange, onSelect, userLocation }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debRef = useRef(null);
  const inputRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  // Update dropdown position on resize/scroll
  const updatePosition = () => {
    if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        setCoords({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: rect.width
        });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  // Debounced Autocomplete
  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debRef.current) clearTimeout(debRef.current);
    
    debRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        let viewbox = null;
        if(userLocation) {
            viewbox = [
                userLocation.lng - 0.5, userLocation.lat + 0.5, 
                userLocation.lng + 0.5, userLocation.lat - 0.5
            ];
        }
        
        const results = await autocomplete(value, { viewbox });
        setSuggestions(results || []);
        if(results?.length) {
            setOpen(true);
            updatePosition();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debRef.current);
  }, [value, userLocation]);

  const handleSelect = (item) => {
    const payload = {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        display_name: item.display_name
    };
    onSelect(payload);
    setOpen(false);
  };

  return (
    <div className="relative w-full z-[50]">
      <div 
        ref={inputRef}
        className="flex items-center gap-3 px-6 py-4 rounded-full shadow-lg bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
      >
        <Search className="text-slate-400 w-5 h-5" />
        <input 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => { if(suggestions.length) { setOpen(true); updatePosition(); } }}
            placeholder="Search for a safe place, city, or hospital..."
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-lg"
        />
        {loading && <Loader2 className="animate-spin text-indigo-500 w-4 h-4" />}
      </div>

      {/* Portal to Body for Z-Index safety */}
      {open && suggestions.length > 0 && createPortal(
        <div 
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
        >
            {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => handleSelect(s)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b last:border-0 border-slate-50 flex items-start gap-3"
                >
                    <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                        <div className="text-sm font-medium text-slate-800 line-clamp-1">{s.display_name.split(',')[0]}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 opacity-70">{s.display_name}</div>
                    </div>
                </button>
            ))}
        </div>,
        document.body
      )}
    </div>
  );
}