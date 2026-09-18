import { useCallback, useRef, useState } from "react";
import { geocode } from "@/lib/geocode";

export type GeocodeCheckStatus = "idle" | "checking" | "ok" | "failed";

export function useGeocodeCheck() {
  const [status, setStatus] = useState<GeocodeCheckStatus>("idle");
  const tokenRef = useRef(0);

  const check = useCallback(async (rua: string, numero: string, cidade: string) => {
    if (!rua.trim() || !cidade.trim()) {
      setStatus("idle");
      return;
    }
    const token = ++tokenRef.current;
    setStatus("checking");
    const coords = await geocode(rua, numero, cidade);
    const isLatest = token === tokenRef.current;
    if (isLatest) setStatus(coords ? "ok" : "failed"); // ignora resposta antiga se o campo já mudou
  }, []);

  const reset = useCallback(() => {
    tokenRef.current++;
    setStatus("idle");
  }, []);

  const markResult = useCallback((hasCoords: boolean) => {
    tokenRef.current++;
    setStatus(hasCoords ? "ok" : "failed");
  }, []);

  return { status, check, reset, markResult };
}
