export async function geocode(
  rua: string,
  numero: string,
  cidade: string,
): Promise<{ lat: number; lng: number } | null> {
  const query = `${rua}, ${numero}, ${cidade}, Brazil`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: query,
        format: "json",
        limit: "1",
      })}`,
      { headers: { "User-Agent": "RushApp/1.0" } },
    );
    const data = await res.json();
    if (!data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
