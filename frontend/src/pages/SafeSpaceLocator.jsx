// src/pages/SafeSpaceLocator.jsx
import React, { useEffect, useState, useRef } from "react";
import TypingHeader from "../components/safePlace/TypingHeader";
import SearchBar from "../components/safePlace/SearchBar";
import MapView from "../components/safePlace/MapView";
import SafePlacecard from "../components/safePlace/SafePlaceCard"
import HelplinesFooter from "../components/helplines/HelplinesFooter";
import { reverseGeocode } from "../utils/geocode";
import { Hospital, Shield, HeartHandshake, Home, MapPin } from "lucide-react";

export default function SafeSpaceLocator() {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(8000);
  const [query, setQuery] = useState("");
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [filters, setFilters] = useState({ hospital: true, police: true, ngo: true, shelter: true });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [addr, setAddr] = useState(null);
  const [refineMode, setRefineMode] = useState(false);
  const [tempRefineCoords, setTempRefineCoords] = useState(null);
  const mapCompRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(true); // new
  useEffect(() => {
      if (mapCompRef.current?.leafletElement || mapCompRef.current?._map) {
        const map = mapCompRef.current.leafletElement || mapCompRef.current._map;
        setTimeout(() => {
          map.invalidateSize(); // 🔹 Forces Leaflet to resize map properly
        }, 300);
      }
    }, [sidebarOpen]);

  


  // get location (with fallback)
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 23.2599, lng: 77.4126, accuracy: null }); // Bhopal fallback
      return;
    }

    const opts = { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        reverseGeocode(pos.coords.latitude, pos.coords.longitude).then(setAddr).catch(() => {});
      },
      (err) => {
        console.warn("Geo error:", err);
        setUserLocation({ lat: 23.2599, lng: 77.4126, accuracy: null });
      },
      opts
    );
  }, []);

  // NEW: perform geocode for string queries so MapView gets lat/lng
  const handleSearchSelect = async (sel) => {
    if (!sel) return;
    // if parent passed an object with lat/lng (from suggestions), use it directly
    if (typeof sel === "object" && sel.lat && sel.lng) {
      setQuery(sel.display_name || "");
      setSelectedSearch({ lat: sel.lat, lng: sel.lng, display_name: sel.display_name });
      return;
    }

    // if it's a string (user typed or pressed Search), geocode via Nominatim
    const raw = typeof sel === "string" ? sel.trim() : "";
    if (raw.length === 0) return;

    try {
      // prefer to include current locality to bias results
      const region = addr?.address?.city || addr?.address?.state || "";
      const q = encodeURIComponent(raw + (region ? " " + region : ""));
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`);
      const arr = await res.json();
      if (arr && arr[0]) {
        const lat = parseFloat(arr[0].lat);
        const lng = parseFloat(arr[0].lon);
        setQuery(arr[0].display_name || raw);
        setSelectedSearch({ lat, lng, display_name: arr[0].display_name });
      } else {
        // no geocode result — keep the raw query for possible fallback
        setQuery(raw);
        setSelectedSearch(null);
        alert("No location found for that query. Try a different name or use suggestions.");
      }
    } catch (err) {
      console.warn("Geocode error", err);
      alert("Failed to geocode search. Try again.");
    }
  };

  const handlePlacesUpdate = (places) => {
    setNearbyPlaces(places || []);
  };

  const handleCardClick = (place) => {
    if (mapCompRef.current?.flyToPlace) mapCompRef.current.flyToPlace(place);
  };

  const handleRefineComplete = (coords) => {
    setTempRefineCoords(coords);
  };

  const acceptRefine = async () => {
    if (!tempRefineCoords) return;
    setUserLocation({ lat: tempRefineCoords.lat, lng: tempRefineCoords.lng, accuracy: null });
    try {
      const r = await reverseGeocode(tempRefineCoords.lat, tempRefineCoords.lng);
      setAddr(r);
    } catch (e) {}
    setRefineMode(false);
    setTempRefineCoords(null);
  };

  const cancelRefine = () => {
    setRefineMode(false);
    setTempRefineCoords(null);
  };

  const manualSetLocation = async () => {
    const raw = prompt("Enter coords as lat,lng (e.g. 23.2599,77.4126) or a place name:");
    if (!raw) return;
    const parts = raw.split(",").map((s) => s.trim());
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const lat = parseFloat(parts[0]),
        lng = parseFloat(parts[1]);
      setUserLocation({ lat, lng, accuracy: null });
      try {
        const r = await reverseGeocode(lat, lng);
        setAddr(r);
      } catch (e) {}
    } else {
      try {
        const q = encodeURIComponent(raw + " " + (addr?.address?.city || ""));
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`);
        const arr = await res.json();
        if (arr && arr[0]) {
          const lat = parseFloat(arr[0].lat),
            lng = parseFloat(arr[0].lon);
          setUserLocation({ lat, lng, accuracy: null });
          setAddr(arr[0]);
        } else {
          alert("Could not find location for that input.");
        }
      } catch (err) {
        alert("Failed to geocode. Try coordinates.");
      }
    }
  };

  const copyCoords = () => {
    const text = `${userLocation?.lat || ""},${userLocation?.lng || ""}`;
    navigator.clipboard?.writeText(text).then(() => alert("Coordinates copied"));
  };
  const shareLocation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${userLocation?.lat},${userLocation?.lng}`;
    if (navigator.share) {
      navigator.share({ title: "My location", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => alert("Location URL copied"));
    }
  };

  return (
    // <div className="min-h-screen flex flex-col">
    //   {/* 🟦 HERO SECTION with gradient background */}
    //   <div className="p-6 border-b bg-gradient-to-r from-[#1E3A8A] to-[#60A5FA] text-white shadow-lg">
    //     <div className="max-w-5xl mx-auto"></div>

  
    // <div
    //   className={`min-h-screen transition-colors duration-300 ${
    //     dark
    //       ? "bg-slate-900 text-slate-100"
    //       : "bg-gradient-to-b from-blue-50 to-white text-slate-900"
    //   }`}
    // >
      
    
    <div className="min-h-screen flex flex-col">
            
      {/* Header + search */}
      <div className="relative p-6 border-b bg-gradient-to-r from-[#1E3A8A] to-[#60A5FA] text-white shadow-lg">
        <TypingHeader />
        <div className="mt-3 max-w-3xl">
          <SearchBar value={query} onChange={setQuery} onSelect={handleSearchSelect} userLocation={userLocation} />
        </div>
        {/* Sidebar Toggle Button (bottom-right) */}
      <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-4 right-4 bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-yellow-500 transition-all"
        >
          {sidebarOpen ? "Hide Safe Places" : "Show Safe Places"}
        </button>
      </div>

      {/* main area: left narrow toolbar, center map, right full-height list */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: narrow toolbar */}
        <div className="w-[76px] bg-white/75 backdrop-blur-md border-r flex flex-col items-center py-4 justify-between">
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={() => setFilters((f) => ({ ...f, hospital: !f.hospital }))}
              title="Hospitals"
              className={`p-3 rounded-lg transition ${filters.hospital ? "bg-red-50 text-red-600" : "text-slate-400"}`}
            >
              <Hospital />
            </button>

            <button
              onClick={() => setFilters((f) => ({ ...f, police: !f.police }))}
              title="Police"
              className={`p-3 rounded-lg transition ${filters.police ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}
            >
              <Shield />
            </button>

            <button
              onClick={() => setFilters((f) => ({ ...f, ngo: !f.ngo }))}
              title="NGOs"
              className={`p-3 rounded-lg transition ${filters.ngo ? "bg-pink-50 text-pink-600" : "text-slate-400"}`}
            >
              <HeartHandshake />
            </button>

            <button
              onClick={() => setFilters((f) => ({ ...f, shelter: !f.shelter }))}
              title="Shelters"
              className={`p-3 rounded-lg transition ${filters.shelter ? "bg-green-50 text-green-600" : "text-slate-400"}`}
            >
              <Home />
            </button>

            <button
              onClick={() => {
                setRefineMode((s) => !s);
                setTempRefineCoords(null);
              }}
              title="Refine location (click map)"
              className={`p-2 mt-4 rounded-md text-sm ${refineMode ? "bg-yellow-100 text-yellow-700" : "text-slate-500"}`}
            >
              <div className="flex flex-col items-center">
                <MapPin />
                <div style={{ fontSize: 10 }}>Refine</div>
              </div>
            </button>

            <button onClick={manualSetLocation} title="Set location manually" className="p-2 mt-2 rounded-md text-xs text-slate-600 border px-2">
              Manual
            </button>
          </div>

          {/* save/cancel refine */}
          <div className="mb-4 flex flex-col gap-2">
            {tempRefineCoords && (
              <>
                <button onClick={acceptRefine} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm">Save</button>
                <button onClick={cancelRefine} className="px-3 py-1 rounded-lg bg-white border text-sm">Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* // sidebar right button
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 right-4 z-[9999] bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-transform"
        >
          {sidebarOpen ? "Hide List »" : "« Show List"}
        </button> */}


        {/* CENTER: Map */}
        <div className="flex-1 relative">
          <MapView
            ref={mapCompRef}
            userLocation={userLocation}
            query={selectedSearch}
            radius={radius}
            filters={filters}
            onPlacesUpdate={handlePlacesUpdate}
            refineMode={refineMode}
            onRefineComplete={handleRefineComplete}
          />

          <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow px-3 py-2 text-sm w-64">
            <div className="font-medium text-slate-800">{addr?.display_name ? addr.display_name.split(",")[0] : "Unknown address"}</div>
            <div className="text-xs text-slate-500 mt-1">
              {userLocation?.accuracy ? `Accuracy ±${Math.round(userLocation.accuracy)} m` : "Accuracy unknown"}
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={copyCoords} className="text-xs px-2 py-1 border rounded">Copy</button>
              <button onClick={shareLocation} className="text-xs px-2 py-1 border rounded">Share</button>
            </div>
          </div>
        </div>

          
        {/* RIGHT: full-height list */}
        {/* RIGHT: full-height list */}

        {/* RIGHT: Safe Places Sidebar */}
        <div
          className={`transition-all duration-500 ease-in-out transform 
                      bg-white/90 backdrop-blur-md border-l 
                      flex flex-col 
                      max-h-[calc(100vh-100px)] overflow-y-auto 
                      md:w-[340px] sm:w-[100%]
                      ${sidebarOpen 
                        ? "w-[360px] translate-x-0" 
                        : "w-0 md:w-0 translate-x-full overflow-hidden"
                      }`}
        >



          {/* Header */}
          <div className="px-4 py-3 border-b flex-shrink-0">

            <div className="font-semibold text-slate-800">Nearby Safe Places</div>
            <div className="text-xs text-slate-500">{nearbyPlaces.length} found</div>
          </div>

          {/* Scrollable list */}
          <div
            className="
              flex-1 
              overflow-y-auto 
              px-4 py-3 
              space-y-3 
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent 
              hover:scrollbar-thumb-gray-400
            "
          >
            {nearbyPlaces.length === 0 ? (
              <div className="text-sm text-slate-500 mt-3">No safe places nearby.</div>
            ) : (
              nearbyPlaces.map((p) => (
                <div key={p.id} onClick={() => handleCardClick(p)}>
                  <SafePlaceCard place={p} route={p._route} />
                </div>
              ))
            )}
          </div>
        </div>


      </div>
      <HelplinesFooter />
    </div>
  );
}


// latest working code
// // src/pages/SafeSpaceLocator.jsx
// import React, { useEffect, useState, useRef } from "react";
// import TypingHeader from "../components/TypingHeader";
// import SearchBar from "../components/SearchBar";
// import MapView from "../components/MapView";
// import SafePlaceCard from "../components/SafePlaceCard";
// import { reverseGeocode } from "../utils/geocode";
// import { Hospital, Shield, HeartHandshake, Home, MapPin } from "lucide-react";

// export default function SafeSpaceLocator() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [radius, setRadius] = useState(8000);
//   const [query, setQuery] = useState("");
//   const [selectedSearch, setSelectedSearch] = useState(null);
//   const [filters, setFilters] = useState({ hospital: true, police: true, ngo: true, shelter: true });
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);
//   const [addr, setAddr] = useState(null);
//   const [refineMode, setRefineMode] = useState(false);
//   const [tempRefineCoords, setTempRefineCoords] = useState(null);
//   const mapRef = useRef(); // for flyToPlace
//   const mapCompRef = useRef(); // forwarded ref to MapView

//   // get location (with fallback)
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setUserLocation({ lat: 23.2599, lng: 77.4126, accuracy: null }); // Bhopal fallback
//       return;
//     }

//     const opts = { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 };
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
//         reverseGeocode(pos.coords.latitude, pos.coords.longitude).then(setAddr).catch(() => {});
//       },
//       (err) => {
//         console.warn("Geo error:", err);
//         // don't force user; provide manual set
//         setUserLocation({ lat: 23.2599, lng: 77.4126, accuracy: null });
//       },
//       opts
//     );
//   }, []);

//   // when search is selected from SearchBar
//   const handleSearchSelect = (sel) => {
//     if (!sel) return;
//     if (typeof sel === "string") {
//       setQuery(sel);
//       setSelectedSearch({ raw: sel });
//     } else {
//       setQuery(sel.display_name || "");
//       setSelectedSearch({ lat: parseFloat(sel.lat), lng: parseFloat(sel.lon), display_name: sel.display_name });
//     }
//   };

//   // handle places update from MapView
//   const handlePlacesUpdate = (places) => {
//     setNearbyPlaces(places || []);
//   };

//   // fly to place when clicking a card (use MapView's exposed method)
//   const handleCardClick = (place) => {
//     if (mapCompRef.current?.flyToPlace) {
//       mapCompRef.current.flyToPlace(place);
//     }
//   };

//   // refine location flow (map click sets coords via MapView's onRefineComplete)
//   const handleRefineComplete = (coords) => {
//     setTempRefineCoords(coords);
//     // open a small UI to confirm (we'll show Save button in left toolbar)
//   };

//   // accept refined location as new userLocation
//   const acceptRefine = async () => {
//     if (!tempRefineCoords) return;
//     setUserLocation({ lat: tempRefineCoords.lat, lng: tempRefineCoords.lng, accuracy: null });
//     // reverse geocode new coords
//     try {
//       const res = await reverseGeocode(tempRefineCoords.lat, tempRefineCoords.lng);
//       setAddr(res);
//     } catch (e) {}
//     setRefineMode(false);
//     setTempRefineCoords(null);
//   };

//   // cancel refine
//   const cancelRefine = () => {
//     setRefineMode(false);
//     setTempRefineCoords(null);
//   };

//   // manual coords entry
//   const manualSetLocation = async () => {
//     const raw = prompt("Enter coords as lat,lng (e.g. 23.2599,77.4126) or a place name:");
//     if (!raw) return;
//     const parts = raw.split(",").map((s) => s.trim());
//     if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
//       const lat = parseFloat(parts[0]),
//         lng = parseFloat(parts[1]);
//       setUserLocation({ lat, lng, accuracy: null });
//       try {
//         const r = await reverseGeocode(lat, lng);
//         setAddr(r);
//       } catch (e) {}
//     } else {
//       // attempt a quick geocode using Nominatim (reuse SearchBar's autocomplete behavior by calling its API)
//       try {
//         const q = encodeURIComponent(raw + " " + (addr?.address?.city || ""));
//         const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`);
//         const arr = await res.json();
//         if (arr && arr[0]) {
//           const lat = parseFloat(arr[0].lat),
//             lng = parseFloat(arr[0].lon);
//           setUserLocation({ lat, lng, accuracy: null });
//           setAddr(arr[0]);
//         } else {
//           alert("Could not find location for that input.");
//         }
//       } catch (err) {
//         alert("Failed to geocode. Try coordinates.");
//       }
//     }
//   };

//   // share / copy location utilities
//   const copyCoords = () => {
//     const text = `${userLocation?.lat || ""},${userLocation?.lng || ""}`;
//     navigator.clipboard?.writeText(text).then(() => alert("Coordinates copied"));
//   };
//   const shareLocation = () => {
//     const url = `https://www.google.com/maps/search/?api=1&query=${userLocation?.lat},${userLocation?.lng}`;
//     if (navigator.share) {
//       navigator.share({ title: "My location", url }).catch(() => {});
//     } else {
//       navigator.clipboard?.writeText(url).then(() => alert("Location URL copied"));
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header + search */}
//       <div className="p-5 border-b bg-white/70 backdrop-blur-md">
//         <TypingHeader />
//         <div className="mt-3 max-w-3xl">
//           <SearchBar value={query} onChange={setQuery} onSelect={handleSearchSelect} userLocation={userLocation} />
//         </div>
//       </div>

