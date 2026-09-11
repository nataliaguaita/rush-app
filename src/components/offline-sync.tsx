"use client";

import { useEffect } from "react";
import { CloudOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { applyOp } from "@/app/entregador/actions";
import { clearFailed, flushQueue, initQueue, useQueueStore } from "@/lib/offline-queue";

export function OfflineSync() {
  const count = useQueueStore((s) => s.count);
  const syncing = useQueueStore((s) => s.syncing);
  const failed = useQueueStore((s) => s.failed);

  useEffect(() => {
    const flush = () => flushQueue(applyOp);
    initQueue().then(flush);

    const onVisible = () => {
      if (document.visibilityState === "visible") flush();
    };
    window.addEventListener("online", flush);
    document.addEventListener("visibilitychange", onVisible);

    // navigator.onLine mente com sinal fraco (diz online sem rede real),
    // então também tentamos periodicamente enquanto houver fila.
    const interval = setInterval(() => {
      if (useQueueStore.getState().count > 0) flush();
    }, 30_000);

    return () => {
      window.removeEventListener("online", flush);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (failed === 0) return;
    toast.error(
      failed === 1
        ? "1 registro não pôde ser enviado. Refaça essa entrega."
        : `${failed} registros não puderam ser enviados. Refaça essas entregas.`,
    );
    clearFailed();
  }, [failed]);

  if (count === 0) return null;

  return (
    <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
      {syncing ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <CloudOff className="h-4 w-4 shrink-0" />
      )}
      <span>
        {syncing
          ? `Enviando ${count} registro${count > 1 ? "s" : ""}...`
          : `${count} registro${count > 1 ? "s" : ""} salvo${count > 1 ? "s" : ""} no aparelho. Enviaremos assim que houver internet.`}
      </span>
    </div>
  );
}
