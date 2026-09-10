"use client";

import { createClient } from "@/lib/supabase/client";
import type { useRouter } from "next/navigation";

export async function logout(router: ReturnType<typeof useRouter>) {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/login");
}
