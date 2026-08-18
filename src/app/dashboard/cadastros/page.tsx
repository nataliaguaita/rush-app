"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadastroDialog } from "./cadastro-dialog";

export default function CadastrosPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*").order("name");
      setProfiles(data ?? []);
    }
    load();
  }, []);

  const vendedores = profiles.filter((p) => p.role === "vendedor");
  const entregadores = profiles.filter((p) => p.role === "entregador");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cadastros</h1>
          <p className="text-muted-foreground">Gerencie vendedores e entregadores</p>
        </div>
        <CadastroDialog />
      </div>

      <Tabs defaultValue="vendedores">
        <TabsList>
          <TabsTrigger value="vendedores">Vendedores ({vendedores.length})</TabsTrigger>
          <TabsTrigger value="entregadores">Entregadores ({entregadores.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vendedores" className="mt-4">
          <ProfileList profiles={vendedores} />
        </TabsContent>
        <TabsContent value="entregadores" className="mt-4">
          <ProfileList profiles={entregadores} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileList({ profiles }: { profiles: any[] }) {
  if (profiles.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Nenhum cadastro encontrado.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {profiles.map((profile) => (
        <Card key={profile.id}>
          <CardContent className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{profile.name}</p>
                {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
              </div>
            </div>
            <Badge variant={profile.active ? "default" : "secondary"}>
              {profile.active ? "Ativo" : "Inativo"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
