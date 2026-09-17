import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function geocode(rua, numero, cidade) {
  const query = `${rua}, ${numero}, ${cidade}, Brazil`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: query,
        format: "json",
        limit: "1",
      })}`,
      { headers: { "User-Agent": "RushApp/1.0" } }
    );
    const data = await res.json();
    if (!data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

const { data: enderecos, error } = await supabase
  .from("enderecos")
  .select("id, rua, numero, cidade, cliente_id")
  .eq("label", "Sistema de vendas")
  .is("lat", null);

if (error) {
  console.error("Erro ao buscar enderecos:", error.message);
  process.exit(1);
}

console.log(`${enderecos.length} endereço(s) sem coordenada.`);

let ok = 0;
let falhou = 0;

for (const end of enderecos) {
  if (!end.rua || !end.cidade) {
    falhou++;
    console.log(`SKIP  ${end.id}  (rua/cidade ausente)`);
    continue;
  }
  const coords = await geocode(end.rua, end.numero || "", end.cidade);
  if (!coords) {
    falhou++;
    console.log(`FALHA ${end.id}  ${end.rua}, ${end.numero}, ${end.cidade}`);
  } else {
    const { error: updError } = await supabase
      .from("enderecos")
      .update(coords)
      .eq("id", end.id);
    if (updError) {
      falhou++;
      console.log(`ERRO  ${end.id}  ${updError.message}`);
    } else {
      ok++;
      console.log(`OK    ${end.id}  ${end.rua}, ${end.numero}, ${end.cidade} -> ${coords.lat}, ${coords.lng}`);
    }
  }
  await new Promise((r) => setTimeout(r, 1100));
}

console.log(`\nConcluído: ${ok} geocodificados, ${falhou} falharam.`);
