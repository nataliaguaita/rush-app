"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Trash2 } from "lucide-react";
import { ClienteEditForm } from "./cliente-edit-form";
import { AddEnderecoForm } from "./add-endereco-form";
import { deleteEndereco } from "../actions";
import { toast } from "sonner";

export default function ClienteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [cliente, setCliente] = useState<any>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("clientes")
      .select("*, enderecos(*)")
      .eq("id", id)
      .single();
    setCliente(data);
  }

  useEffect(() => { load(); }, [id]);

  if (!cliente) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  async function handleDeleteEndereco(enderecoId: string) {
    await deleteEndereco(enderecoId);
    toast.success("Endereço removido");
    load();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{cliente.name}</h1>
          {cliente.phone && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {cliente.phone}
            </p>
          )}
        </div>
        <Badge variant={cliente.active ? "default" : "secondary"}>
          {cliente.active ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <ClienteEditForm cliente={cliente} onSaved={load} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Endereços</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cliente.enderecos && cliente.enderecos.length > 0 ? (
            cliente.enderecos.map((end: any) => (
              <div key={end.id} className="flex items-start justify-between rounded-lg border p-3">
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    {end.label && <p className="text-sm font-medium">{end.label}</p>}
                    <p className="text-sm">
                      {end.rua}, {end.numero}
                      {end.complemento ? ` - ${end.complemento}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[end.bairro, end.cidade, end.cep].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEndereco(end.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
          )}

          <AddEnderecoForm clienteId={cliente.id} onSaved={load} />
        </CardContent>
      </Card>
    </div>
  );
}
