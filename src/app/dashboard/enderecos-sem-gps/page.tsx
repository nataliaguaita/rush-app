"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fetchAll } from "@/lib/fetch-all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, MapPinOff, RefreshCw, Undo2, UserX } from "lucide-react";
import { toast } from "sonner";
import { useCep } from "@/lib/use-cep";
import { retryGeocode, resgatarClienteExcluido, setManualCoords, type AddressFields, type EnderecoSemGpsKind } from "./actions";

const PAGE_SIZE = 10;

interface ClienteSemEndereco {
  id: string;
  name: string;
  codigoExterno: string | null;
  active: boolean;
}

interface Row {
  kind: EnderecoSemGpsKind;
  id: string;
  title: string;
  subtitle: string;
  codigoExterno: string | null;
  fields: AddressFields;
}

interface ClienteExcluido {
  codigoExterno: string;
  excluidoEm: string;
}

export default function EnderecosSemGpsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [clientesSemEndereco, setClientesSemEndereco] = useState<ClienteSemEndereco[]>([]);
  const [clientPage, setClientPage] = useState(1);
  const [excluidos, setExcluidos] = useState<ClienteExcluido[]>([]);
  const [resgatando, setResgatando] = useState<string | null>(null);
  const [excluidosBusca, setExcluidosBusca] = useState("");
  const [excluidosPage, setExcluidosPage] = useState(1);
  const supabase = createClient();

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: enderecos }, { data: locais }, clientesData, { data: excluidosData, error: excluidosError }] = await Promise.all([
      supabase
        .from("enderecos")
        .select("*, clientes(name, codigo_externo)")
        .eq("active", true)
        .or("lat.is.null,lng.is.null"),
      supabase
        .from("locais_frequentes")
        .select("*")
        .eq("active", true)
        .or("lat.is.null,lng.is.null"),
      fetchAll((from, to) =>
        supabase
          .from("clientes")
          .select("id, name, codigo_externo, active, enderecos(active)")
          .order("name")
          .range(from, to)
      ),
      supabase
        .from("clientes_excluidos_integracao")
        .select("codigo_externo, excluido_em")
        .order("excluido_em", { ascending: false }),
    ]);

    if (excluidosError) {
      toast.error("Erro ao carregar clientes descartados", { description: excluidosError.message });
    }
    setExcluidos(
      (excluidosData ?? []).map((e) => ({ codigoExterno: e.codigo_externo, excluidoEm: e.excluido_em }))
    );

    setClientesSemEndereco(
      clientesData
        .filter((c) => !c.enderecos.some((e) => e.active !== false))
        .map((c) => ({ id: c.id, name: c.name, codigoExterno: c.codigo_externo, active: c.active }))
    );

    const enderecoRows: Row[] = (enderecos ?? []).map((e) => ({
      kind: "endereco" as const,
      id: e.id,
      title: e.clientes?.name ?? (e.label || "Endereço avulso de entrega"),
      subtitle: e.clientes?.name ? "Endereço de cliente" : "Entrega avulsa (não vinculado a cliente)",
      codigoExterno: e.clientes?.codigo_externo ?? null,
      fields: {
        rua: e.rua ?? "",
        numero: e.numero === "S/N" ? "" : (e.numero ?? ""),
        complemento: e.complemento ?? "",
        bairro: e.bairro ?? "",
        cidade: e.cidade ?? "",
        cep: e.cep ?? "",
      },
    }));

    const localRows: Row[] = (locais ?? []).map((l) => ({
      kind: "local" as const,
      id: l.id,
      title: l.name,
      subtitle: "Endereço fixo / curso",
      codigoExterno: null,
      fields: {
        rua: l.rua ?? "",
        numero: l.numero === "S/N" ? "" : (l.numero ?? ""),
        complemento: l.complemento ?? "",
        bairro: l.bairro ?? "",
        cidade: l.cidade ?? "",
        cep: l.cep ?? "",
      },
    }));

    setRows([...enderecoRows, ...localRows]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const clientTotalPages = Math.max(1, Math.ceil(clientesSemEndereco.length / PAGE_SIZE));
  const clientCurrentPage = Math.min(clientPage, clientTotalPages);
  const pageClientes = clientesSemEndereco.slice((clientCurrentPage - 1) * PAGE_SIZE, clientCurrentPage * PAGE_SIZE);

  const excluidosFiltrados = useMemo(
    () => excluidos.filter((e) => e.codigoExterno.toLowerCase().includes(excluidosBusca.trim().toLowerCase())),
    [excluidos, excluidosBusca]
  );
  const excluidosTotalPages = Math.max(1, Math.ceil(excluidosFiltrados.length / PAGE_SIZE));
  const excluidosCurrentPage = Math.min(excluidosPage, excluidosTotalPages);
  const pageExcluidos = excluidosFiltrados.slice(
    (excluidosCurrentPage - 1) * PAGE_SIZE,
    excluidosCurrentPage * PAGE_SIZE
  );

  async function handleResgatar(codigoExterno: string) {
    setResgatando(codigoExterno);
    try {
      await resgatarClienteExcluido(codigoExterno);
      toast.success("Cliente resgatado! Ele volta a ser criado na próxima sincronização.");
      setExcluidos((prev) => prev.filter((e) => e.codigoExterno !== codigoExterno));
    } catch (err) {
      toast.error("Erro ao resgatar cliente", { description: err instanceof Error ? err.message : undefined });
    }
    setResgatando(null);
  }

  return (
    <div className="mx-auto w-full max-w-full space-y-4 lg:max-w-[60vw]">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPinOff className="h-6 w-6 text-amber-500" />
          Endereços sem GPS
        </h1>
        <p className="text-sm text-muted-foreground">
          Endereços que não conseguimos localizar automaticamente no mapa. Corrija o texto e tente de novo, ou informe as coordenadas manualmente.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Nenhum endereço pendente.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {pageRows.map((row) => (
              <RowCard key={`${row.kind}-${row.id}`} row={row} onResolved={load} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Página {currentPage} de {totalPages} — {rows.length} endereços pendentes
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="pt-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <UserX className="h-5 w-5 text-amber-500" />
          Clientes sem endereço
        </h2>
        <p className="text-sm text-muted-foreground">
          Clientes cadastrados (ativos ou inativos) que não têm nenhum endereço ativo.
        </p>
      </div>

      {!loading && clientesSemEndereco.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Nenhum cliente sem endereço.
          </CardContent>
        </Card>
      ) : !loading && (
        <>
          <div className="rounded-md border">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[120px]">Código</TableHead>
                  <TableHead className="w-[100px] text-right">Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageClientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium truncate">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.codigoExterno ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={c.active ? "default" : "secondary"}>
                        {c.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/clientes/${c.id}`} className="text-xs text-primary underline underline-offset-2">
                        Adicionar
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {clientTotalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Página {clientCurrentPage} de {clientTotalPages} — {clientesSemEndereco.length} clientes sem endereço
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setClientPage(clientCurrentPage - 1)} disabled={clientCurrentPage <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setClientPage(clientCurrentPage + 1)} disabled={clientCurrentPage >= clientTotalPages}>
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="pt-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Undo2 className="h-5 w-5 text-amber-500" />
          Clientes descartados
        </h2>
        <p className="text-sm text-muted-foreground">
          Clientes excluídos manualmente da integração de vendas. Resgatar recria o cliente na próxima sincronização.
        </p>
      </div>

      {!loading && excluidos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Nenhum cliente descartado.
          </CardContent>
        </Card>
      ) : !loading && (
        <>
          <Input
            placeholder="Buscar por código..."
            value={excluidosBusca}
            onChange={(e) => {
              setExcluidosBusca(e.target.value);
              setExcluidosPage(1);
            }}
            className="max-w-xs"
          />
          {excluidosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Nenhum código encontrado.
              </CardContent>
            </Card>
          ) : (
        <div className="rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Excluído em</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageExcluidos.map((e) => (
                <TableRow key={e.codigoExterno}>
                  <TableCell className="font-medium">{e.codigoExterno}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(e.excluidoEm).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleResgatar(e.codigoExterno)}
                      disabled={resgatando === e.codigoExterno}
                    >
                      {resgatando === e.codigoExterno && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Resgatar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
          )}
          {excluidosTotalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Página {excluidosCurrentPage} de {excluidosTotalPages} — {excluidosFiltrados.length} clientes descartados
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExcluidosPage(excluidosCurrentPage - 1)}
                  disabled={excluidosCurrentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExcluidosPage(excluidosCurrentPage + 1)}
                  disabled={excluidosCurrentPage >= excluidosTotalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RowCard({ row, onResolved }: { row: Row; onResolved: () => void }) {
  const [fields, setFields] = useState(row.fields);
  const [manualCoords, setManualCoordsInput] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field: keyof AddressFields, value: string) {
    setFields((p) => ({ ...p, [field]: value }));
  }

  const { fetchCep, loading: cepLoading, filled: cepFilled } = useCep((data) => {
    setFields((p) => ({ ...p, rua: data.rua, bairro: data.bairro, cidade: data.cidade }));
  });
  const cepHighlight = cepFilled ? "ring-2 ring-green-500/50 transition-shadow" : "transition-shadow";

  async function handleRetry() {
    setRetrying(true);
    try {
      const found = await retryGeocode(row.kind, row.id, fields);
      if (found) {
        toast.success("Endereço localizado!");
        onResolved();
      } else {
        toast.error("Ainda não conseguimos localizar esse endereço no mapa.");
      }
    } catch (err) {
      toast.error("Erro ao tentar geocodificar", { description: err instanceof Error ? err.message : undefined });
    }
    setRetrying(false);
  }

  async function handleManualSave() {
    const [latStr, lngStr] = manualCoords.split(",").map((s) => s.trim());
    const lat = parseFloat(latStr ?? "");
    const lng = parseFloat(lngStr ?? "");
    if (!latStr || !lngStr || isNaN(lat) || isNaN(lng)) {
      toast.error("Cole as coordenadas no formato: latitude, longitude");
      return;
    }
    setSaving(true);
    try {
      await setManualCoords(row.kind, row.id, fields, lat, lng);
      toast.success("Coordenadas salvas!");
      onResolved();
    } catch (err) {
      toast.error("Erro ao salvar coordenadas", { description: err instanceof Error ? err.message : undefined });
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {row.title}
          {row.codigoExterno && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">#{row.codigoExterno}</span>
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{row.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr]">
          <div className="space-y-1">
            <Label className="text-xs">CEP</Label>
            <div className="relative">
              <Input
                value={fields.cep}
                onChange={(e) => {
                  const v = e.target.value;
                  update("cep", v);
                  if (v.replace(/\D/g, "").length === 8) fetchCep(v);
                }}
                placeholder="00000-000"
                className="h-8 text-sm"
              />
              {cepLoading && (
                <Loader2 className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Rua</Label>
            <Input value={fields.rua} onChange={(e) => update("rua", e.target.value)} className={`h-8 text-sm ${cepHighlight}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs">Número</Label>
            <Input value={fields.numero} onChange={(e) => update("numero", e.target.value)} placeholder="S/N" className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Complemento</Label>
            <Input value={fields.complemento} onChange={(e) => update("complemento", e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bairro</Label>
            <Input value={fields.bairro} onChange={(e) => update("bairro", e.target.value)} className={`h-8 text-sm ${cepHighlight}`} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Cidade</Label>
          <Input value={fields.cidade} onChange={(e) => update("cidade", e.target.value)} className={`h-8 text-sm ${cepHighlight}`} />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button type="button" size="sm" variant="outline" onClick={handleRetry} disabled={retrying}>
            {retrying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Tentar geocodificar de novo
          </Button>
        </div>

        <div className="flex flex-wrap items-end gap-2 rounded-md border bg-muted/30 p-2.5">
          <div className="flex-1 min-w-[220px] space-y-1">
            <Label className="text-xs">Coordenadas manuais (lat, lng)</Label>
            <Input
              value={manualCoords}
              onChange={(e) => setManualCoordsInput(e.target.value)}
              placeholder="Ex: -25.4284, -49.2733 (copiado do Google Maps)"
              className="h-8 text-sm"
            />
          </div>
          <Button type="button" size="sm" onClick={handleManualSave} disabled={saving || !manualCoords.trim()}>
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Salvar coordenadas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
