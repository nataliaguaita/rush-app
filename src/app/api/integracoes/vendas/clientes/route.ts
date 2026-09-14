import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";
import { tratarEnderecoExterno } from "@/lib/parse-endereco-externo";

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

  for (const item of clientes) {
    if (!item.codigo || !item.nome) {
      revisaoNecessaria.push(item.codigo || "(sem código)");
      continue;
    }

    let enderecoTratado = null;
    if (item.endereco && item.cep) {
      enderecoTratado = await tratarEnderecoExterno(item.endereco, item.cep);
    }

    // Endereço "oficial" do sistema de vendas pode não ser o de entrega (ex:
    // matriz fora de Curitiba, entrega aqui). Por isso não descartamos o
    // cliente — ele entra inativo, pra revisão manual na aba Inativos.
    const foraDaRegiao = !!(
      enderecoTratado?.cidade && !CIDADES_ATENDIDAS.has(enderecoTratado.cidade.toLowerCase())
    );

    const { data: existente } = await supabase
      .from("clientes")
      .select("id")
      .eq("codigo_externo", item.codigo)
      .maybeSingle();

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
          active: foraDaRegiao ? false : (item.ativo ?? true),
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

    if (foraDaRegiao || !enderecoTratado || enderecoTratado.precisaRevisao || !enderecoTratado.cidade) {
      revisaoNecessaria.push(item.codigo);
    }

    if (!enderecoTratado || !enderecoTratado.cidade) continue;

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
    });
  }

  return NextResponse.json({ status: "ok", processados, revisao_necessaria: revisaoNecessaria });
}
