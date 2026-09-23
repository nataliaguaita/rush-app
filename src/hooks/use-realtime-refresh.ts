"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Chama `onChange` quando outra pessoa altera `table` (Supabase Realtime).
 * - agrupa rajadas de eventos (ex.: reordenar rota = N updates) numa só recarga;
 * - recarrega ao reconectar o canal e ao voltar para a aba, porque o Realtime
 *   não reenvia eventos perdidos enquanto a conexão estava caída/suspensa.
 */
export function useRealtimeRefresh(channelName: string, table: string, onChange: () => void, debounceMs = 300) {
  const callback = useRef(onChange);
  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let subscribedOnce = false;
    const trigger = () => {
      clearTimeout(timer);
      timer = setTimeout(() => callback.current(), debounceMs);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") trigger();
    };

    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table }, trigger)
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") return;
        // o 1º SUBSCRIBED é o da montagem (a página já carregou); os seguintes são reconexões
        if (subscribedOnce) trigger();
        subscribedOnce = true;
      });
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      supabase.removeChannel(channel);
    };
  }, [channelName, table, debounceMs]);
}
