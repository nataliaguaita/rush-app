export type EntregaStatus =
  | "aguardando_atribuicao"
  | "rota_definida"
  | "em_rota"
  | "entregue"
  | "recusada";

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
};

export function getStatusMeta(status: string) {
  return (
    STATUS_META[status as EntregaStatus] ?? {
      label: status,
      className: "bg-muted text-muted-foreground",
    }
  );
}

export const RECEIVER_ROLE_LABELS: Record<string, string> = {
  secretaria: "Secretária",
  porteiro: "Porteiro",
  morador_vizinho: "Morador / Vizinho",
  proprietario: "Proprietário da Compra",
};
