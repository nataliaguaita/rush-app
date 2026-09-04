"use client";

import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";
import { toTitleCase } from "@/lib/utils";

interface DestinatarioData {
  clienteId: string;
  valor: string;
  numeroSacolas: number;
  actions: string[];
  interestedName: string | null;
  notes: string | null;
}

interface CreateEntregaGrupoParams {
  addressMode: "cliente" | "custom" | "local";
  addressClienteId?: string;
  enderecoId?: string;
  customAddress?: {
    cep: string | null;
    rua: string;
    numero: string;
    complemento: string | null;
    bairro: string | null;
    cidade: string;
    label: string | null;
  };
  scheduledDate: string;
  scheduledPeriod: "manha" | "tarde";
  isUrgent: boolean;
  destinatarios: DestinatarioData[];
  saveLocal?: boolean;
}

export async function createEntregaGrupo(params: CreateEntregaGrupoParams) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  if (params.destinatarios.length === 0) throw new Error("Adicione ao menos um destinatário");

  // Resolve address
  let enderecoId: string;

  if (params.addressMode === "cliente" && params.enderecoId) {
    enderecoId = params.enderecoId;
  } else if (params.customAddress) {
    const addr = params.customAddress;
    const coords = await geocode(addr.rua, addr.numero, addr.cidade);

    // Endereço compartilhado pelo grupo — não pertence a nenhum cliente específico
    const { data: newEndereco, error: addrError } = await supabase
      .from("enderecos")
      .insert({
        cliente_id: null,
        rua: toTitleCase(addr.rua),
        numero: addr.numero,
        complemento: addr.complemento ? toTitleCase(addr.complemento) : null,
        bairro: addr.bairro ? toTitleCase(addr.bairro) : null,
        cidade: toTitleCase(addr.cidade),
        cep: addr.cep,
        label: addr.label ? toTitleCase(addr.label) : null,
        ...coords,
      })
      .select("id")
      .single();

    if (addrError) throw new Error(addrError.message);
    enderecoId = newEndereco.id;
  } else {
    throw new Error("Endereço inválido");
  }

  const groupId = crypto.randomUUID();

  const rows = params.destinatarios.map((d) => ({
    created_by: user.id,
    cliente_id: d.clienteId,
    endereco_id: enderecoId,
    valor: d.valor ? parseFloat(d.valor) : null,
    status: "aguardando_atribuicao" as const,
    actions: d.actions.length > 0 ? d.actions : ["entregar"],
    scheduled_period: params.scheduledPeriod,
    scheduled_date: params.scheduledDate,
    is_urgent: params.isUrgent,
    return_reminder: false,
    interested_name: d.interestedName ? toTitleCase(d.interestedName) : null,
    interested_note: null,
    notes: d.notes,
    numero_sacolas: d.numeroSacolas || 1,
    group_id: groupId,
  }));

  const { error } = await supabase.from("entregas").insert(rows);
  if (error) throw new Error(error.message);

  if (params.saveLocal && params.customAddress) {
    const addr = params.customAddress;
    await supabase.from("locais_frequentes").insert({
      name: toTitleCase(addr.label || `${addr.rua}, ${addr.numero}`),
      rua: toTitleCase(addr.rua),
      numero: addr.numero,
      complemento: addr.complemento ? toTitleCase(addr.complemento) : null,
      bairro: addr.bairro ? toTitleCase(addr.bairro) : null,
      cidade: toTitleCase(addr.cidade),
      cep: addr.cep,
    });
  }
}
