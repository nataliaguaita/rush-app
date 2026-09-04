"use client";

import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";

interface LocalFormData {
  name: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
}

function readLocalForm(formData: FormData): LocalFormData {
  return {
    name: (formData.get("name") as string) || "",
    cep: (formData.get("cep") as string) || "",
    rua: (formData.get("rua") as string) || "",
    numero: (formData.get("numero") as string) || "",
    complemento: (formData.get("complemento") as string) || "",
    bairro: (formData.get("bairro") as string) || "",
    cidade: (formData.get("cidade") as string) || "",
  };
}

export async function createLocal(formData: FormData) {
  const supabase = createClient();
  const data = readLocalForm(formData);
  const coords = await geocode(data.rua, data.numero, data.cidade);

  const { error } = await supabase.from("locais_frequentes").insert({
    name: data.name,
    rua: data.rua,
    numero: data.numero,
    complemento: data.complemento || null,
    bairro: data.bairro || null,
    cidade: data.cidade,
    cep: data.cep || null,
    active: true,
    ...coords,
  });
  if (error) throw new Error(error.message);
}

export async function updateLocal(id: string, formData: FormData) {
  const supabase = createClient();
  const data = readLocalForm(formData);
  const coords = await geocode(data.rua, data.numero, data.cidade);

  const { error } = await supabase
    .from("locais_frequentes")
    .update({
      name: data.name,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento || null,
      bairro: data.bairro || null,
      cidade: data.cidade,
      cep: data.cep || null,
      ...coords,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setLocalActive(id: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("locais_frequentes").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
}
