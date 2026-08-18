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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova Entrega</h1>
        <p className="text-muted-foreground">Cadastre uma nova entrega para despacho</p>
      </div>
      <NovaEntregaForm clientes={clientes} />
    </div>
  );
}
