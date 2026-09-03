import { useState, useCallback, useRef } from "react";

interface CepData {
  rua: string;
  bairro: string;
  cidade: string;
}

export function useCep(onResult: (data: CepData) => void) {
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchCep = useCallback(
    async (raw: string) => {
      const cep = raw.replace(/\D/g, "");
      if (cep.length !== 8) return;

      setLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const json = await res.json();
        if (json.erro) return;
        onResult({
          rua: json.logradouro || "",
          bairro: json.bairro || "",
          cidade: json.localidade || "",
        });
        clearTimeout(timerRef.current);
        setFilled(true);
        timerRef.current = setTimeout(() => setFilled(false), 2000);
      } catch {
        // network error — user fills manually
      } finally {
        setLoading(false);
      }
    },
    [onResult]
  );

  return { fetchCep, loading, filled };
}
