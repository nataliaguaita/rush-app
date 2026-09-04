"use client";

import { createClient } from "@/lib/supabase/client";
import { calcRouteDistanceKm } from "@/lib/route-distance";
import { toTitleCase } from "@/lib/utils";
import type { ReceiverRole } from "@/types/database";

export async function iniciarEntrega(entregaId: string) {
  const supabase = createClient();
  await supabase.from("entregas").update({ status: "em_rota", route_started_at: new Date().toISOString() }).eq("id", entregaId);
}

const VALID_ROLES: ReceiverRole[] = ["secretaria", "porteiro", "morador_vizinho", "proprietario"];

export async function registrarEntrega(
  entregaId: string,
  dados: { receiver_name: string; receiver_role: string; custom_role?: string; receiver_note?: string },
) {
  const supabase = createClient();

  const isValidRole = VALID_ROLES.includes(dados.receiver_role as ReceiverRole);
  const note = [
    dados.receiver_role === "outro" && dados.custom_role ? `Cargo: ${dados.custom_role}` : null,
    dados.receiver_note || null,
  ].filter(Boolean).join(" — ") || null;

  const { error } = await supabase.from("entregas").update({
    status: "entregue",
    receiver_name: toTitleCase(dados.receiver_name),
    receiver_role: isValidRole ? dados.receiver_role : null,
    receiver_note: note,
    delivered_at: new Date().toISOString(),
  }).eq("id", entregaId);

  if (error) throw new Error(error.message);

  try {
    await tryCalculateRouteDistance(supabase, entregaId);
  } catch {}
}

async function tryCalculateRouteDistance(
  supabase: ReturnType<typeof createClient>,
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
    .not("status", "in", '("entregue","recusada","retornada")');

  if ((count ?? 0) > 0) return;

  const { data: delivered } = await supabase
    .from("entregas")
    .select("endereco:enderecos(lat, lng)")
    .eq("entregador_id", entrega.entregador_id)
    .eq("scheduled_date", entrega.scheduled_date)
    .eq("scheduled_period", entrega.scheduled_period)
    .eq("status", "entregue")
    .order("route_order");

  const waypoints = (delivered ?? [])
    .map((d: any) => d.endereco)
    .filter((e: any) => e?.lat && e?.lng);

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

export async function registrarRecusa(entregaId: string, motivo: string) {
  const supabase = createClient();
  const { error } = await supabase.from("entregas").update({
    status: "recusada",
    refusal_reason: motivo,
  }).eq("id", entregaId);

  if (error) throw new Error(error.message);
}

export async function confirmarRetornoEntrega(entregaId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ return_confirmed: true, return_confirmed_at: new Date().toISOString() })
    .eq("id", entregaId);
  if (error) throw new Error(error.message);
}

export async function removerFotosEntrega(entregaId: string) {
  const supabase = createClient();
  const { data: fotos } = await supabase
    .from("entrega_fotos")
    .select("id, storage_path")
    .eq("entrega_id", entregaId);

  if (!fotos || fotos.length === 0) return;

  const paths = fotos.map((f) => f.storage_path);
  await supabase.storage.from("entregas").remove(paths);
  await supabase.from("entrega_fotos").delete().eq("entrega_id", entregaId);
}

export async function uploadFotoEntrega(entregaId: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("foto") as File;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop();
  const path = `${entregaId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("entregas").upload(path, file);
  if (uploadError) throw new Error(uploadError.message);

  await supabase.from("entrega_fotos").insert({ entrega_id: entregaId, storage_path: path });
}

export async function copiarFotoParaEntregas(sourceEntregaId: string, targetEntregaIds: string[]) {
  if (targetEntregaIds.length === 0) return;
  const supabase = createClient();
  const { data: fotos } = await supabase
    .from("entrega_fotos")
    .select("storage_path")
    .eq("entrega_id", sourceEntregaId);

  if (!fotos || fotos.length === 0) return;

  const rows = targetEntregaIds.flatMap((id) =>
    fotos.map((f) => ({ entrega_id: id, storage_path: f.storage_path }))
  );
  await supabase.from("entrega_fotos").insert(rows);
}
