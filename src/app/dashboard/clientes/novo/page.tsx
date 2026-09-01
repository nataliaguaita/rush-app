"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function NovoClientePage() {
  const [enderecos, setEnderecos] = useState<EnderecoForm[]>([emptyEndereco(0)]);
  const [nextKey, setNextKey] = useState(1);

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
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
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
              <Label htmlFor="phone">WhatsApp / Telefone</Label>
              <Input id="phone" name="phone" placeholder="(11) 99999-9999" />
            </div>
          </CardContent>
        </Card>

        {enderecos.map((end, index) => (
          <Card key={end.key} className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {enderecos.length === 1 ? "Endereço" : `Endereço ${index + 1}`}
                  </CardTitle>
                  {index === 0 && (
                    <CardDescription>Adicione o endereço principal</CardDescription>
                  )}
                </div>
                {enderecos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEndereco(end.key)}
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
                  onChange={(e) => updateEndereco(end.key, "label", e.target.value)}
                  placeholder='Ex: "Escritório"'
                />
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Rua *</Label>
                  <Input
                    value={end.rua}
                    onChange={(e) => updateEndereco(end.key, "rua", e.target.value)}
                    required
                    placeholder="Rua"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número *</Label>
                  <Input
                    value={end.numero}
                    onChange={(e) => updateEndereco(end.key, "numero", e.target.value)}
                    required
                    placeholder="Nº"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Complemento</Label>
                <Input
                  value={end.complemento}
                  onChange={(e) => updateEndereco(end.key, "complemento", e.target.value)}
                  placeholder="Sala, andar, bloco..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={end.bairro}
                    onChange={(e) => updateEndereco(end.key, "bairro", e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade *</Label>
                  <Input
                    value={end.cidade}
                    onChange={(e) => updateEndereco(end.key, "cidade", e.target.value)}
                    required
                    placeholder="Cidade"
                  />
                </div>
              </div>
              <div className="w-1/3 space-y-2">
                <Label>CEP</Label>
                <Input
                  value={end.cep}
                  onChange={(e) => updateEndereco(end.key, "cep", e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </CardContent>
          </Card>
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
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Cadastrar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}
