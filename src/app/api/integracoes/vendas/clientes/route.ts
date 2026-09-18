import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";
import { tratarEnderecoExterno } from "@/lib/parse-endereco-externo";
import { geocode } from "@/lib/geocode";

// ponytail: lista fixa da Região Metropolitana de Curitiba — ajustar aqui se
// o critério de "quem entra no Rush App" mudar.
const CIDADES_ATENDIDAS = new Set([
  "curitiba", "são josé dos pinhais", "colombo", "pinhais", "araucária",
  "campo largo", "fazenda rio grande", "almirante tamandaré", "piraquara",
  "quatro barras", "campina grande do sul",
]);

interface ClienteExterno {
  codigo: string;
  nome: string;
  telefone?: string;
  cpf_cnpj?: string;
  ativo?: boolean;
  endereco?: string;
  cep?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: Request) {
  const expectedToken = process.env.VENDAS_SYNC_TOKEN;
  if (!expectedToken) {
    return NextResponse.json({ status: "erro", mensagem: "VENDAS_SYNC_TOKEN não configurado" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.token !== "string" || !safeEqual(body.token, expectedToken)) {
    return NextResponse.json({ status: "erro", mensagem: "Token inválido" }, { status: 401 });
  }

  const clientes: ClienteExterno[] = Array.isArray(body.clientes) ? body.clientes : null;
  if (!clientes) {
    return NextResponse.json({ status: "erro", mensagem: "Campo 'clientes' ausente ou inválido" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const revisaoNecessaria: string[] = [];
  let processados = 0;

  const { data: excluidos } = await supabase
    .from("clientes_excluidos_integracao")
    .select("codigo_externo");
  const codigosExcluidos = new Set((excluidos ?? []).map((e) => e.codigo_externo));

  for (const item of clientes) {
    if (!item.codigo || !item.nome) {
      revisaoNecessaria.push(item.codigo || "(sem código)");
      continue;
    }

    // Cliente descartado manualmente antes: não recria no próximo sync.
    if (codigosExcluidos.has(item.codigo)) continue;

    let enderecoTratado = null;
    if (item.endereco && item.cep) {
      enderecoTratado = await tratarEnderecoExterno(item.endereco, item.cep);
    }

    const foraDaRegiao = !!(
      enderecoTratado?.cidade && !CIDADES_ATENDIDAS.has(enderecoTratado.cidade.toLowerCase())
    );
    // "Sem endereço" e "CEP/número não confiáveis" ainda entram inativos pra
    // revisão manual — só "fora da região" é descartado (ver abaixo).
    const precisaRevisao =
      !enderecoTratado || enderecoTratado.precisaRevisao || !enderecoTratado.cidade;

    const { data: existente } = await supabase
      .from("clientes")
      .select("id")
      .eq("codigo_externo", item.codigo)
      .maybeSingle();

    // Cliente novo com endereço fora da região atendida: não cadastra. Um
    // cliente que já existe mantém o comportamento anterior — nunca some por
    // causa de um sync (pode ter sido reativado/corrigido manualmente).
    if (!existente && foraDaRegiao) {
      revisaoNecessaria.push(item.codigo);
      continue;
    }

    let clienteId: string;
    if (existente) {
      // Nunca sobrescreve "active" num cliente que já existe: pode ter sido
      // reativado manualmente após revisão, e um novo sync não deve desfazer isso.
      const { error } = await supabase
        .from("clientes")
        .update({
          name: item.nome,
          phone: item.telefone || null,
          cpf_cnpj: item.cpf_cnpj || null,
        })
        .eq("id", existente.id);
      if (error) {
        revisaoNecessaria.push(item.codigo);
        continue;
      }
      clienteId = existente.id;
    } else {
      const { data: novo, error } = await supabase
        .from("clientes")
        .insert({
          codigo_externo: item.codigo,
          name: item.nome,
          phone: item.telefone || null,
          cpf_cnpj: item.cpf_cnpj || null,
          active: precisaRevisao ? false : (item.ativo ?? true),
        })
        .select("id")
        .single();
      if (error || !novo) {
        revisaoNecessaria.push(item.codigo);
        continue;
      }
      clienteId = novo.id;
    }

    processados++;

    if (precisaRevisao) {
      revisaoNecessaria.push(item.codigo);
    }

    if (!enderecoTratado || !enderecoTratado.cidade) continue;

    // Endereço já geocodificado (seja pelo sync original ou por correção manual
    // depois) não é tocado de novo — sem isso, toda sincronização apagava e
    // recriava com o texto bruto de lá, desfazendo qualquer correção manual.
    const { data: enderecoAtual } = await supabase
      .from("enderecos")
      .select("lat")
      .eq("cliente_id", clienteId)
      .eq("label", "Sistema de vendas")
      .maybeSingle();
    if (enderecoAtual?.lat != null) continue;

    // Nominatim limita a ~1 requisição/segundo; sem essa pausa, uma sincronização
    // com muitos clientes estoura o limite e a maioria dos geocodes falha em silêncio.
    const coords = await geocode(enderecoTratado.rua, enderecoTratado.numero, enderecoTratado.cidade);
    await sleep(1100);

    // Endereço vindo da integração é sempre o mesmo (fonte externa tem só 1
    // por cliente): substitui o que existir em vez de acumular duplicado.
    await supabase.from("enderecos").delete().eq("cliente_id", clienteId).eq("label", "Sistema de vendas");
    await supabase.from("enderecos").insert({
      cliente_id: clienteId,
      label: "Sistema de vendas",
      rua: enderecoTratado.rua,
      numero: enderecoTratado.numero,
      complemento: enderecoTratado.complemento,
      bairro: enderecoTratado.bairro,
      cidade: enderecoTratado.cidade,
      cep: enderecoTratado.cep,
      ...coords,
    });
  }

  return NextResponse.json({ status: "ok", processados, revisao_necessaria: revisaoNecessaria });
}
