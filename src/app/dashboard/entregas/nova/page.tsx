"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NovaEntregaForm } from "./nova-entrega-form";
import { format } from "date-fns";

export interface OpenGroup {
  groupId: string;
  enderecoId: string;
  label: string;
  count: number;
}

export default function NovaEntregaPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [openGroups, setOpenGroups] = useState<OpenGroup[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("clientes")
        .select("*, enderecos(*)")
        .eq("active", true)
        .order("name");
      setClientes(data ?? []);

      // Fetch today's open groups
      const today = format(new Date(), "yyyy-MM-dd");
      const { data: groupEntregas } = await supabase
        .from("entregas")
        .select("group_id, endereco_id, endereco:enderecos(rua, numero, bairro, label)")
        .not("group_id", "is", null)
        .eq("status", "aguardando_atribuicao")
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      if (groupEntregas) {
        const grouped = new Map<string, { enderecoId: string; endereco: any; count: number }>();
        for (const e of groupEntregas) {
          if (!e.group_id) continue;
          const existing = grouped.get(e.group_id);
          if (existing) {
            existing.count++;
          } else {
            grouped.set(e.group_id, {
              enderecoId: e.endereco_id,
              endereco: e.endereco,
              count: 1,
            });
          }
        }
        const groups: OpenGroup[] = [];
        for (const [gid, info] of grouped) {
          const addr = info.endereco as any;
          const label = addr?.label
            ? `${addr.label} — ${addr.rua}, ${addr.numero}`
            : `${addr?.rua ?? "?"}, ${addr?.numero ?? ""}${addr?.bairro ? ` (${addr.bairro})` : ""}`;
          groups.push({
            groupId: gid,
            enderecoId: info.enderecoId,
            label: `${label} (${info.count} entrega${info.count > 1 ? "s" : ""})`,
            count: info.count,
          });
        }
        setOpenGroups(groups);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto">
      <NovaEntregaForm clientes={clientes} openGroups={openGroups} />
    </div>
  );
}
