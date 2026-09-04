export type EntregaStatus =
  | "aguardando_atribuicao"
  | "rota_definida"
  | "em_rota"
  | "entregue"
  | "recusada"
  | "retornada"
  | "cancelada";

export const STATUS_META: Record<
  EntregaStatus,
  { label: string; className: string }
> = {
  aguardando_atribuicao: {
    label: "Aguardando",
    className: "bg-status-pending/10 text-status-pending",
  },
  rota_definida: {
    label: "Rota Definida",
    className: "bg-status-scheduled/10 text-status-scheduled",
  },
  em_rota: {
    label: "Em Rota",
    className: "bg-status-active/10 text-status-active",
  },
  entregue: {
    label: "Entregue",
    className: "bg-status-success/10 text-status-success",
  },
  recusada: {
    label: "Recusada",
    className: "bg-destructive/10 text-destructive",
  },
  retornada: {
    label: "Retornada",
    className: "bg-orange-500/10 text-orange-600",
  },
  cancelada: {
    label: "Cancelada",
    className: "bg-muted text-muted-foreground",
  },
};

export function getStatusMeta(status: string) {
  return (
    STATUS_META[status as EntregaStatus] ?? {
      label: status,
      className: "bg-muted text-muted-foreground",
    }
  );
}

export function formatOrderNumber(orderNumber: number): string {
  return `#${String(orderNumber).padStart(4, "0")}`;
}

export function formatScheduledDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + "T00:00:00");
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Entregar Hoje";
  if (diff === 1) return "Entregar Amanhã";
  return `Entregar em ${date.toLocaleDateString("pt-BR")}`;
}

export const RECEIVER_ROLE_LABELS: Record<string, string> = {
  secretaria: "Secretária",
  porteiro: "Porteiro",
  morador_vizinho: "Morador / Vizinho",
  proprietario: "Proprietário da Compra",
};
