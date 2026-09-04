"use client";

import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";
import { toTitleCase } from "@/lib/utils";
import type { DeliveryStatus, RouteChangeType } from "@/types/database";

export async function createEntrega(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const clienteId = formData.get("cliente_id") as string;
  let enderecoId = formData.get("endereco_id") as string;
  const isCustomAddress = formData.get("custom_address") === "true";

  if (isCustomAddress) {
    const rua = formData.get("custom_rua") as string;
    const numero = (formData.get("custom_numero") as string) || "";
    const cidade = (formData.get("custom_cidade") as string) || "";
    const coords = await geocode(rua, numero, cidade);
    const addrData = {
      cliente_id: clienteId,
      rua: toTitleCase(rua),
      numero,
      complemento: formData.get("custom_complemento") ? toTitleCase(formData.get("custom_complemento") as string) : null,
      bairro: formData.get("custom_bairro") ? toTitleCase(formData.get("custom_bairro") as string) : null,
      cidade: toTitleCase(cidade),
      cep: (formData.get("custom_cep") as string) || null,
      label: formData.get("custom_label") ? toTitleCase(formData.get("custom_label") as string) : null,
      ...coords,
    };
    const { data: newEndereco, error: addrError } = await supabase
      .from("enderecos")
      .insert(addrData)
      .select("id")
      .single();
    if (addrError) throw new Error(addrError.message);
    enderecoId = newEndereco.id;
  }

  const rawValor = formData.get("valor") as string;
  const valor = rawValor ? parseFloat(rawValor) : null;
  const scheduledPeriod = (formData.get("scheduled_period") as string) || null;
  const scheduledDate = (formData.get("scheduled_date") as string) || null;
  const isUrgent = formData.get("is_urgent") === "on";
  const returnReminder = formData.get("return_reminder") === "on";
  const returnNotes = (formData.get("return_notes") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const rawInterestedName = formData.get("interested_name") as string;
  const interestedName = rawInterestedName ? toTitleCase(rawInterestedName) : null;
  const actions = [...new Set(formData.getAll("actions") as string[])];
  const rawSacolas = formData.get("numero_sacolas") as string;
  const numeroSacolas = rawSacolas ? parseInt(rawSacolas, 10) : 1;
  const groupId = (formData.get("group_id") as string) || null;

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
    numero_sacolas: numeroSacolas || 1,
    group_id: groupId,
  });

  if (error) throw new Error(error.message);
}

export async function updateEntrega(entregaId: string, formData: FormData) {
  const supabase = createClient();

  const { data: entrega } = await supabase
    .from("entregas")
    .select("status")
    .eq("id", entregaId)
    .single();

  if (!entrega || entrega.status !== "aguardando_atribuicao") {
    throw new Error("Entrega não pode mais ser editada");
  }

  const rawValor = formData.get("valor") as string;
  const valor = rawValor ? parseFloat(rawValor) : null;
  const scheduledPeriod = (formData.get("scheduled_period") as string) || null;
  const scheduledDate = (formData.get("scheduled_date") as string) || null;
  const isUrgent = formData.get("is_urgent") === "on";
  const returnReminder = formData.get("return_reminder") === "on";
  const returnNotes = (formData.get("return_notes") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const rawInterestedName = formData.get("interested_name") as string;
  const interestedName = rawInterestedName ? toTitleCase(rawInterestedName) : null;
  const actions = [...new Set(formData.getAll("actions") as string[])];
  const rawSacolas = formData.get("numero_sacolas") as string;
  const numeroSacolas = rawSacolas ? parseInt(rawSacolas, 10) : 1;

  const { error } = await supabase
    .from("entregas")
    .update({
      valor,
      actions: actions.length > 0 ? actions : ["entregar"],
      scheduled_period: scheduledPeriod as "manha" | "tarde" | null,
      scheduled_date: scheduledDate,
      is_urgent: isUrgent,
      return_reminder: returnReminder,
      interested_name: interestedName,
      interested_note: returnReminder ? returnNotes : null,
      notes,
      numero_sacolas: numeroSacolas || 1,
    })
    .eq("id", entregaId);

  if (error) throw new Error(error.message);
}

export async function cancelEntrega(entregaId: string, reason: string) {
  const supabase = createClient();

  const { data: entrega } = await supabase
    .from("entregas")
    .select("status")
    .eq("id", entregaId)
    .single();

  if (!entrega || entrega.status !== "aguardando_atribuicao") {
    throw new Error("Entrega não pode mais ser cancelada");
  }

  const { error } = await supabase
    .from("entregas")
    .update({ status: "cancelada" as DeliveryStatus, cancel_reason: reason || null })
    .eq("id", entregaId);

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

export async function applyRouteChange(
  entregaId: string,
  type: RouteChangeType,
  note: string,
) {
  const supabase = createClient();
  const updates: Record<string, unknown> = {
    route_change_type: type,
    route_change_note: note || null,
  };
  if (type === "cancelada") {
    updates.status = "retornada" as DeliveryStatus;
  }
  const { error } = await supabase
    .from("entregas")
    .update(updates)
    .eq("id", entregaId);
  if (error) throw error;
}

export async function applyAddressChange(
  entregaId: string,
  address: { rua: string; numero: string; bairro: string; cidade: string },
  note: string,
) {
  const supabase = createClient();
  const coords = await geocode(address.rua, address.numero, address.cidade);

  // Buscar o cliente_id da entrega
  const { data: entregaData } = await supabase
    .from("entregas")
    .select("cliente_id")
    .eq("id", entregaId)
    .single();

  if (!entregaData) throw new Error("Entrega não encontrada");

  // Criar novo endereço com coordenadas
  const { data: newEndereco, error: addrError } = await supabase
    .from("enderecos")
    .insert({
      cliente_id: entregaData.cliente_id,
      rua: toTitleCase(address.rua),
      numero: address.numero,
      bairro: address.bairro ? toTitleCase(address.bairro) : null,
      cidade: toTitleCase(address.cidade),
      ...coords,
    })
    .select("*")
    .single();
  if (addrError) throw addrError;

  // Atualizar entrega com novo endereço
  const { error } = await supabase
    .from("entregas")
    .update({
      endereco_id: newEndereco.id,
      route_change_type: "endereco_alterado" as RouteChangeType,
      route_change_note: note || null,
    })
    .eq("id", entregaId);
  if (error) throw error;

  // Retornar o novo endereço completo para atualização no estado local
  return newEndereco;
}

export async function confirmarRetorno(entregaId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ status: "retornada" as DeliveryStatus })
    .eq("id", entregaId);
  if (error) throw error;
}
