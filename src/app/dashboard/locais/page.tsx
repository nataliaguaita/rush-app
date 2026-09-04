"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Search } from "lucide-react";
import { LocalDialog } from "./local-dialog";
import type { LocalFrequente } from "@/types/database";

export default function LocaisPage() {
  const [locais, setLocais] = useState<LocalFrequente[]>([]);
  const [busca, setBusca] = useState("");
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase.from("locais_frequentes").select("*").order("name");
    setLocais((data ?? []) as LocalFrequente[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase();
    return locais.filter((l) => l.name.toLowerCase().includes(q));
  }, [locais, busca]);

  return (
    <div className="mx-auto w-full max-w-[50vw] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Endereços Fixos</h1>
          <p className="text-sm text-muted-foreground">
            Locais reutilizáveis nas entregas em grupo (cursos, eventos, etc.)
          </p>
        </div>
        <LocalDialog onSaved={load} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum endereço fixo cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((local) => (
                <TableRow key={local.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{local.name}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="truncate text-muted-foreground"
                    title={`${local.rua}, ${local.numero}${local.bairro ? ` (${local.bairro})` : ""}`}
                  >
                    {local.rua}, {local.numero}
                    {local.bairro ? ` (${local.bairro})` : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={local.active ? "default" : "secondary"}>
                      {local.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <LocalDialog local={local} onSaved={load} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
