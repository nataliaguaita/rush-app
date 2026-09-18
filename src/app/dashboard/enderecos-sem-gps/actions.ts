"use client";

import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";
import { toTitleCase } from "@/lib/utils";

export type EnderecoSemGpsKind = "endereco" | "local";

export interface AddressFields {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cep: string;
}

function tableFor(kind: EnderecoSemGpsKind) {
  return kind === "endereco" ? "enderecos" : "locais_frequentes";
}

function toRow(fields: AddressFields) {
  return {
    rua: toTitleCase(fields.rua),
    numero: fields.numero,
    complemento: fields.complemento ? toTitleCase(fields.complemento) : null,
    bairro: fields.bairro ? toTitleCase(fields.bairro) : null,
    cidade: toTitleCase(fields.cidade),
    cep: fields.cep || null,
  };
}

/** Reaplica o geocode com os dados (possivelmente corrigidos) do endereço. Retorna se achou coordenadas. */
export async function retryGeocode(kind: EnderecoSemGpsKind, id: string, fields: AddressFields): Promise<boolean> {
  const supabase = createClient();
  const coords = await geocode(fields.rua, fields.numero, fields.cidade);

  const { error } = await supabase
    .from(tableFor(kind))
    .update({ ...toRow(fields), ...coords })
    .eq("id", id);
  if (error) throw new Error(error.message);

  return !!coords;
}

/** Define lat/lng manualmente (sem chamar o geocode), para endereços que o Nominatim não localiza. */
export async function setManualCoords(kind: EnderecoSemGpsKind, id: string, fields: AddressFields, lat: number, lng: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from(tableFor(kind))
    .update({ ...toRow(fields), lat, lng })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
