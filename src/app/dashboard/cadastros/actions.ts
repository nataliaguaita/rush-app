"use client";

import { createClient } from "@/lib/supabase/client";

export async function createUser(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const phone = (formData.get("phone") as string) || null;

  const res = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ name, username, password, role, phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error };
  }

  return { success: true };
}

export async function updateProfile(
  id: string,
  data: {
    name: string;
    username: string;
    password?: string;
    role: string;
    phone: string | null;
    active: boolean;
  }
) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const res = await fetch("/api/admin/update-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ id, ...data }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { error: result.error };
  }

  return { success: true };
}
