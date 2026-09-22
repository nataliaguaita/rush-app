"use client";

import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";
import { toTitleCase } from "@/lib/utils";
import type { DeliveryStatus, ReceiverRole, RouteChangeType } from "@/types/database";

// Endereço escolhido no EnderecoPicker: o id de um cadastrado, ou cria um novo
// a partir dos campos custom_* (vinculado ao cliente se save_to_cliente).
async function resolveEnderecoId(
  supabase: ReturnType<typeof createClient>,
  formData: FormData,
  clienteId: string,
): Promise<string> {
  if (formData.get("custom_address") !== "true") return formData.get("endereco_id") as string;

  const rua = formData.get("custom_rua") as string;
  const numero = (formData.get("custom_numero") as string) || "";
  const cidade = (formData.get("custom_cidade") as string) || "";
  const saveToCliente = formData.get("save_to_cliente") === "on";
  const coords = await geocode(rua, numero, cidade);
  const addrData = {
    cliente_id: saveToCliente ? clienteId : null,
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
  return newEndereco.id;
}

export async function createEntrega(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const clienteId = formData.get("cliente_id") as string;
  const enderecoId = await resolveEnderecoId(supabase, formData, clienteId);

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
    .select("status, cliente_id")
    .eq("id", entregaId)
    .single();

  if (!entrega || entrega.status !== "aguardando_atribuicao") {
    throw new Error("Entrega não pode mais ser editada");
  }

  const enderecoId = await resolveEnderecoId(supabase, formData, entrega.cliente_id);
  if (!enderecoId) throw new Error("Selecione o endereço da entrega");

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
      endereco_id: enderecoId,
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

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
    .update({ status: "cancelada" as DeliveryStatus, cancel_reason: reason || null, cancelado_por: user.id })
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

  // Criar novo endereço apenas para esta entrega (não deve entrar no cadastro do cliente)
  const { data: newEndereco, error: addrError } = await supabase
    .from("enderecos")
    .insert({
      cliente_id: null,
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

export type FinalizacaoPainel =
  | { tipo: "entregue"; receiver_name: string; receiver_role: ReceiverRole | null; receiver_note: string; delivered_at: string }
  | { tipo: "recusada"; motivo: string }
  | { tipo: "retorno" };

// Finaliza pelo painel uma entrega que o entregador não finalizou.
// O filtro de status evita sobrescrever se o entregador finalizar ao mesmo tempo.
export async function finalizarPeloPainel(entregaId: string, f: FinalizacaoPainel) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  let query;
  if (f.tipo === "retorno") {
    query = supabase
      .from("entregas")
      .update({ return_confirmed: true, return_confirmed_at: new Date().toISOString(), finalizado_por: user.id })
      .eq("status", "retornada")
      .or("return_confirmed.is.null,return_confirmed.eq.false");
  } else {
    const updates = f.tipo === "entregue"
      ? {
          status: "entregue" as DeliveryStatus,
          receiver_name: toTitleCase(f.receiver_name.trim()),
          receiver_role: f.receiver_role,
          receiver_note: f.receiver_note.trim() || null,
          delivered_at: f.delivered_at,
        }
      : { status: "recusada" as DeliveryStatus, refusal_reason: f.motivo.trim() };
    query = supabase
      .from("entregas")
      .update({ ...updates, finalizado_por: user.id })
      .in("status", ["rota_definida", "em_rota"]);
  }

  const { data, error } = await query.eq("id", entregaId).select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("Esta entrega já foi finalizada ou mudou de status");
}