//       {/* main area: left narrow toolbar, center map, right full-height list */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* LEFT: narrow toolbar with icon filters, refine and manual set */}
//         <div className="w-[76px] bg-white/75 backdrop-blur-md border-r flex flex-col items-center py-4 justify-between">
//           <div className="flex flex-col gap-3 items-center">
//             <button
//               onClick={() => setFilters((f) => ({ ...f, hospital: !f.hospital }))}
//               title="Hospitals"
//               className={`p-3 rounded-lg transition ${filters.hospital ? "bg-red-50 text-red-600" : "text-slate-400"}`}
//             >
//               <Hospital />
//             </button>

//             <button
//               onClick={() => setFilters((f) => ({ ...f, police: !f.police }))}
//               title="Police"
//               className={`p-3 rounded-lg transition ${filters.police ? "bg-blue-50 text-blue-600" : "text-slate-400"}`}
//             >
//               <Shield />
//             </button>

//             <button
//               onClick={() => setFilters((f) => ({ ...f, ngo: !f.ngo }))}
//               title="NGOs"
//               className={`p-3 rounded-lg transition ${filters.ngo ? "bg-pink-50 text-pink-600" : "text-slate-400"}`}
//             >
//               <HeartHandshake />
//             </button>

//             <button
//               onClick={() => setFilters((f) => ({ ...f, shelter: !f.shelter }))}
//               title="Shelters"
//               className={`p-3 rounded-lg transition ${filters.shelter ? "bg-green-50 text-green-600" : "text-slate-400"}`}
//             >
//               <Home />
//             </button>

