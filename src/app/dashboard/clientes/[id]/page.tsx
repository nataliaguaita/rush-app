"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { ClienteEditForm } from "./cliente-edit-form";
import { AddEnderecoForm } from "./add-endereco-form";
import { EditEnderecoForm } from "./edit-endereco-form";
import { deleteEndereco } from "../actions";
import { toast } from "sonner";
import { getStatusMeta, formatOrderNumber } from "@/lib/status";

type OrdemEntregas = "Mais recentes" | "Mais antigas";

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [cliente, setCliente] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [editandoEnderecoId, setEditandoEnderecoId] = useState<string | null>(null);
  const [adicionandoEndereco, setAdicionandoEndereco] = useState(false);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [ordemEntregas, setOrdemEntregas] = useState<OrdemEntregas>("Mais recentes");
  const [filtroData, setFiltroData] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("clientes")
      .select("*, enderecos(*)")
      .eq("id", id)
      .single();
    setCliente(data);
  }

  async function loadEntregas() {
    const { data } = await supabase
      .from("entregas")
      .select("id, order_number, status, created_at, scheduled_date")
      .eq("cliente_id", id)
      .order("created_at", { ascending: false });
    setEntregas(data ?? []);
  }

  useEffect(() => {
    load();
    loadEntregas();
  }, [id]);

  const entregasOrdenadas = useMemo(() => {
    let lista = [...entregas];
    if (filtroData) {
      lista = lista.filter((e) => e.created_at.startsWith(filtroData));
    }
    lista.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return ordemEntregas === "Mais recentes" ? dateB - dateA : dateA - dateB;
    });
    return lista;
  }, [entregas, ordemEntregas, filtroData]);

  if (!cliente) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>;
  }

  async function handleDeleteEndereco(enderecoId: string) {
    const result = await deleteEndereco(enderecoId);
    if (result.error) {
      toast.error("Erro ao remover endereço", { description: result.error });
      return;
    }
    toast.success("Endereço removido");
    load();
  }

  return (
    <div className="mx-auto w-full max-w-[50vw] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase">{cliente.name}</h1>
          <Badge variant={cliente.active ? "default" : "secondary"} className="mt-1">
            {cliente.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {editando ? (
        <ClienteEditForm
          cliente={cliente}
          onSaved={() => {
            load();
            setEditando(false);
          }}
          onCancel={() => setEditando(false)}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Dados do Cliente</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setEditando(true)}>
              <Pencil className="mr-1 h-4 w-4" />
              Editar
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Nome:</span>{" "}
              <span className="uppercase">{cliente.name}</span>
            </div>
            {cliente.phone && (
              <div>
                <span className="text-muted-foreground">Telefone:</span> {cliente.phone}
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              {cliente.active ? "Ativo" : "Inativo"}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Endereços</CardTitle>
          {!adicionandoEndereco && (
            <Button variant="outline" size="sm" onClick={() => setAdicionandoEndereco(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Adicionar
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {cliente.enderecos && cliente.enderecos.filter((e: any) => e.active !== false).length > 0 ? (
            cliente.enderecos.filter((e: any) => e.active !== false).map((end: any) =>
              editandoEnderecoId === end.id ? (
                <EditEnderecoForm
                  key={end.id}
                  endereco={end}
                  onSaved={() => { setEditandoEnderecoId(null); load(); }}
                  onCancel={() => setEditandoEnderecoId(null)}
                />
              ) : (
                <div key={end.id} className="flex items-center justify-between rounded-lg border p-3">
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
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" aria-label="Editar endereço" onClick={() => setEditandoEnderecoId(end.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button variant="outline" size="icon" aria-label="Remover endereço">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover endereço?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {end.label ? `"${end.label}" — ` : ""}
                            {end.rua}, {end.numero}. Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDeleteEndereco(end.id)}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
          )}

          {adicionandoEndereco && (
            <AddEnderecoForm
              clienteId={cliente.id}
              onSaved={() => { setAdicionandoEndereco(false); load(); }}
              onCancel={() => setAdicionandoEndereco(false)}
              startOpen
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-lg">Histórico de Entregas</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-[160px]"
            />
            <Select value={ordemEntregas} onValueChange={(v) => setOrdemEntregas(v as OrdemEntregas)}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mais recentes">Mais recentes</SelectItem>
                <SelectItem value="Mais antigas">Mais antigas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {entregasOrdenadas.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma entrega registrada.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entregasOrdenadas.map((e) => {
                    const meta = getStatusMeta(e.status);
                    return (
                      <TableRow key={e.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/entregas/${e.id}`)}>
                        <TableCell>{formatOrderNumber(e.order_number)}</TableCell>
                        <TableCell>
                          {new Date(e.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={meta.className}>{meta.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
