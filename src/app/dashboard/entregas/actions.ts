"use client";

import { createClient } from "@/lib/supabase/client";
import type { DeliveryStatus } from "@/types/database";

export async function createEntrega(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const clienteId = formData.get("cliente_id") as string;
  const enderecoId = formData.get("endereco_id") as string;
  const rawValor = formData.get("valor") as string;
  const valor = rawValor ? parseFloat(rawValor) : null;
  const scheduledPeriod = (formData.get("scheduled_period") as string) || null;
  const scheduledDate = (formData.get("scheduled_date") as string) || null;
  const isUrgent = formData.get("is_urgent") === "on";
  const returnReminder = formData.get("return_reminder") === "on";
  const returnNotes = (formData.get("return_notes") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const interestedName = (formData.get("interested_name") as string) || null;
  const actions = [...new Set(formData.getAll("actions") as string[])];

  const { error } = await supabase.from("entregas").insert({
    created_by: user.id,
    cliente_id: clienteId,
    endereco_id: enderecoId,
    valor,
    status: "aguardando_atribuicao",
    actions: actions.length > 0 ? actions : ["entregar"],
    scheduled_period: scheduledPeriod as "manha" | "tarde" | null,
    scheduled_date: scheduledDate,
    is_urgent: isUrgent,
    return_reminder: returnReminder,
    interested_name: interestedName,
    interested_note: returnReminder ? returnNotes : null,
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

export async function persistColumnState(
  entregadorId: string | null,
  entregaIds: string[],
) {
  const supabase = createClient();
  await Promise.all(
    entregaIds.map((id, index) => {
      const updates: Record<string, unknown> = {
        entregador_id: entregadorId,
        route_order: index + 1,
      };
      if (!entregadorId) {
        updates.status = "aguardando_atribuicao" as DeliveryStatus;
      }
      return supabase.from("entregas").update(updates).eq("id", id);
    })
  );
}

export async function releaseRoute(entregaIds: string[]) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ status: "rota_definida" as DeliveryStatus })
    .in("id", entregaIds);
  if (error) throw error;
}
