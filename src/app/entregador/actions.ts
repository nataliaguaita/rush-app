"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ReceiverRole } from "@/types/database";

export async function iniciarEntrega(entregaId: string) {
  const supabase = await createClient();
  await supabase
    .from("entregas")
    .update({ status: "em_rota" })
    .eq("id", entregaId);
  revalidatePath("/entregador");
}

export async function registrarEntrega(entregaId: string, formData: FormData) {
  const supabase = await createClient();

  const receiverName = formData.get("receiver_name") as string;
  const receiverRole = formData.get("receiver_role") as ReceiverRole;
  const receiverNote = (formData.get("receiver_note") as string) || null;

  await supabase
    .from("entregas")
    .update({
      status: "entregue",
      receiver_name: receiverName,
      receiver_role: receiverRole,
      receiver_note: receiverNote,
      delivered_at: new Date().toISOString(),
    })
    .eq("id", entregaId);

  revalidatePath("/entregador");
  revalidatePath("/entregador/finalizadas");
}

export async function registrarRecusa(entregaId: string, formData: FormData) {
  const supabase = await createClient();

  const reason = formData.get("refusal_reason") as string;

  await supabase
    .from("entregas")
    .update({
      status: "recusada",
      refusal_reason: reason,
    })
    .eq("id", entregaId);

  revalidatePath("/entregador");
  revalidatePath("/entregador/finalizadas");
}

export async function uploadFotoEntrega(entregaId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("foto") as File;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop();
  const path = `${entregaId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("entregas")
    .upload(path, file);

  if (uploadError) throw new Error(uploadError.message);

  await supabase.from("entrega_fotos").insert({
    entrega_id: entregaId,
    storage_path: path,
  });

  revalidatePath("/entregador");
}
