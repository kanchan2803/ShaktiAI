export async function fetchNearby(lat, lon, radius=8000) {
  const endpoint = 'https://overpass-api.de/api/interpreter';
  const query = `
  [out:json][timeout:25];
  (
    node(around:${radius},${lat},${lon})[amenity=police];
    node(around:${radius},${lat},${lon})[amenity=hospital];
    node(around:${radius},${lat},${lon})[amenity=clinic];
    node(around:${radius},${lat},${lon})[emergency=ambulance];
    node(around:${radius},${lat},${lon})[office=ngo];
    node(around:${radius},${lat},${lon})[amenity=shelter];
    node(around:${radius},${lat},${lon})[social_facility];
    way(around:${radius},${lat},${lon})[amenity=police];
    way(around:${radius},${lat},${lon})[amenity=hospital];
    way(around:${radius},${lat},${lon})[office=ngo];
  );
  out center;`;
  const res = await fetch(endpoint, { method: 'POST', body: query });
  if (!res.ok) throw new Error('Overpass API error: ' + res.status);
  const data = await res.json();
  const places = data.elements.map((el) => {
    const tags = el.tags || {};
    const latc = el.lat || (el.center && el.center.lat);
    const lonc = el.lon || (el.center && el.center.lon);
    return {
      id: el.id + '-' + (el.type || 'n'),
      name: tags.name || (tags.operator || tags.organisation) || 'Unknown',
      category: tags.amenity || tags.office || tags.social_facility || 'Other',
      phone: tags.phone || tags['contact:phone'] || '',
      address: (tags['addr:street'] ? tags['addr:street'] + ', ' : '') + (tags['addr:city']||tags['addr:state']||''),
      coords: { lat: latc, lng: lonc },
      tags,
    };
  }).filter(p => p.coords.lat && p.coords.lng);
  return places;
}