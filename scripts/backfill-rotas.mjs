// Recalcula o km das rotas já fechadas que ficaram sem registro em rotas_diarias
// (ou com 0 km). Mesma regra de tryCalculateRouteDistance em src/app/entregador/actions.ts.
// Uso: node scripts/backfill-rotas.mjs [--dry]
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const DRY = process.argv.includes("--dry");
const ORIGIN = "-49.2676,-25.4308"; // lng,lat — mesmo de src/lib/constants.ts
const FECHADAS = ["entregue", "recusada", "retornada", "cancelada"];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function fetchAll(table, columns, filter) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    let q = supabase.from(table).select(columns).range(from, from + 999);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) {
      console.error(`Erro ao buscar ${table}:`, error.message);
      process.exit(1);
    }
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

async function calcKm(waypoints, period) {
  if (waypoints.length === 0) return 0;
  const coords = [
    ORIGIN,
    ...waypoints.map((w) => `${w.lng},${w.lat}`),
    ...(period === "manha" ? [ORIGIN] : []),
  ].join(";");
  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`);
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]) return null;
  return Math.round((data.routes[0].distance / 1000) * 10) / 10;
}

const entregas = await fetchAll(
  "entregas",
  "entregador_id, scheduled_date, scheduled_period, status, route_order, endereco:enderecos(lat, lng)",
  (q) => q.not("entregador_id", "is", null).not("scheduled_date", "is", null).not("scheduled_period", "is", null)
);
const rotas = await fetchAll("rotas_diarias", "entregador_id, data, period, distance_km");
const comKm = new Set(
  rotas.filter((r) => r.distance_km > 0).map((r) => `${r.entregador_id}|${r.data}|${r.period}`)
);

const grupos = new Map();
for (const e of entregas) {
  const key = `${e.entregador_id}|${e.scheduled_date}|${e.scheduled_period}`;
  if (!grupos.has(key)) grupos.set(key, []);
  grupos.get(key).push(e);
}

let ok = 0, pulou = 0, falhou = 0;

for (const [key, lista] of grupos) {
  if (comKm.has(key)) continue;
  if (lista.some((e) => !FECHADAS.includes(e.status))) { pulou++; continue; }

  const [entregador_id, data, period] = key.split("|");
  const waypoints = lista
    .filter((e) => (e.status === "entregue" || e.status === "recusada") && e.endereco?.lat && e.endereco?.lng)
    .sort((a, b) => (a.route_order ?? 0) - (b.route_order ?? 0))
    .map((e) => e.endereco);
  if (waypoints.length === 0) { pulou++; continue; }

  const km = await calcKm(waypoints, period);
  if (km === null) {
    falhou++;
    console.log(`FALHA ${data} ${period} ${entregador_id} (OSRM)`);
  } else if (DRY) {
    ok++;
    console.log(`DRY   ${data} ${period} ${entregador_id}  ${waypoints.length} paradas -> ${km} km`);
  } else {
    const { error } = await supabase.from("rotas_diarias").upsert(
      { entregador_id, data, period, distance_km: km, entregas_count: waypoints.length },
      { onConflict: "entregador_id,data,period" }
    );
    if (error) {
      falhou++;
      console.log(`ERRO  ${data} ${period} ${entregador_id}  ${error.message}`);
    } else {
      ok++;
      console.log(`OK    ${data} ${period} ${entregador_id}  ${waypoints.length} paradas -> ${km} km`);
    }
  }
  await new Promise((r) => setTimeout(r, 1100)); // servidor público do OSRM: ~1 req/s
}

console.log(`\nConcluído${DRY ? " (dry run)" : ""}: ${ok} rotas calculadas, ${pulou} puladas (abertas/sem coordenada), ${falhou} falharam.`);