//             {/* refine pin toggle */}
//             <button
//               onClick={() => {
//                 setRefineMode((s) => !s);
//                 setTempRefineCoords(null);
//               }}
//               title="Refine location (click map)"
//               className={`p-2 mt-4 rounded-md text-sm ${refineMode ? "bg-yellow-100 text-yellow-700" : "text-slate-500"}`}
//             >
//               <div className="flex flex-col items-center">
//                 <MapPin />
//                 <div style={{ fontSize: 10 }}>Refine</div>
//               </div>
//             </button>

//             {/* manual entry */}
//             <button onClick={manualSetLocation} title="Set location manually" className="p-2 mt-2 rounded-md text-xs text-slate-600 border px-2">
//               Manual
//             </button>
//           </div>

//           {/* save/cancel refine */}
//           <div className="mb-4 flex flex-col gap-2">
//             {tempRefineCoords && (
//               <>
//                 <button onClick={acceptRefine} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm">Save</button>
//                 <button onClick={cancelRefine} className="px-3 py-1 rounded-lg bg-white border text-sm">Cancel</button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* CENTER: Map */}
//         <div className="flex-1 relative">
//           <MapView
//             ref={mapCompRef}
//             userLocation={userLocation}
//             query={selectedSearch}
//             radius={radius}
//             filters={filters}
//             onPlacesUpdate={handlePlacesUpdate}
//             refineMode={refineMode}
//             onRefineComplete={handleRefineComplete}
//           />

