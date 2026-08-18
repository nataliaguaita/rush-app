"use client";

import { createClient } from "@/lib/supabase/client";
import type { DeliveryStatus } from "@/types/database";

export async function createEntrega(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const clienteId = formData.get("cliente_id") as string;
  const enderecoId = formData.get("endereco_id") as string;
  const valor = formData.get("valor") ? parseFloat(formData.get("valor") as string) : null;
  const scheduledPeriod = (formData.get("scheduled_period") as string) || null;
  const isUrgent = formData.get("is_urgent") === "on";
  const returnReminder = formData.get("return_reminder") === "on";
  const notes = (formData.get("notes") as string) || null;
  const interestedName = (formData.get("interested_name") as string) || null;
  const interestedNote = (formData.get("interested_note") as string) || null;
  const actions = formData.getAll("actions") as string[];

  const { error } = await supabase.from("entregas").insert({
    created_by: user.id,
    cliente_id: clienteId,
    endereco_id: enderecoId,
    valor,
    status: "aguardando_atribuicao",
    actions: actions.length > 0 ? actions : ["entregar"],
    scheduled_period: scheduledPeriod as "manha" | "tarde" | null,
    is_urgent: isUrgent,
    return_reminder: returnReminder,
    interested_name: interestedName,
    interested_note: interestedNote,
    notes,
  });

  if (error) throw new Error(error.message);
}

export async function assignEntregador(entregaId: string, entregadorId: string) {
  const supabase = createClient();
  await supabase
    .from("entregas")
    .update({ entregador_id: entregadorId, status: "rota_definida" as DeliveryStatus })
    .eq("id", entregaId);
}

export async function updateEntregaStatus(entregaId: string, status: DeliveryStatus) {
  const supabase = createClient();
  const updates: Record<string, unknown> = { status };
  if (status === "entregue") {
    updates.delivered_at = new Date().toISOString();
  }
  await supabase.from("entregas").update(updates).eq("id", entregaId);
}
