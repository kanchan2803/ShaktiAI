// src/components/MapView.jsx
import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchNearby } from "../../utils/overpass";
import { getRoute } from "../../utils/ors";

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], 14, { animate: true });
  }, [center]);
  return null;
}

const createDivIcon = (emoji = "📍", color = "#1e3a8a") =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3);">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });

const MapView = React.forwardRef(function MapView(
  { userLocation, query, radius = 8000, filters = {}, onPlacesUpdate, refineMode = false, onRefineComplete },
  ref
) {
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(false);
  const [tempPin, setTempPin] = useState(null);
  const mapRef = useRef();

  useImperativeHandle(ref, () => ({
    flyToPlace(place) {
      try {
        const map = mapRef.current;
        if (!map || !place || !place.coords) return;
        const { lat, lng } = place.coords;
        map.flyTo([lat, lng], 15, { animate: true });
        const content = `<div style="min-width:160px"><strong>${place.name || "Place"}</strong><div style="font-size:12px;color:#374151">${place.category || ""}</div></div>`;
        L.popup({ maxWidth: 240 }).setLatLng([lat, lng]).setContent(content).openOn(map);
      } catch (err) {
        console.warn("flyToPlace failed", err);
      }
    },
  }));

  // Fetch nearby safe places
  useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    (async () => {
      try {
        const safeRadius = Math.min(radius || 1000, 5000);
        const data = await fetchNearby(userLocation.lat, userLocation.lng, safeRadius);

        const filtered = (data || []).filter((p) => {
          if (/hospital/i.test(p.category)) return filters.hospital !== false;
          if (/police/i.test(p.category)) return filters.police !== false;
          if (/ngo|social/i.test(p.category)) return filters.ngo !== false;
          if (/shelter|support/i.test(p.category)) return filters.shelter !== false;
          return false;
        });

        const enriched = filtered
          .map((p) => {
            const dx = (p.coords.lat - userLocation.lat) ** 2 + (p.coords.lng - userLocation.lng) ** 2;
            return { ...p, _d: dx };
          })
          .sort((a, b) => a._d - b._d)
          .slice(0, 40);

        setPlaces(enriched);
        onPlacesUpdate && onPlacesUpdate(enriched);

        // 🔹 NEW: Fetch route for ALL safe places (not only top 5)
        for (const p of enriched) {
          try {
            const r = await getRoute(userLocation, p.coords);
            if (r) {
              setRoutes((prev) => ({ ...prev, [p.id]: r }));
              p._route = r;
            }
          } catch (err) {
            console.warn("route error for", p.name);
          }
        }
      } catch (err) {
        console.error("Overpass fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userLocation, radius, JSON.stringify(filters)]);

  // Query search route logic (unchanged)
  useEffect(() => {
    if (!query || !query.lat || !userLocation) return;
    (async () => {
      try {
        const r = await getRoute(userLocation, { lat: query.lat, lng: query.lng });
        if (r) {
          setRoutes((prev) => ({ ...prev, search: r }));
          const coords = r.geometry.coordinates.map((c) => [c[1], c[0]]);
          if (coords.length && mapRef.current) {
            mapRef.current.fitBounds(coords, { padding: [40, 40] });
          } else {
            mapRef.current?.flyTo([query.lat, query.lng], 14);
          }
        }
      } catch (err) {
        console.warn("ORS route failed", err);
      }
    })();
  }, [query, userLocation]);

  // Refine click logic (unchanged)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    function onMapClick(e) {
      if (!refineMode) return;
      const { lat, lng } = e.latlng;
      setTempPin({ lat, lng });
      onRefineComplete && onRefineComplete({ lat, lng });
    }
    map.on("click", onMapClick);
    return () => map.off("click", onMapClick);
  }, [refineMode, onRefineComplete]);

  const tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative h-full">
      <MapContainer
        center={[userLocation?.lat || 20.5937, userLocation?.lng || 78.9629]}
        zoom={13}
        whenCreated={(map) => (mapRef.current = map)}
        className="h-[80vh] w-full rounded-2xl shadow-lg border border-gray-200"
      >
        <TileLayer url={tileUrl} attribution="© OpenStreetMap, © CartoDB" />
        <Recenter center={userLocation} />

        {/* User marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createDivIcon("🧍", "#e11d48")}>
              <Popup>
                <strong>Your location</strong>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radius}
              pathOptions={{ color: "#60a5fa", fillColor: "#93c5fd", fillOpacity: 0.08 }}
            />
          </>
        )}

        {/* Refine temporary pin */}
        {tempPin && (
          <Marker position={[tempPin.lat, tempPin.lng]} icon={createDivIcon("📍", "#f59e0b")}>
            <Popup>
              <strong>Refined pin</strong>
            </Popup>
          </Marker>
        )}

        {/* 🔹 NEW: Draw routes to all safe places */}
        {Object.entries(routes).map(([id, r]) =>
          r?.geometry?.coordinates ? (
            <Polyline
              key={id}
              positions={r.geometry.coordinates.map((c) => [c[1], c[0]])}
              pathOptions={{ color: "#4ade80", weight: 4, opacity: 0.7 }} // soft green color
            />
          ) : null
        )}

        {/* 🔹 Keep all markers (same as before) */}
        {places.map((p) => {
          let emoji = "📍", color = "#1e3a8a";
          if (/hospital/i.test(p.category)) { emoji = "🏥"; color = "#dc2626"; }
          else if (/police/i.test(p.category)) { emoji = "🛡️"; color = "#2563eb"; }
          else if (/ngo/i.test(p.category)) { emoji = "💗"; color = "#db2777"; }
          else if (/shelter/i.test(p.category)) { emoji = "🏠"; color = "#16a34a"; }

          return (
            <Marker key={p.id} position={[p.coords.lat, p.coords.lng]} icon={createDivIcon(emoji, color)}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{p.category}</div>
                  {routes[p.id] ? (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#334155" }}>
                      {(routes[p.id].distance / 1000).toFixed(2)} km • {Math.round(routes[p.id].duration / 60)} min
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>Route calculating…</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Keep search route and marker (unchanged) */}
        {routes.search && routes.search.geometry && (
          <>
            <Polyline
              positions={routes.search.geometry.coordinates.map((c) => [c[1], c[0]])}
              pathOptions={{ color: "#ef4444", weight: 5, opacity: 0.95 }}
            />
            {query && query.lat && (
              <Marker position={[query.lat, query.lng]} icon={createDivIcon("📍", "#ef4444")}>
                <Popup>
                  <strong>{query.display_name || "Destination"}</strong>
                  {routes.search.distance && (
                    <div style={{ fontSize: 12, color: "#334155" }}>
                      {(routes.search.distance / 1000).toFixed(2)} km • {Math.round(routes.search.duration / 60)} min
                    </div>
                  )}
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>

      {loading && (
        <div className="absolute top-2 right-2 bg-white/90 rounded px-3 py-1 text-sm shadow">
          Loading nearby safe spaces...
        </div>
      )}
    </div>
  );
});

export default MapView;

// // src/components/MapView.jsx
// import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { fetchNearby } from "../utils/overpass";
// import { getRoute } from "../utils/ors";

// /* ---------------- RE-CENTER COMPONENT ---------------- */
// function Recenter({ center }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center) map.flyTo([center.lat, center.lng], 14, { animate: true });
//   }, [center]);
//   return null;
// }

// /* ---------------- CUSTOM ICON MAKER ---------------- */
// const createDivIcon = (emoji = "📍", color = "#1e3a8a") =>
//   L.divIcon({
//     className: "custom-marker",
//     html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3);">${emoji}</div>`,
//     iconSize: [34, 34],
//     iconAnchor: [17, 34],
//   });

// /**
//  * MapView
//  *
//  * Props:
//  * - userLocation: {lat,lng,accuracy}
//  * - query: {lat,lng,display_name} | null   (when user selects search result)
//  * - radius: number
//  * - filters: { hospital, police, ngo, shelter }
//  * - onPlacesUpdate(places) callback
//  * - refineMode: boolean (when true, next map click will provide coords)
//  * - onRefineComplete(coords) callback
//  *
//  * Exposes methods via ref:
//  * - flyToPlace(place) // place object with coords
//  */
// const MapView = React.forwardRef(function MapView(
//   { userLocation, query, radius = 8000, filters = {}, onPlacesUpdate, refineMode = false, onRefineComplete },
//   ref
// ) {
//   const [places, setPlaces] = useState([]);
//   const [routes, setRoutes] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [tempPin, setTempPin] = useState(null); // for refine mode
//   const mapRef = useRef();

//   // store a lightweight place index to lookup coords by id
//   const placesRef = useRef({});

//   // expose flyToPlace via ref
//   useImperativeHandle(ref, () => ({
//     flyToPlace(place) {
//       try {
//         const map = mapRef.current;
//         if (!map || !place || !place.coords) return;
//         const { lat, lng } = place.coords;
//         map.flyTo([lat, lng], 15, { animate: true });
//         // open a small popup at that location
//         const content = `<div style="min-width:160px"><strong>${place.name || "Place"}</strong><div style="font-size:12px;color:#374151">${place.category || ""}</div></div>`;
//         L.popup({ maxWidth: 240 }).setLatLng([lat, lng]).setContent(content).openOn(map);
//       } catch (err) {
//         console.warn("flyToPlace failed", err);
//       }
//     },
//   }));

//   // fetch nearby places (limited & safe)
//   useEffect(() => {
//     if (!userLocation) return;
//     setLoading(true);
//     (async () => {
//       try {
//         // cap radius and limit results to avoid OOM
//         const safeRadius = Math.min(radius || 1000, 5000);
//         const data = await fetchNearby(userLocation.lat, userLocation.lng, safeRadius);

//         // filter by category toggles
//         const filtered = (data || []).filter((p) => {
//           if (/hospital/i.test(p.category)) return filters.hospital !== false;
//           if (/police/i.test(p.category)) return filters.police !== false;
//           if (/ngo|social/i.test(p.category)) return filters.ngo !== false;
//           if (/shelter|support/i.test(p.category)) return filters.shelter !== false;
//           // default show nothing unless matched
//           return false;
//         });

//         // sort by rough straight-line distance and limit to 40
//         const enriched = filtered
//           .map((p) => {
//             const dx = (p.coords.lat - userLocation.lat) ** 2 + (p.coords.lng - userLocation.lng) ** 2;
//             return { ...p, _d: dx };
//           })
//           .sort((a, b) => a._d - b._d)
//           .slice(0, 40);

//         // fill placesRef for quick lookup
//         placesRef.current = Object.fromEntries(enriched.map((p) => [p.id, p]));

//         setPlaces(enriched);
//         onPlacesUpdate && onPlacesUpdate(enriched);

//         // fetch short routes for top 5 (async, but safe)
//         for (const p of enriched.slice(0, 5)) {
//           try {
//             const r = await getRoute(userLocation, p.coords);
//             if (r) setRoutes((prev) => ({ ...prev, [p.id]: r }));
//             // attach route on place for sidebar quick display (non-persistent)
//             p._route = r;
//           } catch (err) {
//             // ignore route errors quietly
//             // console.warn("route error", err);
//           }
//         }
//       } catch (err) {
//         console.error("Overpass fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [userLocation, radius, JSON.stringify(filters)]); // watch filters reliably

//   // when parent sends a query (search select), compute route and flyTo
//   useEffect(() => {
//     if (!query || !query.lat || !userLocation) return;
//     (async () => {
//       try {
//         const r = await getRoute(userLocation, { lat: query.lat, lng: query.lng });
//         if (r) {
//           setRoutes((prev) => ({ ...prev, search: r }));
//           // fit map to route bounds if possible
//           const coords = r.geometry.coordinates.map((c) => [c[1], c[0]]);
//           if (coords.length && mapRef.current) {
//             mapRef.current.fitBounds(coords, { padding: [40, 40] });
//           } else {
//             mapRef.current?.flyTo([query.lat, query.lng], 14);
//           }
//         }
//       } catch (err) {
//         console.warn("ORS route failed", err);
//       }
//     })();
//   }, [query, userLocation]);

//   // handle refine mode clicking: parent sets refineMode true and onRefineComplete provided
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     function onMapClick(e) {
//       if (!map._container) return;
//       // When refineMode is active, set a temp pin and notify parent
//       if (!refineMode) return;
//       const { lat, lng } = e.latlng;
//       setTempPin({ lat, lng });
//       // parent can decide to accept — we immediately call back
//       onRefineComplete && onRefineComplete({ lat, lng });
//     }

//     map.on("click", onMapClick);
//     return () => map.off("click", onMapClick);
//   }, [refineMode, onRefineComplete]);

//   // Choose a colorful basemap (Carto Voyager)
//   const tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

//   return (
//     <div className="relative h-full">
//       <MapContainer
//         center={[userLocation?.lat || 20.5937, userLocation?.lng || 78.9629]}
//         zoom={13}
//         whenCreated={(map) => (mapRef.current = map)}
//         className="h-[80vh] w-full rounded-2xl shadow-lg border border-gray-200"
//       >
//         <TileLayer url={tileUrl} attribution="© OpenStreetMap, © CartoDB" />
//         <Recenter center={userLocation} />

//         {/* user location */}
//         {userLocation && (
//           <>
//             <Marker position={[userLocation.lat, userLocation.lng]} icon={createDivIcon("🧍", "#e11d48")}>
//               <Popup>
//                 <div style={{ minWidth: 180 }}>
//                   <strong>Your location</strong>
//                   <div style={{ fontSize: 12, color: "#334155" }}>
//                     {userLocation.accuracy ? `Accuracy ±${Math.round(userLocation.accuracy)} m` : ""}
//                   </div>
//                 </div>
//               </Popup>
//             </Marker>
//             <Circle
//               center={[userLocation.lat, userLocation.lng]}
//               radius={radius}
//               pathOptions={{ color: "#60a5fa", fillColor: "#93c5fd", fillOpacity: 0.08 }}
//             />
//           </>
//         )}

//         {/* temp pin (if refine mode used) */}
//         {tempPin && (
//           <Marker position={[tempPin.lat, tempPin.lng]} icon={createDivIcon("📍", "#f59e0b")}>
//             <Popup>
//               <strong>Refined pin</strong>
//               <div style={{ fontSize: 12, color: "#334155" }}>Click Save in sidebar to use this as your location.</div>
//             </Popup>
//           </Marker>
//         )}

//         {/* place markers */}
//         {places.map((p) => {
//           let emoji = "📍",
//             color = "#1e3a8a";
//           if (/hospital/i.test(p.category)) {
//             emoji = "🏥";
//             color = "#dc2626";
//           } else if (/police/i.test(p.category)) {
//             emoji = "🛡️";
//             color = "#2563eb";
//           } else if (/ngo/i.test(p.category)) {
//             emoji = "💗";
//             color = "#db2777";
//           } else if (/shelter/i.test(p.category)) {
//             emoji = "🏠";
//             color = "#16a34a";
//           }

//           return (
//             <Marker key={p.id} position={[p.coords.lat, p.coords.lng]} icon={createDivIcon(emoji, color)}>
//               <Popup>
//                 <div style={{ minWidth: 220 }}>
//                   <div style={{ fontWeight: 600 }}>{p.name}</div>
//                   <div style={{ fontSize: 12, color: "#475569" }}>{p.category}</div>
//                   {routes[p.id] ? (
//                     <div style={{ marginTop: 8, fontSize: 12, color: "#334155" }}>
//                       {(routes[p.id].distance / 1000).toFixed(2)} km • {Math.round(routes[p.id].duration / 60)} min
//                     </div>
//                   ) : (
//                     <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>Route calculating…</div>
//                   )}
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}

//         {/* route for search (if present) */}
//         {/* {routes.search && routes.search.geometry && (
//           <Polyline positions={routes.search.geometry.coordinates.map((c) => [c[1], c[0]])} pathOptions={{ color: "#ef4444", weight: 5, opacity: 0.95 }} />
//         )} */}
//         {/* route + destination marker for search */}
//         {routes.search && routes.search.geometry && (
//           <>
//             <Polyline
//               positions={routes.search.geometry.coordinates.map((c) => [c[1], c[0]])}
//               pathOptions={{ color: "#ef4444", weight: 5, opacity: 0.95 }}
//             />
//             {query && query.lat && (
//               <Marker position={[query.lat, query.lng]} icon={createDivIcon("📍", "#ef4444")}>
//                 <Popup>
//                   <strong>{query.display_name || "Destination"}</strong>
//                   {routes.search.distance && (
//                     <div style={{ fontSize: 12, color: "#334155" }}>
//                       {(routes.search.distance / 1000).toFixed(2)} km • {Math.round(routes.search.duration / 60)} min
//                     </div>
//                   )}
//                 </Popup>
//               </Marker>
//             )}
//           </>
//         )}

//       </MapContainer>

//       {loading && (
//         <div className="absolute top-2 right-2 bg-white/90 rounded px-3 py-1 text-sm shadow">
//           Loading nearby safe spaces...
//         </div>
//       )}
//     </div>
//   );
// });

// export default MapView;



// latest working code
// // src/components/MapView.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { fetchNearby } from "../utils/overpass";
// import { getRoute } from "../utils/ors";

// // 🧭 Recenter utility
// function Recenter({ center }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center) map.flyTo([center.lat, center.lng], 14, { animate: true });
//   }, [center]);
//   return null;
// }

// // 🧿 Custom icon generator
// const createDivIcon = (emoji = "📍", color = "#1e3a8a") =>
//   L.divIcon({
//     className: "custom-marker",
//     html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3);">${emoji}</div>`,
//     iconSize: [34, 34],
//     iconAnchor: [17, 34],
//   });

// export default function MapView({ userLocation, query, radius, filters, onPlacesUpdate }) {
//   const [places, setPlaces] = useState([]);
//   const [routes, setRoutes] = useState({});
//   const [loading, setLoading] = useState(false);
//   const mapRef = useRef();

//   // 🗺️ Fetch nearby places
//   useEffect(() => {
//     if (!userLocation) return;
//     setLoading(true);

//     (async () => {
//       try {
//         const data = await fetchNearby(userLocation.lat, userLocation.lng, radius);
//         const filtered = data.filter((p) => {
//           if (/hospital/i.test(p.category)) return filters.hospital;
//           if (/police/i.test(p.category)) return filters.police;
//           if (/ngo|social/i.test(p.category)) return filters.ngo;
//           if (/shelter|support/i.test(p.category)) return filters.shelter;
//           return false;
//         });
//         setPlaces(filtered);
//         onPlacesUpdate && onPlacesUpdate(filtered);

//         // Fetch routes for top 5
//         for (const p of filtered.slice(0, 5)) {
//           try {
//             const r = await getRoute(userLocation, p.coords);
//             if (r) setRoutes((prev) => ({ ...prev, [p.id]: r }));
//           } catch (err) {}
//         }
//       } catch (err) {
//         console.error("Overpass API failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [userLocation, radius, filters]);

//   // 🚗 Handle selected search (show route)
//   useEffect(() => {
//     if (!query || !query.lat) return;
//     (async () => {
//       const r = await getRoute(userLocation, { lat: query.lat, lng: query.lng });
//       if (r) {
//         setRoutes((prev) => ({ ...prev, search: r }));
//         mapRef.current?.flyTo([query.lat, query.lng], 14);
//       }
//     })();
//   }, [query]);

//   return (
//     <div className="relative">
//       <MapContainer
//         center={[userLocation?.lat || 20.5937, userLocation?.lng || 78.9629]}
//         zoom={13}
//         whenCreated={(map) => (mapRef.current = map)}
//         className="h-[80vh] w-full rounded-2xl shadow-lg border border-gray-200"
//       >
//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
//           attribution="© OpenStreetMap, © CartoDB"
//         />
//         <Recenter center={userLocation} />

//         {/* 🧍User location */}
//         {userLocation && (
//           <>
//             <Marker position={[userLocation.lat, userLocation.lng]} icon={createDivIcon("🧍", "#e11d48")}>
//               <Popup>You are here</Popup>
//             </Marker>
//             <Circle
//               center={[userLocation.lat, userLocation.lng]}
//               radius={radius}
//               pathOptions={{ color: "#60a5fa", fillColor: "#93c5fd", fillOpacity: 0.1 }}
//             />
//           </>
//         )}

//         {/* 📍 Safe spaces */}
//         {places.map((p) => {
//           let emoji = "📍", color = "#1e3a8a";
//           if (/hospital/i.test(p.category)) { emoji = "🏥"; color = "#dc2626"; }
//           else if (/police/i.test(p.category)) { emoji = "🛡️"; color = "#2563eb"; }
//           else if (/ngo/i.test(p.category)) { emoji = "💗"; color = "#db2777"; }
//           else if (/shelter/i.test(p.category)) { emoji = "🏠"; color = "#16a34a"; }

//           return (
//             <Marker key={p.id} position={[p.coords.lat, p.coords.lng]} icon={createDivIcon(emoji, color)}>
//               <Popup>
//                 <strong>{p.name}</strong><br />
//                 {p.category}<br />
//                 {routes[p.id]
//                   ? `${(routes[p.id].distance / 1000).toFixed(2)} km • ${Math.round(routes[p.id].duration / 60)} min`
//                   : "Loading route..."}
//               </Popup>
//             </Marker>
//           );
//         })}

//         {/* 🛣️ Routes */}
//         {Object.entries(routes).map(([id, r]) => {
//           if (!r?.geometry) return null;
//           const coords = r.geometry.coordinates.map((c) => [c[1], c[0]]);
//           return <Polyline key={id} positions={coords} pathOptions={{ color: "#1e3a8a", weight: 5, opacity: 0.9 }} />;
//         })}
//       </MapContainer>

//       {loading && (
//         <div className="absolute top-2 right-2 bg-white/80 rounded px-3 py-1 text-sm shadow">
//           Loading nearby safe spaces...
//         </div>
//       )}
//     </div>
//   );
// }



// extra featured code
// // components/MapView.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Circle,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import {
//   ShieldCheck,
//   Hospital,
//   HeartHandshake,
//   MapPin,
//   Landmark,
// } from "lucide-react";
// import { fetchNearby } from "../utils/overpass";
// import { getRoute } from "../utils/ors";
// import "leaflet/dist/leaflet.css";

// // ✅ Default marker setup
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // ✅ Smooth map recenter
// function Recenter({ center }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center) map.flyTo([center.lat, center.lng], 14, { animate: true });
//   }, [center]);
//   return null;
// }

// // ✅ Custom Lucide icons by category
// const categoryIcon = (cat) => {
//   if (/hospital/i.test(cat))
//     return <Hospital className="text-red-500 w-5 h-5" />;
//   if (/police|thana/i.test(cat))
//     return <ShieldCheck className="text-blue-600 w-5 h-5" />;
//   if (/ngo|social/i.test(cat))
//     return <HeartHandshake className="text-pink-500 w-5 h-5" />;
//   if (/government|office/i.test(cat))
//     return <Landmark className="text-green-600 w-5 h-5" />;
//   return <MapPin className="text-indigo-500 w-5 h-5" />;
// };

// // ✅ Custom circle marker (for user + safe spaces)
// const createDivIcon = (emoji = "📍", color = "#1e3a8a") =>
//   L.divIcon({
//     className: "custom-marker",
//     html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3);">${emoji}</div>`,
//     iconSize: [34, 34],
//     iconAnchor: [17, 34],
//   });

// export default function MapView({ userLocation, query, radius = 8000 }) {
//   const [places, setPlaces] = useState([]);
//   const [routes, setRoutes] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     hospital: true,
//     police: true,
//     ngo: true,
//   });
//   const [suggestions, setSuggestions] = useState([]);
//   const [searchInput, setSearchInput] = useState("");
//   const mapRef = useRef();

//   // ✅ Get precise geolocation once
//   useEffect(() => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude, accuracy } = pos.coords;
//         console.log("📍 Accurate location (±m):", accuracy);
//       },
//       (err) => console.warn("Geo error:", err),
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   // ✅ Fetch nearby safe places
//   useEffect(() => {
//     if (!userLocation) return;
//     setLoading(true);

//     (async () => {
//       try {
//         const data = await fetchNearby(
//           userLocation.lat,
//           userLocation.lng,
//           radius
//         );
//         if (!data?.length) {
//           setPlaces([]);
//           setLoading(false);
//           return;
//         }
//         const sorted = data
//           .map((p) => ({
//             ...p,
//             _d: Math.sqrt(
//               (p.coords.lat - userLocation.lat) ** 2 +
//                 (p.coords.lng - userLocation.lng) ** 2
//             ),
//           }))
//           .sort((a, b) => a._d - b._d);

//         setPlaces(sorted);
//         setLoading(false);

//         // Fetch routes for top 5
//         for (const p of sorted.slice(0, 5)) {
//           try {
//             const r = await getRoute(userLocation, p.coords);
//             if (r) setRoutes((prev) => ({ ...prev, [p.id]: r }));
//           } catch (err) {
//             console.warn("Route error for:", p.name, err);
//           }
//         }
//       } catch (err) {
//         console.error("Overpass API error:", err);
//         setLoading(false);
//       }
//     })();
//   }, [userLocation, radius]);

//   // ✅ Autocomplete suggestions
//   useEffect(() => {
//     if (searchInput.length < 3) return setSuggestions([]);
//     const controller = new AbortController();
//     const q = encodeURIComponent(searchInput);
//     fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${q}&addressdetails=1&limit=5`,
//       { signal: controller.signal }
//     )
//       .then((r) => r.json())
//       .then(setSuggestions)
//       .catch(() => {});
//     return () => controller.abort();
//   }, [searchInput]);

//   // ✅ Handle search selection
//   const handleSearchSelect = async (s) => {
//     setSearchInput(s.display_name);
//     setSuggestions([]);
//     const lat = parseFloat(s.lat),
//       lng = parseFloat(s.lon);
//     const temp = {
//       id: "search",
//       name: s.display_name,
//       category: "Search Result",
//       coords: { lat, lng },
//     };
//     setPlaces((prev) => [temp, ...prev]);
//     const r = await getRoute(userLocation, { lat, lng });
//     if (r) setRoutes((prev) => ({ ...prev, search: r }));
//     mapRef.current?.flyTo([lat, lng], 14);
//   };

//   // ✅ Filter places
//   const filteredPlaces = places.filter((p) => {
//     if (/hospital/i.test(p.category)) return filters.hospital;
//     if (/police/i.test(p.category)) return filters.police;
//     if (/ngo|social/i.test(p.category)) return filters.ngo;
//     return true;
//   });

//   return (
//     <div className="flex flex-col md:flex-row gap-4 mt-4">
//       {/* ✅ Sidebar with search + filters + places */}
//       <div className="w-full md:w-1/3 space-y-4 p-3 bg-white/70 backdrop-blur-md rounded-2xl shadow-md">
//         {/* Search bar with suggestions */}
//         <div className="relative">
//           <input
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             placeholder="Search hospitals, police, NGOs..."
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
//           />
//           {suggestions.length > 0 && (
//             <ul className="absolute z-50 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg w-full max-h-48 overflow-y-auto">
//               {suggestions.map((s) => (
//                 <li
//                   key={s.place_id}
//                   className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//                   onClick={() => handleSearchSelect(s)}
//                 >
//                   {s.display_name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 flex-wrap">
//           {[
//             { key: "hospital", label: "Hospitals" },
//             { key: "police", label: "Police" },
//             { key: "ngo", label: "NGOs" },
//           ].map((f) => (
//             <label
//               key={f.key}
//               className={`px-3 py-1 rounded-full border cursor-pointer ${
//                 filters[f.key]
//                   ? "bg-blue-100 border-blue-500 text-blue-700"
//                   : "bg-gray-100 border-gray-300 text-gray-500"
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={filters[f.key]}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     [f.key]: e.target.checked,
//                   }))
//                 }
//                 className="hidden"
//               />
//               {f.label}
//             </label>
//           ))}
//         </div>

//         {/* List of nearby safe places */}
//         <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-2">
//           {filteredPlaces.map((p) => (
//             <div
//               key={p.id}
//               className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md flex items-start gap-3"
//             >
//               {categoryIcon(p.category)}
//               <div className="flex-1">
//                 <div className="font-semibold text-slate-800">{p.name}</div>
//                 <div className="text-sm text-slate-600">{p.category}</div>
//                 {routes[p.id] && (
//                   <div className="text-xs mt-1 text-slate-500">
//                     {(routes[p.id].distance / 1000).toFixed(2)} km •{" "}
//                     {Math.round(routes[p.id].duration / 60)} min
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Map Area */}
//       <div className="flex-1">
//         <MapContainer
//           center={[userLocation?.lat || 20.5937, userLocation?.lng || 78.9629]}
//           zoom={13}
//           whenCreated={(map) => (mapRef.current = map)}
//           className="h-[80vh] w-full rounded-2xl shadow-lg border border-gray-200"
//           style={{ zIndex: 0 }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution="© OpenStreetMap contributors"
//           />
//           <Recenter center={userLocation} />

//           {/* User location */}
//           {userLocation && (
//             <>
//               <Marker
//                 position={[userLocation.lat, userLocation.lng]}
//                 icon={createDivIcon("👤", "#e11d48")}
//               >
//                 <Popup>You are here</Popup>
//               </Marker>
//               <Circle
//                 center={[userLocation.lat, userLocation.lng]}
//                 radius={radius}
//                 pathOptions={{
//                   color: "#60a5fa",
//                   fillColor: "#93c5fd",
//                   fillOpacity: 0.1,
//                 }}
//               />
//             </>
//           )}

//           {/* Safe spaces */}
//           {filteredPlaces.map((p) => (
//             <Marker
//               key={p.id}
//               position={[p.coords.lat, p.coords.lng]}
//               icon={createDivIcon("🏥", "#1e40af")}
//             >
//               <Popup>
//                 <strong>{p.name}</strong>
//                 <br />
//                 {p.category}
//                 <br />
//                 {routes[p.id]
//                   ? `${(routes[p.id].distance / 1000).toFixed(2)} km • ${Math.round(
//                       routes[p.id].duration / 60
//                     )} min`
//                   : "Loading route..."}
//               </Popup>
//             </Marker>
//           ))}

//           {/* Routes */}
//           {Object.entries(routes).map(([id, r]) => {
//             if (!r?.geometry) return null;
//             const coords = r.geometry.coordinates.map((c) => [c[1], c[0]]);
//             return (
//               <Polyline
//                 key={id}
//                 positions={coords}
//                 pathOptions={{
//                   color: "#1e3a8a",
//                   weight: 5,
//                   opacity: 0.9,
//                 }}
//               />
//             );
//           })}
//         </MapContainer>
//         {loading && (
//           <div className="text-center py-2 text-sm text-slate-600 bg-white/70">
//             Loading nearby safe spaces...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// // components/MapView.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   Circle,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import { fetchNearby } from "../utils/overpass";
// import { getRoute } from "../utils/ors";
// import "leaflet/dist/leaflet.css";

// // ✅ Setup default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // ✅ Component to smoothly recenter map when location changes
// function Recenter({ center }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView([center.lat, center.lng], 14, { animate: true });
//     }
//   }, [center]);
//   return null;
// }

// // ✅ Custom styled marker icon
// const createDivIcon = (color = "#1e3a8a") => {
//   return L.divIcon({
//     className: "custom-marker",
//     html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3);">
//              📍
//            </div>`,
//     iconSize: [34, 34],
//     iconAnchor: [17, 34],
//   });
// };

// export default function MapView({ userLocation, query, radius = 8000 }) {
//   const [places, setPlaces] = useState([]);
//   const [routes, setRoutes] = useState({});
//   const [loading, setLoading] = useState(false);
//   const mapRef = useRef();

//   // ✅ Fetch nearby safe places
//   useEffect(() => {
//     if (!userLocation) return;

//     let active = true;
//     setLoading(true);

//     (async () => {
//       try {
//         const data = await fetchNearby(
//           userLocation.lat,
//           userLocation.lng,
//           radius
//         );

//         if (!active) return;

//         if (!data?.length) {
//           console.warn("⚠️ No POIs found nearby");
//           setPlaces([]);
//           setLoading(false);
//           return;
//         }

//         // Sort by proximity
//         const sorted = data
//           .map((p) => ({
//             ...p,
//             _d: Math.sqrt(
//               Math.pow(p.coords.lat - userLocation.lat, 2) +
//                 Math.pow(p.coords.lng - userLocation.lng, 2)
//             ),
//           }))
//           .sort((a, b) => a._d - b._d);

//         setPlaces(sorted);
//         setLoading(false);

//         // Fetch routes for top 5
//         for (const p of sorted.slice(0, 5)) {
//           try {
//             const r = await getRoute(userLocation, p.coords);
//             if (r) {
//               setRoutes((prev) => ({ ...prev, [p.id]: r }));
//             }
//           } catch (err) {
//             console.warn("Route fetch failed for:", p.name, err);
//           }
//         }
//       } catch (err) {
//         console.error("❌ Error fetching nearby POIs:", err);
//         setLoading(false);
//       }
//     })();

//     return () => {
//       active = false;
//     };
//   }, [userLocation, radius]);

//   // ✅ Handle manual search (geocode)
//   useEffect(() => {
//     if (!query || !userLocation) return;

//     const q = encodeURIComponent(query);
//     const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;

//     fetch(url)
//       .then((r) => r.json())
//       .then(async (res) => {
//         if (res && res[0]) {
//           const lat = parseFloat(res[0].lat),
//             lng = parseFloat(res[0].lon);
//           const temp = {
//             id: "search",
//             name: res[0].display_name,
//             category: "Search Result",
//             coords: { lat, lng },
//           };
//           setPlaces((prev) => [temp, ...prev]);

//           try {
//             const r = await getRoute(userLocation, { lat, lng });
//             if (r) setRoutes((prev) => ({ ...prev, search: r }));
//             mapRef.current?.setView([lat, lng], 14);
//           } catch (err) {
//             console.error("Search route error:", err);
//           }
//         }
//       })
//       .catch((err) => console.warn("Nominatim error:", err));
//   }, [query]);

//   return (
//     <div className="rounded-2xl overflow-hidden shadow-lg border border-white/20">
//       <MapContainer
//         center={[userLocation?.lat || 20.5937, userLocation?.lng || 78.9629]}
//         zoom={13}
//         whenCreated={(map) => (mapRef.current = map)}
//         className="h-[70vh] w-full"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />

//         <Recenter center={userLocation} />

//         {/* User Marker */}
//         {userLocation && (
//           <>
//             <Marker
//               position={[userLocation.lat, userLocation.lng]}
//               icon={createDivIcon("#e11d48")}
//             >
//               <Popup>
//                 <strong>You are here</strong>
//               </Popup>
//             </Marker>

//             <Circle
//               center={[userLocation.lat, userLocation.lng]}
//               radius={radius}
//               pathOptions={{
//                 color: "#3b82f6",
//                 fillColor: "#93c5fd",
//                 fillOpacity: 0.1,
//               }}
//             />
//           </>
//         )}

//         {/* Safe Places */}
//         {places.map((p) => (
//           <Marker
//             key={p.id}
//             position={[p.coords.lat, p.coords.lng]}
//             icon={createDivIcon("#1e40af")}
//           >
//             <Popup>
//               <div className="min-w-[220px]">
//                 <div className="font-semibold">{p.name}</div>
//                 <div className="text-sm text-slate-600">{p.category}</div>
//                 <div className="mt-2 text-xs text-slate-700">
//                   {routes[p.id] ? (
//                     <div>
//                       <strong>Distance:</strong>{" "}
//                       {(routes[p.id].distance / 1000).toFixed(2)} km •{" "}
//                       <strong>ETA:</strong>{" "}
//                       {Math.round(routes[p.id].duration / 60)} min
//                     </div>
//                   ) : (
//                     "Calculating route..."
//                   )}
//                 </div>
//                 <div className="mt-2">
//                   <a
//                     className="text-blue-600 text-sm"
//                     target="_blank"
//                     rel="noreferrer"
//                     href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${p.coords.lat},${p.coords.lng}`}
//                   >
//                     Open in Google Maps
//                   </a>
//                 </div>
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Routes */}
//         {Object.entries(routes).map(([pid, r]) => {
//           if (!r || !r.geometry) return null;
//           const coords = r.geometry.coordinates.map((c) => [c[1], c[0]]);
//           return (
//             <Polyline
//               key={"poly-" + pid}
//               positions={coords}
//               pathOptions={{
//                 color: "#1e3a8a",
//                 weight: 6,
//                 opacity: 0.9,
//               }}
//             />
//           );
//         })}
//       </MapContainer>

//       {loading && (
//         <div className="text-center py-2 text-sm text-slate-600 bg-white/70">
//           Loading nearby safe spaces...
//         </div>
//       )}
//     </div>
//   );
// }