//           {/* small address card bottom-left */}
//           <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg shadow px-3 py-2 text-sm w-64">
//             <div className="font-medium text-slate-800">{addr?.display_name ? addr.display_name.split(",")[0] : "Unknown address"}</div>
//             <div className="text-xs text-slate-500 mt-1">
//               {userLocation?.accuracy ? `Accuracy ±${Math.round(userLocation.accuracy)} m` : "Accuracy unknown"}
//             </div>
//             <div className="mt-2 flex gap-2">
//               <button onClick={copyCoords} className="text-xs px-2 py-1 border rounded">Copy</button>
//               <button onClick={shareLocation} className="text-xs px-2 py-1 border rounded">Share</button>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: full-height list (top to bottom) */}
//         <div className="w-[360px] bg-white/90 backdrop-blur-md border-l flex flex-col">
//           <div className="px-4 py-3 border-b">
//             <div className="font-semibold text-slate-800">Nearby Safe Places</div>
//             <div className="text-xs text-slate-500">{nearbyPlaces.length} found</div>
//           </div>

//           <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
//             {nearbyPlaces.length === 0 ? (
//               <div className="text-sm text-slate-500 mt-3">No safe places nearby.</div>
//             ) : (
//               nearbyPlaces.map((p) => (
//                 <div key={p.id} onClick={() => handleCardClick(p)}>
//                   <SafePlaceCard place={p} route={p._route} />
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// latest working code
// // src/pages/SafeSpaceLocator.jsx
// import React, { useEffect, useState, useRef } from "react";
// import TypingHeader from "../components/TypingHeader";
// import SearchBar from "../components/SearchBar";
// import MapView from "../components/MapView";
// import SafePlaceCard from "../components/SafePlaceCard";
// import { reverseGeocode } from "../utils/geocode";

