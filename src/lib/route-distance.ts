import { ORIGIN_LAT, ORIGIN_LNG } from "./constants";
import type { createClient } from "./supabase/client";
import type { Endereco } from "@/types/database";

type SupabaseClient = ReturnType<typeof createClient>;

export async function calcRouteDistanceKm(
  waypoints: { lat: number; lng: number }[],
  period: "manha" | "tarde",
): Promise<number> {
  if (waypoints.length === 0) return 0;

  const coords = [
    `${ORIGIN_LNG},${ORIGIN_LAT}`,
    ...waypoints.map((w) => `${w.lng},${w.lat}`),
    ...(period === "manha" ? [`${ORIGIN_LNG},${ORIGIN_LAT}`] : []),
  ].join(";");

  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`,
  );
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]) return 0;
  return Math.round((data.routes[0].distance / 1000) * 10) / 10;
}

// Ordem em que o entregador fez as paradas, não a planejada (route_order pode
// ter sido reorganizado no meio da rota). Recusa não grava delivered_at, usa updated_at.
export function ordemRealizada<T extends { delivered_at: string | null; updated_at: string }>(lista: T[]): T[] {
  const hora = (e: T) => new Date(e.delivered_at ?? e.updated_at).getTime();
  return [...lista].sort((a, b) => hora(a) - hora(b));
}

// Grava o km da rota (entregador + dia + período) em rotas_diarias quando
// a última entrega dela fecha. Chamada por quem muda o status de uma entrega.
export async function tryCalculateRouteDistance(
  supabase: SupabaseClient,
  entregaId: string,
) {
  const { data: entrega } = await supabase
    .from("entregas")
    .select("entregador_id, scheduled_date, scheduled_period")
    .eq("id", entregaId)
    .single();

  if (!entrega?.entregador_id || !entrega?.scheduled_date || !entrega?.scheduled_period) return;

  const { count } = await supabase
    .from("entregas")
    .select("*", { count: "exact", head: true })
    .eq("entregador_id", entrega.entregador_id)
    .eq("scheduled_date", entrega.scheduled_date)
    .eq("scheduled_period", entrega.scheduled_period)
    .not("status", "in", '("entregue","recusada","retornada","cancelada")');

  if ((count ?? 0) > 0) return;

  const { data: delivered } = await supabase
    .from("entregas")
    .select("delivered_at, updated_at, endereco:enderecos(lat, lng)")
    .eq("entregador_id", entrega.entregador_id)
    .eq("scheduled_date", entrega.scheduled_date)
    .eq("scheduled_period", entrega.scheduled_period)
    .in("status", ["entregue", "recusada"]);

  const waypoints = ordemRealizada(delivered ?? [])
    .map((d) => d.endereco as unknown as Pick<Endereco, "lat" | "lng"> | null)
    .filter((e): e is { lat: number; lng: number } => !!e?.lat && !!e?.lng);

  const km = await calcRouteDistanceKm(waypoints, entrega.scheduled_period);

  await supabase.from("rotas_diarias").upsert(
    {
      entregador_id: entrega.entregador_id,
      data: entrega.scheduled_date,
      period: entrega.scheduled_period,
      distance_km: km,
      entregas_count: waypoints.length,
    },
    { onConflict: "entregador_id,data,period" },
  );
}
