"use client";

import { createClient } from "@/lib/supabase/client";
import type { ReceiverRole } from "@/types/database";

export async function iniciarEntrega(entregaId: string) {
  const supabase = createClient();
  await supabase.from("entregas").update({ status: "em_rota" }).eq("id", entregaId);
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
    receiver_name: dados.receiver_name,
    receiver_role: isValidRole ? dados.receiver_role : null,
    receiver_note: note,
    delivered_at: new Date().toISOString(),
  }).eq("id", entregaId);

  if (error) throw new Error(error.message);
}

export async function registrarRecusa(entregaId: string, motivo: string) {
  const supabase = createClient();
  const { error } = await supabase.from("entregas").update({
    status: "recusada",
    refusal_reason: motivo,
  }).eq("id", entregaId);

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
