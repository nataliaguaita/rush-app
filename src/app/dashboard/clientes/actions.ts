"use client";

import { createClient } from "@/lib/supabase/client";
import { geocode } from "@/lib/geocode";

export async function createCliente(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;

  const { data: cliente, error } = await supabase
    .from("clientes")
    .insert({ name, phone, active: true })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const rua = formData.get("rua") as string;
  if (rua) {
    const numero = (formData.get("numero") as string) || "";
    const cidade = (formData.get("cidade") as string) || "";
    const coords = await geocode(rua, numero, cidade);
    await supabase.from("enderecos").insert({
      cliente_id: cliente.id,
      label: (formData.get("label") as string) || null,
      rua,
      numero,
      complemento: (formData.get("complemento") as string) || null,
      bairro: (formData.get("bairro") as string) || null,
      cidade,
      cep: (formData.get("cep") as string) || null,
      ...coords,
    });
  }
}

export async function createClienteMultiEnderecos(
  clienteData: { name: string; phone: string | null },
  enderecos: {
    label: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
  }[]
) {
  const supabase = createClient();

  const { data: cliente, error } = await supabase
    .from("clientes")
    .insert({ name: clienteData.name, phone: clienteData.phone, active: true })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (enderecos.length > 0) {
    const rows = await Promise.all(
      enderecos.map(async (end) => {
        const coords = await geocode(end.rua, end.numero, end.cidade);
        return {
          cliente_id: cliente.id,
          label: end.label || null,
          rua: end.rua,
          numero: end.numero || "",
          complemento: end.complemento || null,
          bairro: end.bairro || null,
          cidade: end.cidade || "",
          cep: end.cep || null,
          ...coords,
        };
      })
    );

    const { error: endError } = await supabase.from("enderecos").insert(rows);
    if (endError) throw new Error(endError.message);
  }
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;
  const active = formData.get("active") === "true";

  await supabase.from("clientes").update({ name, phone, active }).eq("id", id);
}

export async function addEndereco(clienteId: string, formData: FormData) {
  const supabase = createClient();
  const rua = formData.get("rua") as string;
  const numero = (formData.get("numero") as string) || "";
  const cidade = (formData.get("cidade") as string) || "";
  const coords = await geocode(rua, numero, cidade);

  await supabase.from("enderecos").insert({
    cliente_id: clienteId,
    label: (formData.get("label") as string) || null,
    rua,
    numero,
    complemento: (formData.get("complemento") as string) || null,
    bairro: (formData.get("bairro") as string) || null,
    cidade,
    cep: (formData.get("cep") as string) || null,
    ...coords,
  });
}

export async function updateEndereco(enderecoId: string, formData: FormData) {
  const supabase = createClient();
  const rua = formData.get("rua") as string;
  const numero = (formData.get("numero") as string) || "";
  const cidade = (formData.get("cidade") as string) || "";
  const coords = await geocode(rua, numero, cidade);

  await supabase.from("enderecos").update({
    label: (formData.get("label") as string) || null,
    rua,
    numero,
    complemento: (formData.get("complemento") as string) || null,
    bairro: (formData.get("bairro") as string) || null,
    cidade,
    cep: (formData.get("cep") as string) || null,
    ...coords,
  }).eq("id", enderecoId);
}

export async function deleteEndereco(enderecoId: string) {
  const supabase = createClient();
  await supabase.from("enderecos").delete().eq("id", enderecoId);
}

export async function geocodeExistingAddresses(): Promise<{ total: number; updated: number }> {
  const supabase = createClient();
  const { data: enderecos } = await supabase
    .from("enderecos")
    .select("id, rua, numero, cidade")
    .is("lat", null);

  if (!enderecos || enderecos.length === 0) return { total: 0, updated: 0 };

  let updated = 0;
  for (const end of enderecos) {
    const coords = await geocode(end.rua, end.numero || "", end.cidade || "");
    if (coords) {
      await supabase.from("enderecos").update(coords).eq("id", end.id);
      updated++;
    }
    // ponytail: 1 req/s limit from Nominatim
    await new Promise((r) => setTimeout(r, 1100));
  }

  return { total: enderecos.length, updated };
}
