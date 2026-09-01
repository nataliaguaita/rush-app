"use client";

import { createClient } from "@/lib/supabase/client";

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
    await supabase.from("enderecos").insert({
      cliente_id: cliente.id,
      label: (formData.get("label") as string) || null,
      rua,
      numero: (formData.get("numero") as string) || "",
      complemento: (formData.get("complemento") as string) || null,
      bairro: (formData.get("bairro") as string) || null,
      cidade: (formData.get("cidade") as string) || "",
      cep: (formData.get("cep") as string) || null,
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
    const rows = enderecos.map((end) => ({
      cliente_id: cliente.id,
      label: end.label || null,
      rua: end.rua,
      numero: end.numero || "",
      complemento: end.complemento || null,
      bairro: end.bairro || null,
      cidade: end.cidade || "",
      cep: end.cep || null,
    }));

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

  await supabase.from("enderecos").insert({
    cliente_id: clienteId,
    label: (formData.get("label") as string) || null,
    rua: formData.get("rua") as string,
    numero: (formData.get("numero") as string) || "",
    complemento: (formData.get("complemento") as string) || null,
    bairro: (formData.get("bairro") as string) || null,
    cidade: (formData.get("cidade") as string) || "",
    cep: (formData.get("cep") as string) || null,
  });
}

export async function deleteEndereco(enderecoId: string) {
  const supabase = createClient();
  await supabase.from("enderecos").delete().eq("id", enderecoId);
}
