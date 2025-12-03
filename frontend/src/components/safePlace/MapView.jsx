import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchNearby } from "../../utils/overpass.js";
import { getRoute } from "../../utils/ors.js";

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map center updates and movement events
function MapController({ center, zoom, onMove }) {
  const map = useMap();

  // Handle flying to new center
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom || 14, { animate: true });
    }
  }, [center, zoom, map]);

  // Handle map movement (panning)
  useEffect(() => {
    if (!onMove) return;
    
    const handleMoveEnd = () => {
      const c = map.getCenter();
      onMove({ lat: c.lat, lng: c.lng });
    };

    map.on('moveend', handleMoveEnd);
    return () => map.off('moveend', handleMoveEnd);
  }, [map, onMove]);

  return null;
}

const createDivIcon = (emoji = "📍", color = "#1e3a8a") =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:white;font-weight:600;font-size:13px;border:2px solid white;box-shadow:0 4px 14px rgba(0,0,0,0.3);">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

const MapView = React.forwardRef(function MapView(
  { userLocation, query, radius = 8000, filters = {}, onPlacesUpdate, refineMode, onRefineComplete, onMapMove },
  ref
) {
  const [places, setPlaces] = useState([]);
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(false);
  const [tempPin, setTempPin] = useState(null);
  const mapInstanceRef = useRef(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    flyToPlace(place) {
      const map = mapInstanceRef.current;
      if (!map || !place || !place.coords) return;
      
      const { lat, lng } = place.coords;
      map.flyTo([lat, lng], 16, { animate: true });
      
      setTimeout(() => {
        map.openPopup(
            `<div style="font-weight:bold">${place.name}</div><div style="font-size:12px">${place.category}</div>`, 
            [lat, lng]
        );
      }, 500);
    },
  }));

  // Fetch Nearby Places
  useEffect(() => {
    if (!userLocation) return;
    
    const loadPlaces = async () => {
      setLoading(true);
      try {
        const safeRadius = Math.min(radius || 8000, 20000); // Cap radius
        const data = await fetchNearby(userLocation.lat, userLocation.lng, safeRadius);

        // Filter based on props
        const filtered = (data || []).filter((p) => {
          if (/hospital/i.test(p.category)) return filters.hospital !== false;
          if (/police/i.test(p.category)) return filters.police !== false;
          if (/ngo|social/i.test(p.category)) return filters.ngo !== false;
          if (/shelter|support/i.test(p.category)) return filters.shelter !== false;
          return false;
        });

        // Add distance and sort
        const enriched = filtered.map((p) => {
          const dx = (p.coords.lat - userLocation.lat) ** 2 + (p.coords.lng - userLocation.lng) ** 2;
          return { ...p, _d: dx };
        }).sort((a, b) => a._d - b._d).slice(0, 50);

        setPlaces(enriched);
        if (onPlacesUpdate) onPlacesUpdate(enriched);

        // Calculate routes for top 5 closest places
        enriched.slice(0, 5).forEach(async (p) => {
            try {
                const r = await getRoute(userLocation, p.coords);
                if (r) {
                    setRoutes(prev => ({ ...prev, [p.id]: r }));
                    p._route = r; 
                }
            } catch (e) {
                console.error("Route fetching error:", e);
            }
        });

      } catch (err) {
        console.error("Overpass/Places error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [userLocation, radius, filters.hospital, filters.police, filters.ngo, filters.shelter]);

  // Handle Query (Search Result) Route
  useEffect(() => {
    if (!query || !query.lat || !userLocation) return;
    
    const fetchSearchRoute = async () => {
        try {
            const r = await getRoute(userLocation, { lat: query.lat, lng: query.lng });
            if (r) {
                setRoutes(prev => ({ ...prev, search: r }));
            }
        } catch (e) { console.warn("Search route failed", e); }
    };
    fetchSearchRoute();
  }, [query, userLocation]);

  // Click Handler for Refine Mode
  function LocationMarker() {
    const map = useMap();
    useEffect(() => {
        if (!refineMode) return;
        const handleClick = (e) => {
            const { lat, lng } = e.latlng;
            setTempPin({ lat, lng });
            if (onRefineComplete) onRefineComplete({ lat, lng });
        };
        map.on('click', handleClick);
        return () => map.off('click', handleClick);
    }, [map, refineMode]);
    return null;
  }

  // Determine Map Center
  const mapCenter = query && query.lat ? { lat: query.lat, lng: query.lng } : userLocation;

  return (
    <div className="relative h-full w-full z-0 bg-slate-100">
      <MapContainer
        center={[20.5937, 78.9629]} // India Default
        zoom={5}
        className="h-full w-full outline-none z-0"
        ref={mapInstanceRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController 
            center={mapCenter} 
            zoom={query ? 16 : 14} 
            onMove={onMapMove} 
        />
        <LocationMarker />

        {/* User Location */}
        {userLocation && (
            <>
                <Marker position={[userLocation.lat, userLocation.lng]} icon={createDivIcon("🧍", "#e11d48")}>
                    <Popup>Your Location</Popup>
                </Marker>
                <Circle 
                    center={[userLocation.lat, userLocation.lng]} 
                    radius={radius} 
                    pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1 }} 
                />
            </>
        )}

        {/* Search Result Pin & Route */}
        {query && query.lat && (
             <Marker position={[query.lat, query.lng]} icon={createDivIcon("🎯", "#f59e0b")}>
                <Popup>{query.display_name}</Popup>
             </Marker>
        )}
        {routes.search && routes.search.geometry && (
             <Polyline 
                positions={routes.search.geometry.coordinates.map(c => [c[1], c[0]])}
                pathOptions={{ color: "#f59e0b", weight: 5, opacity: 0.8, dashArray: '10, 10' }}
             />
        )}

        {/* Refine Pin */}
        {tempPin && (
            <Marker position={[tempPin.lat, tempPin.lng]} icon={createDivIcon("📍", "#f59e0b")} />
        )}

        {/* Places Markers & Routes */}
        {places.map((p) => {
            let emoji = "📍", color = "#1e3a8a";
            if (/hospital/i.test(p.category)) { emoji = "🏥"; color = "#dc2626"; }
            else if (/police/i.test(p.category)) { emoji = "🛡️"; color = "#2563eb"; }
            else if (/ngo/i.test(p.category)) { emoji = "💗"; color = "#db2777"; }
            else if (/shelter/i.test(p.category)) { emoji = "🏠"; color = "#16a34a"; }

            return (
                <React.Fragment key={p.id}>
                    <Marker position={[p.coords.lat, p.coords.lng]} icon={createDivIcon(emoji, color)}>
                        <Popup>
                            <div className="font-bold text-sm">{p.name}</div>
                            <div className="text-xs text-slate-500 capitalize">{p.category}</div>
                            {routes[p.id] && (
                                <div className="text-xs mt-1 font-mono">
                                    {(routes[p.id].distance / 1000).toFixed(1)}km • {Math.round(routes[p.id].duration / 60)}min
                                </div>
                            )}
                        </Popup>
                    </Marker>
                    
                    {routes[p.id] && routes[p.id].geometry && (
                        <Polyline 
                            positions={routes[p.id].geometry.coordinates.map(c => [c[1], c[0]])}
                            pathOptions={{ color: color, weight: 3, opacity: 0.5 }}
                        />
                    )}
                </React.Fragment>
            );
        })}

      </MapContainer>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-[400] text-sm font-medium text-blue-800 flex items-center gap-2 border border-blue-100">
           <span className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></span>
           Scanning nearby safe spaces...
        </div>
      )}
    </div>
  );
});

export default MapView;