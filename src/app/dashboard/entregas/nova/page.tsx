import { createClient } from "@/lib/supabase/server";
import { NovaEntregaForm } from "./nova-entrega-form";

export default async function NovaEntregaPage() {
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("*, enderecos(*)")
    .eq("active", true)
    .order("name");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nova Entrega</h1>
        <p className="text-muted-foreground">
          Cadastre uma nova entrega para despacho
        </p>
      </div>
      <NovaEntregaForm clientes={clientes ?? []} />
    </div>
  );
}
