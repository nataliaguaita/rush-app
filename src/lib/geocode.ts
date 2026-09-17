async function buscarNominatim(query: string): Promise<{ lat: number; lng: number } | null> {
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

export async function geocode(
  rua: string,
  numero: string,
  cidade: string,
): Promise<{ lat: number; lng: number } | null> {
  const comNumero = await buscarNominatim(`${rua}, ${numero}, ${cidade}, Brazil`);
  if (comNumero) return comNumero;

  // Estrada/rodovia rural: o OpenStreetMap tem o traçado da via, mas não
  // numeração de porta. Sem isso, a busca com número nunca acha nada — tenta
  // de novo só com rua + cidade, aceitando um ponto aproximado na via.
  return buscarNominatim(`${rua}, ${cidade}, Brazil`);
}