// export default function SafeSpaceLocator() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [radius, setRadius] = useState(8000);
//   const [query, setQuery] = useState("");
//   const [selectedSearch, setSelectedSearch] = useState(null);
//   const [filters, setFilters] = useState({
//     hospital: true,
//     police: true,
//     ngo: true,
//     shelter: true,
//   });
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);
//   const [addr, setAddr] = useState(null);
//   const watchIdRef = useRef(null);

//   // 🛰️ Get accurate location and keep updating
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setUserLocation({ lat: 20.5937, lng: 78.9629 });
//       return;
//     }

//     const opts = { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 };
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude, accuracy } = pos.coords;
//         setUserLocation({ lat: latitude, lng: longitude, accuracy });
//         reverseGeocode(latitude, longitude).then(setAddr).catch(() => {});
//       },
//       (err) => {
//         console.warn("Geo error:", err);
//         setUserLocation({ lat: 20.5937, lng: 78.9629 });
//       },
//       opts
//     );

//     watchIdRef.current = navigator.geolocation.watchPosition(
//       (pos) => {
//         const { latitude, longitude, accuracy } = pos.coords;
//         setUserLocation({ lat: latitude, lng: longitude, accuracy });
//       },
//       () => {},
//       { enableHighAccuracy: true, maximumAge: 5000, distanceFilter: 10 }
//     );

