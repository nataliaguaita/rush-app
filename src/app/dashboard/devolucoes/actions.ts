"use client";

import { createClient } from "@/lib/supabase/client";

export async function darBaixaDevolucao(entregaId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ nota_devolvida: true, nota_devolvida_at: new Date().toISOString() })
    .eq("id", entregaId);
  if (error) throw new Error(error.message);
}

export async function desfazerBaixaDevolucao(entregaId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("entregas")
    .update({ nota_devolvida: false, nota_devolvida_at: null })
    .eq("id", entregaId);
  if (error) throw new Error(error.message);
}
