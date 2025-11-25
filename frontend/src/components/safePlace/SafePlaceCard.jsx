// src/components/SafePlaceCard.jsx
import React from "react";
import { MapPin, Hospital, ShieldCheck } from "lucide-react";

// helper: distance in km between 2 coords
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const iconFor = (cat) => {
  if (/hospital/i.test(cat)) return <Hospital className="text-red-500" />;
  if (/police|thana/i.test(cat)) return <ShieldCheck className="text-blue-600" />;
  return <MapPin className="text-indigo-500" />;
};

export default function SafePlaceCard({ place, route, userLocation }) {
  // compute distance & ETA if userLocation available
  let approx = null;
  if (userLocation && place.lat && place.lng) {
    const d = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      place.lat,
      place.lng
    );
    const eta = (d / 40) * 60; // 40 km/h avg
    approx = `${d.toFixed(1)} km away • ~${eta.toFixed(0)} min`;
  }

  return (
    <div className="glass p-3 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="p-2 rounded-lg bg-white/60">{iconFor(place.category)}</div>

      <div className="flex-1">
        <div className="font-semibold text-slate-900">{place.name}</div>
        <div className="text-sm text-slate-600">
          {place.category} • {place.address}
        </div>

        {/* from ORS route data if available */}
        {route && (
          <div className="mt-1 text-sm text-slate-700">
            Distance:{" "}
            <strong>{(route.distance / 1000).toFixed(2)} km</strong> • ETA:{" "}
            <strong>{Math.round(route.duration / 60)} min</strong>
          </div>
        )}

        {/* fallback local calculation */}
        {approx && !route && (
          <div className="text-xs text-slate-500 mt-1">{approx}</div>
        )}
      </div>

      <div className="flex flex-col gap-2 items-end">
        {place.phone ? (
          <a
            className="text-sm text-slate-700 underline"
            href={`tel:${place.phone}`}
          >
            Call
          </a>
        ) : (
          <span className="text-sm text-slate-400">No phone</span>
        )}
      </div>
    </div>
  );
}
