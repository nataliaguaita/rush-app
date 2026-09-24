"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchAll } from "@/lib/fetch-all";
import { NovaEntregaForm } from "./nova-entrega-form";
import { fetchOpenGroups, type OpenGroup } from "../open-groups";
import type { ClienteWithEnderecos, LocalFrequente } from "@/types/database";

export default function NovaEntregaPage() {
  const [clientes, setClientes] = useState<ClienteWithEnderecos[]>([]);
  const [openGroups, setOpenGroups] = useState<OpenGroup[]>([]);
  const [locais, setLocais] = useState<LocalFrequente[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [data, { data: l }] = await Promise.all([
        fetchAll<ClienteWithEnderecos>((from, to) =>
          supabase
            .from("clientes")
            .select("*, enderecos(*)")
            .eq("active", true)
            .order("name")
            .range(from, to)
        ),
        supabase.from("locais_frequentes").select("*").eq("active", true).order("name"),
      ]);
      setClientes(data);
      setLocais((l ?? []) as LocalFrequente[]);
      setOpenGroups(await fetchOpenGroups(supabase));
    }
    load();
  }, [supabase]);

  return (
    <div className="mx-auto">
      <NovaEntregaForm clientes={clientes} openGroups={openGroups} locaisFrequentes={locais} />
    </div>
  );
}
