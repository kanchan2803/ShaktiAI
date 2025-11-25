// src/utils/geocode.js
// Uses Nominatim (OpenStreetMap) for reverse geocode and autocomplete suggestions
// Keep usage polite (throttle client requests)

export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error('Reverse geocode failed');
  const data = await res.json();
  return data; // contains address, display_name, boundingbox etc.
}

// autocomplete suggestions: limit by bounding box (viewbox) if provided
export async function autocomplete(query, { viewbox } = {}) {
  // viewbox: [left, top, right, bottom] as lon/lat
  let url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(query)}`;
  if (viewbox && viewbox.length === 4) {
    const vb = viewbox.join(',');
    // viewbox parameter as left,top,right,bottom
    url += `&viewbox=${vb}&bounded=1`;
  }
  // Use addressdetails=1 if you want components
  url += `&addressdetails=1`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data; // array of results with lat/lon/display_name
}
// src/utils/geocode.js

// simple forward geocoding using Nominatim
export async function geocode(query) {
  if (!query || query.trim().length < 2) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}&addressdetails=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || !data.length) return null;
  const { lat, lon, display_name } = data[0];
  return { lat: parseFloat(lat), lng: parseFloat(lon), display_name };
}
