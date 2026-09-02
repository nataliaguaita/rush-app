"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "./actions";

export function EditProfileDialog({
  profile,
  onSaved,
}: {
  profile: any;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = (formData.get("password") as string) || undefined;
    const result = await updateProfile(profile.id, {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      password,
      role: formData.get("role") as string,
      phone: (formData.get("phone") as string) || null,
      active: formData.get("active") === "true",
    });

    setLoading(false);

    if (result.error) {
      toast.error("Erro ao atualizar", { description: result.error });
      return;
    }

    toast.success("Cadastro atualizado!");
    setOpen(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={`Editar ${profile.name}`}>
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cadastro</DialogTitle>
          <DialogDescription>
            Atualize os dados de {profile.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-role">Tipo</Label>
            <Select
              name="role"
              defaultValue={profile.role}
              items={{ vendedor: "Vendedor", entregador: "Entregador" }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="entregador">Entregador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome *</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={profile.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-username">Nome de usuário *</Label>
            <Input
              id="edit-username"
              name="username"
              defaultValue={profile.username ?? ""}
              autoCapitalize="none"
              autoCorrect="off"
              pattern="[a-zA-Z0-9._\-]{3,30}"
              title="3-30 caracteres: letras, números, ponto, hífen ou underscore"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-password">Senha</Label>
            <div className="relative">
              <Input
                id="edit-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Deixe em branco para não alterar"
                minLength={6}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Telefone</Label>
            <Input
              id="edit-phone"
              name="phone"
              defaultValue={profile.phone ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-active">Status</Label>
            <Select
              name="active"
              defaultValue={String(profile.active)}
              items={{ true: "Ativo", false: "Inativo" }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