//     return () => {
//       if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
//     };
//   }, []);

//   // 🧭 Handle search selection (from SearchBar)
//   const handleSearchSelect = (sel) => {
//     if (!sel) return;
//     if (typeof sel === "string") {
//       setQuery(sel);
//       setSelectedSearch({ raw: sel });
//     } else {
//       setQuery(sel.display_name || "");
//       setSelectedSearch(sel);
//     }
//   };

//   return (
//     <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-[#eef3ff] to-white">
//       <div className="max-w-7xl mx-auto">
//         <TypingHeader />
//         <SearchBar
//           value={query}
//           onChange={setQuery}
//           onSelect={handleSearchSelect}
//           userLocation={userLocation}
//         />

//         <div className="grid lg:grid-cols-4 gap-6 mt-6">
//           <div className="lg:col-span-3">
//             <MapView
//               userLocation={userLocation}
//               query={selectedSearch}
//               radius={radius}
//               filters={filters}
//               onPlacesUpdate={(places) => setNearbyPlaces(places)}
//             />
//             <div className="mt-3 text-sm text-slate-600">
//               📍 {addr?.display_name || "Fetching location..."}{" "}
//               {userLocation?.accuracy ? ` • accuracy ±${Math.round(userLocation.accuracy)}m` : ""}
//             </div>
//           </div>

//           {/* ✅ Sidebar with filters + list */}
//           <aside className="space-y-4">
//             <div className="glass p-4 rounded-xl shadow-md">
//               <div className="flex items-center justify-between">
//                 <div className="font-semibold">Filters</div>
//                 <div className="text-xs text-slate-500">{nearbyPlaces.length} found</div>
//               </div>

//               <div className="mt-3 flex flex-col gap-2">
//                 {Object.entries(filters).map(([key, val]) => (
//                   <label key={key} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={val}
//                       onChange={() => setFilters((f) => ({ ...f, [key]: !f[key] }))}
//                     />
//                     {key.charAt(0).toUpperCase() + key.slice(1)}
//                   </label>
//                 ))}
//                 <label className="flex items-center gap-2 mt-2 text-sm text-slate-600">
//                   Radius
//                 </label>
//                 <select
//                   value={radius}
//                   onChange={(e) => setRadius(Number(e.target.value))}
//                   className="mt-1 border rounded px-2 py-1"
//                 >
//                   <option value={2000}>2 km</option>
//                   <option value={5000}>5 km</option>
//                   <option value={8000}>8 km</option>
//                 </select>
//               </div>
//             </div>

//             <div className="glass p-3 rounded-xl max-h-[60vh] overflow-auto space-y-3 shadow-md">
//               <div className="font-semibold">Nearby Safe Places</div>
//               {nearbyPlaces.length === 0 ? (
//                 <div className="text-sm text-slate-500 mt-2">No safe places in range.</div>
//               ) : (
//                 nearbyPlaces.map((p) => (
//                   <SafePlaceCard key={p.id} place={p} route={p._route} />
//                 ))
//               )}
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }
