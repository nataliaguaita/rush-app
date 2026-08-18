"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCliente(formData: FormData) {
  const supabase = await createClient();

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

  revalidatePath("/dashboard/clientes");
  redirect("/dashboard/clientes");
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;
  const active = formData.get("active") === "true";

  await supabase.from("clientes").update({ name, phone, active }).eq("id", id);

  revalidatePath("/dashboard/clientes");
  redirect(`/dashboard/clientes/${id}`);
}

export async function addEndereco(clienteId: string, formData: FormData) {
  const supabase = await createClient();

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

  revalidatePath(`/dashboard/clientes/${clienteId}`);
}

export async function deleteEndereco(clienteId: string, enderecoId: string) {
  const supabase = await createClient();
  await supabase.from("enderecos").delete().eq("id", enderecoId);
  revalidatePath(`/dashboard/clientes/${clienteId}`);
}
