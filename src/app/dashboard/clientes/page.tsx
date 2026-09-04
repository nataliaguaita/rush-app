"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
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
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 20;

type Filtro = "A–Z" | "Mais recentes" | "Inativos";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("A–Z");
  const [pagina, setPagina] = useState(1);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("clientes")
      .select("id, name, active, created_at")
      .order("name")
      .then(({ data }) => setClientes(data ?? []));
  }, []);

  const filtrados = useMemo(() => {
    const filtered = clientes.filter((c) => {
      const matchNome = c.name?.toLowerCase().includes(busca.toLowerCase());
      if (filtro === "Inativos") return matchNome && !c.active;
      return matchNome && c.active !== false;
    });
    if (filtro === "Mais recentes") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      filtered.sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", "pt-BR")
      );
    }
    return filtered;
  }, [clientes, busca, filtro]);

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
    <div className="mx-auto w-full max-w-full space-y-4 lg:max-w-[50vw]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link href="/dashboard/clientes/novo">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
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
            <SelectItem value="A–Z">A–Z</SelectItem>
            <SelectItem value="Mais recentes">Mais recentes</SelectItem>
            <SelectItem value="Inativos">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiveis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              visiveis.map((cliente) => (
                <TableRow key={cliente.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/dashboard/clientes/${cliente.id}`} className="block w-full uppercase">
                      {cliente.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={cliente.active ? "default" : "secondary"}>
                      {cliente.active ? "Ativo" : "Inativo"}
                    </Badge>
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
            {filtrados.length} cliente{filtrados.length !== 1 && "s"} — página{" "}
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
