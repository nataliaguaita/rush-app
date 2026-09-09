"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatOrderNumber, STALE_HOURS } from "@/lib/status";
import { useStaleEntregas } from "@/hooks/use-stale-entregas";

export function StaleEntregasBanner() {
  const entregas = useStaleEntregas();
  if (entregas.length === 0) return null;

  return (
    <Card className="border-amber-500/40 bg-amber-50/50 dark:bg-amber-500/5">
      <CardContent className="space-y-2 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {entregas.length} entrega{entregas.length > 1 ? "s" : ""} esquecida{entregas.length > 1 ? "s" : ""} há mais de {STALE_HOURS}h
        </div>
        <div className="flex flex-wrap gap-2">
          {entregas.map((e) => (
            <Link
              key={e.id}
              href={`/dashboard/entregas/${e.id}`}
              className="flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-background px-2 py-1 text-xs hover:bg-amber-500/10"
            >
              <span className="font-mono text-muted-foreground">{formatOrderNumber(e.order_number)}</span>
              <span className="max-w-[140px] truncate">{e.cliente?.name ?? "Cliente"}</span>
              <StatusBadge status={e.status} className="text-[10px]" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
