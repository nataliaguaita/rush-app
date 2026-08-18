"use client";

import { createClient } from "@/lib/supabase/client";
import type { ReceiverRole } from "@/types/database";

export async function iniciarEntrega(entregaId: string) {
  const supabase = createClient();
  await supabase.from("entregas").update({ status: "em_rota" }).eq("id", entregaId);
}

export async function registrarEntrega(entregaId: string, formData: FormData) {
  const supabase = createClient();

  await supabase.from("entregas").update({
    status: "entregue",
    receiver_name: formData.get("receiver_name") as string,
    receiver_role: formData.get("receiver_role") as ReceiverRole,
    receiver_note: (formData.get("receiver_note") as string) || null,
    delivered_at: new Date().toISOString(),
  }).eq("id", entregaId);
}

export async function registrarRecusa(entregaId: string, formData: FormData) {
  const supabase = createClient();
  await supabase.from("entregas").update({
    status: "recusada",
    refusal_reason: formData.get("refusal_reason") as string,
  }).eq("id", entregaId);
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
