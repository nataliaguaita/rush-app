"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Options {
  debounceMs?: number;
  /** Só eventos das entregas do usuário logado (`entregador_id`): poupa rede e bateria do entregador. */
  mine?: boolean;
}

/**
 * Chama `onChange` quando outra pessoa altera `table` (Supabase Realtime).
 * - agrupa rajadas de eventos (ex.: reordenar rota = N updates) numa só recarga;
 * - com a aba oculta fecha o canal (poupa bateria) e, ao voltar, reabre e recarrega,
 *   porque o Realtime não reenvia eventos perdidos enquanto a conexão estava caída/suspensa;
 * - recarrega também ao reconectar o canal.
 */
export function useRealtimeRefresh(
  channelName: string,
  table: string,
  onChange: () => void,
  { debounceMs = 300, mine = false }: Options = {},
) {
  const callback = useRef(onChange);
  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let channel: RealtimeChannel | undefined;
    let filter: string | undefined;
    let cancelled = false;
    let subscribedOnce = false;

    const trigger = () => {
      clearTimeout(timer);
      timer = setTimeout(() => callback.current(), debounceMs);
    };
    const open = () => {
      if (channel) return;
      // o 1º SUBSCRIBED é o da (re)abertura, coberto por quem chamou; os seguintes são reconexões
      subscribedOnce = false;
      channel = supabase
        .channel(channelName)
        .on("postgres_changes", { event: "*", schema: "public", table, ...(filter && { filter }) }, trigger)
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") return;
          if (subscribedOnce) trigger();
          subscribedOnce = true;
        });
    };
    const close = () => {
      if (channel) supabase.removeChannel(channel);
      channel = undefined;
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(timer);
        close();
      } else {
        open();
        trigger();
      }
    };

    if (mine) {
      // getSession lê a sessão local (sem rede)
      supabase.auth.getSession().then(({ data }) => {
        const uid = data.session?.user.id;
        if (cancelled || !uid) return;
        filter = `entregador_id=eq.${uid}`;
        if (document.visibilityState === "visible") open();
      });
    } else if (document.visibilityState === "visible") {
      open();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      close();
    };
  }, [channelName, table, debounceMs, mine]);
}
