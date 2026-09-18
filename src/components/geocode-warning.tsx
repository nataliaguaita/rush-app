import { Loader2, TriangleAlert } from "lucide-react";
import type { GeocodeCheckStatus } from "@/lib/use-geocode-check";

export function GeocodeWarning({ status }: { status: GeocodeCheckStatus }) {
  if (status === "checking") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Verificando localização no mapa...
      </p>
    );
  }
  if (status === "failed") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
        <TriangleAlert className="h-3 w-3 shrink-0" />
        Não localizamos esse endereço no mapa. Pode salvar mesmo assim, mas ele vai aparecer &quot;sem GPS&quot; nas entregas.
      </p>
    );
  }
  return null;
}
