"use client";

import { createClient } from "@/lib/supabase/client";
import { calcRouteDistanceKm } from "@/lib/route-distance";
import { toTitleCase } from "@/lib/utils";
import { run, dropOps, type QueuedOp, type RegistroDados } from "@/lib/offline-queue";
import type { Endereco, ReceiverRole } from "@/types/database";

const VALID_ROLES: ReceiverRole[] = ["secretaria", "porteiro", "morador_vizinho", "proprietario"];

async function applyIniciar(entregaId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ status: "em_rota", route_started_at: new Date().toISOString() })
    .eq("id", entregaId);
  if (error) throw new Error(error.message);
}

async function applyRegistrarEntrega(entregaId: string, dados: RegistroDados) {
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

async function applyRegistrarRecusa(entregaId: string, motivo: string) {
  const supabase = createClient();
  const { error } = await supabase.from("entregas").update({
    status: "recusada",
    refusal_reason: motivo,
  }).eq("id", entregaId);

  if (error) throw new Error(error.message);
}

async function applyConfirmarRetorno(entregaId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ return_confirmed: true, return_confirmed_at: new Date().toISOString() })
    .eq("id", entregaId);
  if (error) throw new Error(error.message);
}

async function applyRemoverFotos(entregaId: string) {
  const supabase = createClient();
  const { data: fotos, error } = await supabase
    .from("entrega_fotos")
    .select("id, storage_path")
    .eq("entrega_id", entregaId);

  if (error) throw new Error(error.message);
  if (!fotos || fotos.length === 0) return;

  const paths = fotos.map((f) => f.storage_path);
  await supabase.storage.from("entregas").remove(paths);
  await supabase.from("entrega_fotos").delete().eq("entrega_id", entregaId);
}

async function applyUploadFoto(entregaId: string, blob: Blob, filename: string) {
  const supabase = createClient();
  const ext = filename.split(".").pop() || "jpg";
  const path = `${entregaId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("entregas").upload(path, blob);
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase.from("entrega_fotos").insert({ entrega_id: entregaId, storage_path: path });
  if (error) throw new Error(error.message);
}

async function applyCopiarFoto(sourceEntregaId: string, targetEntregaIds: string[]) {
  if (targetEntregaIds.length === 0) return;
  const supabase = createClient();
  const { data: fotos, error } = await supabase
    .from("entrega_fotos")
    .select("storage_path")
    .eq("entrega_id", sourceEntregaId);

  if (error) throw new Error(error.message);
  if (!fotos || fotos.length === 0) return;

  const rows = targetEntregaIds.flatMap((id) =>
    fotos.map((f) => ({ entrega_id: id, storage_path: f.storage_path }))
  );
  const { error: insertError } = await supabase.from("entrega_fotos").insert(rows);
  if (insertError) throw new Error(insertError.message);
}

export async function applyOp(op: QueuedOp, blob?: Blob): Promise<void> {
  switch (op.kind) {
    case "iniciar": return applyIniciar(op.entregaId);
    case "entrega": return applyRegistrarEntrega(op.entregaId, op.dados);
    case "recusa": return applyRegistrarRecusa(op.entregaId, op.motivo);
    case "retorno": return applyConfirmarRetorno(op.entregaId);
    case "foto": return applyUploadFoto(op.entregaId, blob!, op.filename);
    case "removerFotos": return applyRemoverFotos(op.entregaId);
    case "copiarFoto": return applyCopiarFoto(op.entregaId, op.targetEntregaIds);
  }
}

export function iniciarEntrega(entregaId: string) {
  return run({ kind: "iniciar", entregaId }, applyOp);
}

export function registrarEntrega(entregaId: string, dados: RegistroDados) {
  return run({ kind: "entrega", entregaId, dados }, applyOp);
}

export function registrarRecusa(entregaId: string, motivo: string) {
  return run({ kind: "recusa", entregaId, motivo }, applyOp);
}

export function confirmarRetornoEntrega(entregaId: string) {
  return run({ kind: "retorno", entregaId }, applyOp);
}

export function uploadFotoEntrega(entregaId: string, file: File) {
  return run({ kind: "foto", entregaId, filename: file.name }, applyOp, file);
}

export async function removerFotosEntrega(entregaId: string) {
  await dropOps((op) => op.kind === "foto" && op.entregaId === entregaId);
  return run({ kind: "removerFotos", entregaId }, applyOp);
}

export function copiarFotoParaEntregas(sourceEntregaId: string, targetEntregaIds: string[]) {
  return run({ kind: "copiarFoto", entregaId: sourceEntregaId, targetEntregaIds }, applyOp);
}
