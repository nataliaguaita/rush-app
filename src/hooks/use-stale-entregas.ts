"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STALE_STATUSES, STALE_HOURS } from "@/lib/status";

export interface StaleEntrega {
  id: string;
  order_number: number;
  status: string;
  created_at: string;
  cliente: { name: string } | null;
}

export function useStaleEntregas() {
  const [entregas, setEntregas] = useState<StaleEntrega[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const cutoff = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("entregas")
        .select("id, order_number, status, created_at, cliente:clientes(name)")
        .in("status", STALE_STATUSES)
        .or("return_confirmed.is.null,return_confirmed.eq.false")
        .lt("created_at", cutoff)
        .order("created_at", { ascending: true });
      if (active) setEntregas((data as StaleEntrega[] | null) ?? []);
    }

    load();
    const channel = supabase
      .channel("stale-entregas")
      .on("postgres_changes", { event: "*", schema: "public", table: "entregas" }, load)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return entregas;
}
