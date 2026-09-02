"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { geocodeExistingAddresses } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Users, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [semGps, setSemGps] = useState(0);
  const [geocoding, setGeocoding] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("clientes")
        .select("*, enderecos(*)")
        .order("name");
      setClientes(data ?? []);

      const { count } = await supabase
        .from("enderecos")
        .select("id", { count: "exact", head: true })
        .is("lat", null);
      setSemGps(count ?? 0);
    }
    load();
  }, []);

  async function handleGeocode() {
    setGeocoding(true);
    try {
      const result = await geocodeExistingAddresses();
      toast.success(`${result.updated} de ${result.total} endereços atualizados com GPS.`);
      setSemGps((prev) => prev - result.updated);
    } catch {
      toast.error("Erro ao geocodificar endereços.");
    }
    setGeocoding(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">{clientes.length} clientes cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          {semGps > 0 && (
            <Button variant="outline" onClick={handleGeocode} disabled={geocoding}>
              {geocoding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
              {geocoding ? "Geocodificando..." : `Corrigir GPS (${semGps})`}
            </Button>
          )}
          <Link href="/dashboard/clientes/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </div>

      {clientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Nenhum cliente cadastrado ainda</p>
              <p className="text-sm text-muted-foreground">Cadastre o primeiro cliente para começar a criar entregas.</p>
            </div>
            <Link href="/dashboard/clientes/novo">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Link key={cliente.id} href={`/dashboard/clientes/${cliente.id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{cliente.name}</CardTitle>
                    <Badge variant={cliente.active ? "default" : "secondary"}>
                      {cliente.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {cliente.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {cliente.phone}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {cliente.enderecos?.length ?? 0} endereço(s)
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
