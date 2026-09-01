import { useState, useCallback } from "react";

interface CepData {
  rua: string;
  bairro: string;
  cidade: string;
}

export function useCep(onResult: (data: CepData) => void) {
  const [loading, setLoading] = useState(false);

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
      } catch {
        // network error — user fills manually
      } finally {
        setLoading(false);
      }
    },
    [onResult]
  );

  return { fetchCep, loading };
}
