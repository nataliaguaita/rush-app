"use client";

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
import { createCliente } from "../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NovoClientePage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createCliente(new FormData(e.currentTarget));
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
          <p className="text-muted-foreground">Cadastre um novo cliente com endereço</p>
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

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Endereço</CardTitle>
            <CardDescription>Adicione o endereço principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Apelido do endereço</Label>
              <Input id="label" name="label" placeholder='Ex: "Escritório"' />
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="rua">Rua *</Label>
                <Input id="rua" name="rua" required placeholder="Rua" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input id="numero" name="numero" required placeholder="Nº" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" name="complemento" placeholder="Sala, andar, bloco..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" name="bairro" placeholder="Bairro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input id="cidade" name="cidade" required placeholder="Cidade" />
              </div>
            </div>
            <div className="w-1/3 space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" name="cep" placeholder="00000-000" />
            </div>
          </CardContent>
        </Card>

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
