"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchAll } from "@/lib/fetch-all";
import { NovaEntregaGrupoForm } from "./nova-entrega-grupo-form";
import type { ClienteWithEnderecos, LocalFrequente } from "@/types/database";

export default function NovaEntregaGrupoPage() {
  const [clientes, setClientes] = useState<ClienteWithEnderecos[]>([]);
  const [locais, setLocais] = useState<LocalFrequente[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [c, { data: l }] = await Promise.all([
        fetchAll<ClienteWithEnderecos>((from, to) =>
          supabase.from("clientes").select("*, enderecos(*)").eq("active", true).order("name").range(from, to)
        ),
        supabase.from("locais_frequentes").select("*").eq("active", true).order("name"),
      ]);
      setClientes(c);
      setLocais((l ?? []) as LocalFrequente[]);
    }
    load();
  }, [supabase]);

  return (
    <div className="mx-auto">
      <NovaEntregaGrupoForm clientes={clientes} locaisFrequentes={locais} />
    </div>
  );
}
