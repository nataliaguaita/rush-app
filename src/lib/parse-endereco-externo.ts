// Trata o formato do sistema de vendas: um campo "endereco" em texto livre
// (rua + número + complemento juntos) e um "cep" separado. Consulta o CEP na
// ViaCEP pra obter bairro/cidade de forma confiável (o texto livre não é
// confiável pra isso). Quando algo não fecha (CEP inválido/não encontrado ou
// número não identificado no texto), marca precisaRevisao em vez de gravar
// dado ruim — quem decide o que fazer com isso é revisão manual.

export interface EnderecoTratado {
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  cep: string | null;
  precisaRevisao: boolean;
}

const NUMERO_TOKEN = /\d{1,6}[a-zA-Z]?/;
const MARCADOR_NUMERO = /\bn[º°o]?\.?$/i;
const SEPARADOR_FINAL = /[,\-]\s*$/;
const SEPARADOR_INICIAL = /^[,\-]\s*/;

function parseTextoEndereco(texto: string): { rua: string; numero: string; complemento: string | null; ok: boolean } {
  const alvo = texto.trim();
  const match = alvo.match(NUMERO_TOKEN);
  if (!match || match.index === undefined) {
    return { rua: alvo, numero: "S/N", complemento: null, ok: false };
  }

  const numero = match[0];
  let rua = alvo.slice(0, match.index).trim();
  rua = rua.replace(SEPARADOR_FINAL, "").trim();
  rua = rua.replace(MARCADOR_NUMERO, "").trim();
  rua = rua.replace(SEPARADOR_FINAL, "").trim();

  let complemento = alvo.slice(match.index + numero.length).trim();
  complemento = complemento.replace(SEPARADOR_INICIAL, "").trim();

  return { rua, numero, complemento: complemento || null, ok: true };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Uma falha pontual de rede/timeout não pode jogar um CEP válido pra fila de
// revisão manual pra sempre — 3 tentativas com pequeno intervalo cobre o caso
// comum de instabilidade transitória sem represar demais um sync com muitos
// clientes.
async function consultaCep(cep: string): Promise<{ bairro: string; cidade: string } | null> {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const json = await res.json();
      if (json.erro) return null;
      return { bairro: json.bairro || "", cidade: json.localidade || "" };
    } catch {
      if (tentativa < 3) await sleep(500 * tentativa);
    }
  }
  return null;
}

export async function tratarEnderecoExterno(enderecoTexto: string, cepBruto: string): Promise<EnderecoTratado> {
  const cep = (cepBruto || "").replace(/\D/g, "");
  const { rua, numero, complemento, ok: numeroOk } = parseTextoEndereco(enderecoTexto || "");

  if (cep.length !== 8) {
    return { rua, numero, complemento, bairro: null, cidade: null, cep: null, precisaRevisao: true };
  }

  const cepData = await consultaCep(cep);
  if (!cepData) {
    return { rua, numero, complemento, bairro: null, cidade: null, cep, precisaRevisao: true };
  }

  return {
    rua,
    numero,
    complemento,
    bairro: cepData.bairro || null,
    cidade: cepData.cidade,
    cep,
    precisaRevisao: !numeroOk,
  };
}
