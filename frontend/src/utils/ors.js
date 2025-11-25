// src/utils/ors.js
const ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

export async function getRoute(origin, destination) {
  const key = import.meta.env.VITE_ORS_API_KEY;
  if (!key) throw new Error("OpenRouteService API key missing. Add VITE_ORS_API_KEY to .env");

  // Basic validation
  if (!origin || !destination || !origin.lat || !origin.lng || !destination.lat || !destination.lng) {
    throw new Error("Invalid coordinates for routing");
  }

  // Avoid identical coordinates
  if (origin.lat === destination.lat && origin.lng === destination.lng) {
    throw new Error("Origin and destination are the same location");
  }

  const body = {
    coordinates: [
      [origin.lng, origin.lat],
      [destination.lng, destination.lat],
    ],
    preference: "fastest",
    instructions: false,
  };

  const res = await fetch(ORS_URL, {
    method: "POST",
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("ORS raw response:", txt);
    throw new Error(`ORS error: ${res.status} - ${txt}`);
  }

  const data = await res.json();

  if (!data.features || !data.features.length) {
    throw new Error("ORS returned empty route data");
  }

  const feature = data.features[0];
  return {
    geometry: feature.geometry,
    distance: feature.properties.summary.distance,
    duration: feature.properties.summary.duration,
  };
}
