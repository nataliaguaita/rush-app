"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/types/database";

export async function createUser(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;
  const phone = (formData.get("phone") as string) || null;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  });

  if (error) {
    return { error: error.message };
  }

  if (phone && data.user) {
    await supabase
      .from("profiles")
      .update({ phone })
      .eq("id", data.user.id);
  }

  revalidatePath("/dashboard/cadastros");
  return { success: true };
}
