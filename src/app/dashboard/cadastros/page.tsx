"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CadastroDialog } from "./cadastro-dialog";
import { EditProfileDialog } from "./edit-profile-dialog";

const PER_PAGE = 20;

type Filtro = "Vendedores" | "Entregadores" | "Inativos";

export default function CadastrosPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("Vendedores");
  const [pagina, setPagina] = useState(1);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("*").order("name");
    setProfiles(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtrados = useMemo(() => {
    const filtered = profiles.filter((p) => {
      const matchNome = p.name?.toLowerCase().includes(busca.toLowerCase());
      if (filtro === "Vendedores") return matchNome && p.role === "vendedor" && p.active !== false;
      if (filtro === "Entregadores") return matchNome && p.role === "entregador" && p.active !== false;
      if (filtro === "Inativos") return matchNome && !p.active;
      return matchNome;
    });
    filtered.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "pt-BR"));
    return filtered;
  }, [profiles, busca, filtro]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * PER_PAGE,
    paginaAtual * PER_PAGE
  );

  useEffect(() => {
    setPagina(1);
  }, [busca, filtro]);

  return (
    <div className="mx-auto w-full max-w-[50vw] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Cadastros</h1>
        <CadastroDialog onCreated={load} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filtro} onValueChange={(v) => setFiltro(v as Filtro)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vendedores">Vendedores</SelectItem>
            <SelectItem value="Entregadores">Entregadores</SelectItem>
            <SelectItem value="Inativos">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiveis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum cadastro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              visiveis.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="uppercase">{profile.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {profile.username && `@${profile.username}`}
                    {profile.username && profile.phone && " · "}
                    {profile.phone}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={profile.active ? "default" : "secondary"}>
                      {profile.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <EditProfileDialog profile={profile} onSaved={load} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filtrados.length} cadastro{filtrados.length !== 1 && "s"} — página{" "}
            {paginaAtual} de {totalPaginas}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={paginaAtual <= 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={paginaAtual >= totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
