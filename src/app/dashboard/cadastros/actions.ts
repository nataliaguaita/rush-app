"use client";

import { createClient } from "@/lib/supabase/client";

export async function createUser(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const phone = (formData.get("phone") as string) || null;

  const res = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ name, email, password, role, phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error };
  }

  return { success: true };
}

export async function updateProfile(
  id: string,
  data: { name: string; phone: string | null; active: boolean }
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      phone: data.phone,
      active: data.active,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
