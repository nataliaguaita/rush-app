"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CadastroDialog } from "./cadastro-dialog";
import { EditProfileDialog } from "./edit-profile-dialog";

export default function CadastrosPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").order("name");
    setProfiles(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const vendedores = profiles.filter((p) => p.role === "vendedor");
  const entregadores = profiles.filter((p) => p.role === "entregador");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Cadastros</h1>
          <p className="text-muted-foreground">Gerencie vendedores e entregadores</p>
        </div>
        <CadastroDialog onCreated={load} />
      </div>

      <Tabs defaultValue="vendedores">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="vendedores">Vendedores ({vendedores.length})</TabsTrigger>
          <TabsTrigger value="entregadores">Entregadores ({entregadores.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vendedores" className="mt-4">
          <ProfileList profiles={vendedores} onUpdated={load} />
        </TabsContent>
        <TabsContent value="entregadores" className="mt-4">
          <ProfileList profiles={entregadores} onUpdated={load} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileList({
  profiles,
  onUpdated,
}: {
  profiles: any[];
  onUpdated: () => void;
}) {
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
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{profile.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {profile.username && `@${profile.username}`}
                  {profile.username && profile.phone && " · "}
                  {profile.phone}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={profile.active ? "default" : "secondary"}>
                {profile.active ? "Ativo" : "Inativo"}
              </Badge>
              <EditProfileDialog profile={profile} onSaved={onUpdated} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
