import React, { useEffect, useState, useRef } from "react";
import TypingHeader from "../components/safePlace/TypingHeader.jsx";
import SearchBar from "../components/safePlace/SearchBar.jsx";
import MapView from "../components/safePlace/MapView.jsx";
import SafePlaceCard from "../components/safePlace/SafePlaceCard.jsx";
import HelplinesFooter from "../components/helplines/HelplinesFooter.jsx";
import { reverseGeocode } from "../utils/geocode.js";
import { Hospital, Shield, HeartHandshake, Home, MapPin, Navigation, List, X, Filter, Search, AlertTriangle } from "lucide-react";

export default function SafeSpaceLocator() {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5000); 
  const [query, setQuery] = useState("");
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [filters, setFilters] = useState({ hospital: true, police: true, ngo: true, shelter: true });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [addr, setAddr] = useState(null);
  const [refineMode, setRefineMode] = useState(false);
  const [tempRefineCoords, setTempRefineCoords] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // New States for Improvements
  const [locationError, setLocationError] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  
  const mapCompRef = useRef();

  // 1. Get Initial Location with better error handling
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
      return;
    }

    const success = (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        setLocationError(null);
        reverseGeocode(latitude, longitude).then(setAddr).catch(() => {});
    };

    const error = (err) => {
        console.warn("Geo error:", err);
        setLocationError("Location access denied or unavailable. Showing default location.");
        // Only set default if we haven't set a location yet (e.g. from search)
        setUserLocation(prev => prev || { lat: 23.2599, lng: 77.4126, accuracy: null }); // Default Bhopal
    };

    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, timeout: 10000 });
  }, []);

  // 2. Handle Search
  const handleSearchSelect = async (sel) => {
    if (!sel) return;
    if (typeof sel === "object" && sel.lat && sel.lng) {
        setQuery(sel.display_name || "");
        setSelectedSearch({ lat: sel.lat, lng: sel.lng, display_name: sel.display_name });
    } else if (typeof sel === "string") {
        setQuery(sel);
    }
  };

  const handlePlacesUpdate = (places) => setNearbyPlaces(places || []);

  const handleCardClick = (place) => {
    if (mapCompRef.current) {
        mapCompRef.current.flyToPlace(place);
        // On mobile, close sidebar after click for better view
        if (window.innerWidth < 1024) setSidebarOpen(false);
    }
  };

  const toggleRefineMode = () => {
    setRefineMode(!refineMode);
    setTempRefineCoords(null);
  }

  const saveRefinedLocation = async () => {
    if(tempRefineCoords) {
        setUserLocation({ ...tempRefineCoords, accuracy: 10 });
        setRefineMode(false);
        setTempRefineCoords(null);
        try {
            const data = await reverseGeocode(tempRefineCoords.lat, tempRefineCoords.lng);
            setAddr(data);
        } catch(e) {}
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 pt-8 pb-16 px-6 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
            <TypingHeader />
        </div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 -mt-8 pb-12 z-10">
         
         {/* Search Bar Row */}
         <div className="mb-6">
            <SearchBar 
                value={query} 
                onChange={setQuery} 
                onSelect={handleSearchSelect} 
                userLocation={userLocation} 
            />
            {locationError && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {locationError}
                    </div>
                    <button onClick={() => setLocationError(null)} className="text-red-500 font-bold hover:underline">Dismiss</button>
                </div>
            )}
         </div>

         {/* --- LOCATOR BOX (Fixed Height Container) --- */}
         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[75vh] min-h-[600px]">
            
            {/* 1. LEFT TOOLBAR (Icons) */}
            <div className="hidden md:flex flex-col items-center py-6 gap-4 w-16 border-r border-slate-100 bg-slate-50/50">
                <div className="mb-2"><Filter size={18} className="text-slate-400"/></div>
                <FilterBtn icon={Hospital} active={filters.hospital} color="text-red-500" onClick={() => setFilters(f => ({...f, hospital: !f.hospital}))} label="Hospital" />
                <FilterBtn icon={Shield} active={filters.police} color="text-blue-600" onClick={() => setFilters(f => ({...f, police: !f.police}))} label="Police" />
                <FilterBtn icon={HeartHandshake} active={filters.ngo} color="text-pink-500" onClick={() => setFilters(f => ({...f, ngo: !f.ngo}))} label="NGO" />
                <FilterBtn icon={Home} active={filters.shelter} color="text-green-600" onClick={() => setFilters(f => ({...f, shelter: !f.shelter}))} label="Shelter" />
                <div className="h-px w-8 bg-slate-200 my-2"></div>
                <button onClick={toggleRefineMode} title="Refine Location" className={`p-3 rounded-xl transition ${refineMode ? "bg-amber-100 text-amber-600 ring-2 ring-amber-300" : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"}`}>
                    <MapPin size={20} />
                </button>
            </div>

            {/* 2. CENTER MAP (Flex-1) */}
            <div className="flex-1 relative h-full">
                {/* Mobile Filter Toggle (Visible only on small screens) */}
                <div className="md:hidden absolute top-4 right-4 z-[400] flex gap-2">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white text-slate-700 p-2 rounded-lg shadow-md border border-slate-200 text-xs font-bold flex items-center gap-2">
                        {sidebarOpen ? <X size={16} /> : <List size={16} />}
                        {sidebarOpen ? "Close List" : "View List"}
                    </button>
                </div>

                {/* "Search This Area" Button */}
                {mapCenter && !refineMode && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[400]">
                        <button 
                            onClick={() => {
                                setUserLocation({ lat: mapCenter.lat, lng: mapCenter.lng });
                                setMapCenter(null);
                                setLocationError(null);
                            }}
                            className="bg-white text-indigo-700 px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 border border-indigo-100 hover:scale-105 transition active:scale-95"
                        >
                            <Search size={14} /> Search This Area
                        </button>
                    </div>
                )}

                {/* Refine Mode Banner */}
                {refineMode && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex gap-3 items-center animate-in slide-in-from-top-2">
                        <span>Tap map to set location</span>
                        {tempRefineCoords && <button onClick={saveRefinedLocation} className="bg-white text-amber-600 px-3 py-1 rounded text-xs font-bold hover:bg-amber-50 shadow-sm">SAVE</button>}
                        <button onClick={toggleRefineMode} className="hover:bg-amber-600 px-2 py-1 rounded">✕</button>
                    </div>
                )}

                <MapView 
                    ref={mapCompRef}
                    userLocation={userLocation}
                    query={selectedSearch}
                    radius={radius}
                    filters={filters}
                    onPlacesUpdate={handlePlacesUpdate}
                    refineMode={refineMode}
                    onRefineComplete={setTempRefineCoords}
                    onMapMove={setMapCenter}
                />

                {/* Address Badge Overlay */}
                <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200 max-w-[200px] md:max-w-xs transition-all">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase mb-1 tracking-wider">
                        <Navigation size={12} /> Current Location
                    </div>
                    <p className="text-sm text-slate-800 font-medium truncate">
                        {addr?.display_name ? addr.display_name.split(',')[0] : "Locating..."}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate opacity-80">
                         {addr?.display_name || "Waiting for GPS..."}
                    </p>
                </div>
            </div>

            {/* 3. RIGHT LIST (Scrollable sidebar) */}
            <div className={`
                absolute md:static inset-0 z-50 bg-white md:z-auto
                w-full md:w-80 lg:w-96 border-l border-slate-200 
                flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}>
                {/* List Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="font-bold text-slate-800">Nearby Safe Spaces</h3>
                            <p className="text-xs text-slate-500">Within {(radius/1000).toFixed(1)}km radius</p>
                        </div>
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                            {nearbyPlaces.length}
                        </span>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Radius Slider */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-medium w-8">1km</span>
                        <input 
                            type="range" 
                            min="1000" 
                            max="20000" 
                            step="1000"
                            value={radius} 
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="text-xs text-slate-400 font-medium w-8 text-right">20km</span>
                    </div>
                </div>

                {/* List Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 scrollbar-thin scrollbar-thumb-slate-300">
                    {nearbyPlaces.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
                            <MapPin size={48} className="mb-4 text-slate-200" />
                            <p className="text-sm font-medium text-slate-500">No safe spaces found nearby.</p>
                            <p className="text-xs mt-1">Try increasing the radius or moving the map.</p>
                        </div>
                    ) : (
                        nearbyPlaces.map(place => (
                            <div key={place.id} onClick={() => handleCardClick(place)} className="cursor-pointer transform transition hover:scale-[1.02]">
                                <SafePlaceCard place={place} route={place._route} userLocation={userLocation} />
                            </div>
                        ))
                    )}
                </div>
            </div>

         </div>

      </main>

      <HelplinesFooter />
    </div>
  );
}

function FilterBtn({ icon: Icon, active, color, onClick, label }) {
    return (
        <button 
            onClick={onClick}
            title={label}
            className={`p-3 rounded-xl transition-all duration-200 flex flex-col items-center gap-1 w-12 h-12 justify-center ${active ? `bg-white shadow-md border border-slate-100 ${color}` : "bg-transparent text-slate-400 hover:bg-slate-100"}`}
        >
            <Icon size={20} className={active ? "fill-current opacity-20" : ""} strokeWidth={2} />
        </button>
    )
}