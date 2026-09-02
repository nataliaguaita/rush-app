"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCep } from "@/lib/use-cep";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClienteMultiEnderecos } from "../actions";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface EnderecoForm {
  key: number;
  label: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  cep: string;
}

function emptyEndereco(key: number): EnderecoForm {
  return { key, label: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", cep: "" };
}

function EnderecoCard({
  end,
  index,
  total,
  onUpdate,
  onRemove,
}: {
  end: EnderecoForm;
  index: number;
  total: number;
  onUpdate: (key: number, field: keyof EnderecoForm, value: string) => void;
  onRemove: (key: number) => void;
}) {
  const handleCepResult = useCallback(
    (data: { rua: string; bairro: string; cidade: string }) => {
      onUpdate(end.key, "rua", data.rua);
      onUpdate(end.key, "bairro", data.bairro);
      onUpdate(end.key, "cidade", data.cidade);
    },
    [end.key, onUpdate]
  );
  const { fetchCep, loading: cepLoading } = useCep(handleCepResult);

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {total === 1 ? "Endereço" : `Endereço ${index + 1}`}
            </CardTitle>
            {index === 0 && (
              <CardDescription>Adicione o endereço principal</CardDescription>
            )}
          </div>
          {total > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(end.key)}
              aria-label={`Remover endereço ${index + 1}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Apelido do endereço</Label>
          <Input
            value={end.label}
            onChange={(e) => onUpdate(end.key, "label", e.target.value)}
            placeholder='Ex: "Escritório"'
          />
        </div>
        <Separator />
        <div className="w-full sm:w-1/3 space-y-2">
          <Label>CEP</Label>
          <div className="relative">
            <Input
              value={end.cep}
              onChange={(e) => {
                onUpdate(end.key, "cep", e.target.value);
                fetchCep(e.target.value);
              }}
              placeholder="00000-000"
            />
            {cepLoading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-2">
            <Label>Rua *</Label>
            <Input
              value={end.rua}
              onChange={(e) => onUpdate(end.key, "rua", e.target.value)}
              required
              placeholder="Rua"
            />
          </div>
          <div className="space-y-2">
            <Label>Número *</Label>
            <Input
              value={end.numero}
              onChange={(e) => onUpdate(end.key, "numero", e.target.value)}
              required
              placeholder="Nº"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Complemento</Label>
          <Input
            value={end.complemento}
            onChange={(e) => onUpdate(end.key, "complemento", e.target.value)}
            placeholder="Sala, andar, bloco..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Bairro</Label>
            <Input
              value={end.bairro}
              onChange={(e) => onUpdate(end.key, "bairro", e.target.value)}
              placeholder="Bairro"
            />
          </div>
          <div className="space-y-2">
            <Label>Cidade *</Label>
            <Input
              value={end.cidade}
              onChange={(e) => onUpdate(end.key, "cidade", e.target.value)}
              required
              placeholder="Cidade"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NovoClientePage() {
  const [enderecos, setEnderecos] = useState<EnderecoForm[]>([emptyEndereco(0)]);
  const [nextKey, setNextKey] = useState(1);
  const [loading, setLoading] = useState(false);

  function addEndereco() {
    setEnderecos((prev) => [...prev, emptyEndereco(nextKey)]);
    setNextKey((k) => k + 1);
  }

  function removeEndereco(key: number) {
    setEnderecos((prev) => prev.filter((e) => e.key !== key));
  }

  function updateEndereco(key: number, field: keyof EnderecoForm, value: string) {
    setEnderecos((prev) =>
      prev.map((e) => (e.key === key ? { ...e, [field]: value } : e))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = (formData.get("phone") as string) || null;

    setLoading(true);
    try {
      await createClienteMultiEnderecos(
        { name, phone },
        enderecos
          .filter((end) => end.rua.trim() !== "")
          .map(({ key: _key, ...rest }) => rest)
      );
      toast.success("Cliente cadastrado!");
      window.location.href = "/dashboard/clientes";
    } catch (err: any) {
      toast.error("Erro ao cadastrar", { description: err.message });
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="icon" aria-label="Voltar">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Novo Cliente</h1>
          <p className="text-muted-foreground">Cadastre um novo cliente com endereço(s)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" name="name" required placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                maxLength={15}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                  else if (digits.length > 0) formatted = `(${digits}`;
                  if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                  else if (digits.length > 6 && digits.length <= 10) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
                  e.target.value = formatted;
                }}
              />
            </div>
          </CardContent>
        </Card>

        {enderecos.map((end, index) => (
          <EnderecoCard
            key={end.key}
            end={end}
            index={index}
            total={enderecos.length}
            onUpdate={updateEndereco}
            onRemove={removeEndereco}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full"
          onClick={addEndereco}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar outro endereço
        </Button>

        <div className="mt-6 flex justify-end gap-3">
          <Link href="/dashboard/clientes">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Cliente"}
          </Button>
        </div>
      </form>
    </div>
  );
}
