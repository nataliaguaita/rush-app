"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NovaEntregaForm } from "./nova-entrega-form";

export default function NovaEntregaPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("clientes")
        .select("*, enderecos(*)")
        .eq("active", true)
        .order("name");
      setClientes(data ?? []);
    }
    load();
  }, []);

  return (
    <div className="mx-auto">
      <NovaEntregaForm clientes={clientes} />
    </div>
  );
}
