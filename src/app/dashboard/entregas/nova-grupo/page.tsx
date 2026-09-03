"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NovaEntregaGrupoForm } from "./nova-entrega-grupo-form";
import type { LocalFrequente } from "@/types/database";

export default function NovaEntregaGrupoPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [locais, setLocais] = useState<LocalFrequente[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: l }] = await Promise.all([
        supabase.from("clientes").select("*, enderecos(*)").eq("active", true).order("name"),
        supabase.from("locais_frequentes").select("*").eq("active", true).order("name"),
      ]);
      setClientes(c ?? []);
      setLocais((l ?? []) as LocalFrequente[]);
    }
    load();
  }, []);

  return (
    <div className="mx-auto">
      <NovaEntregaGrupoForm clientes={clientes} locaisFrequentes={locais} />
    </div>
  );
}
