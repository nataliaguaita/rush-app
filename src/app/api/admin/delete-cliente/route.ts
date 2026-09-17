import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const adminSupabase = getAdminClient();

  const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { clienteId } = await request.json();
  if (typeof clienteId !== "string" || !UUID_PATTERN.test(clienteId)) {
    return NextResponse.json({ error: "ID do cliente inválido" }, { status: 400 });
  }

  // Se o cliente veio da integração com o sistema de vendas, registra o
  // código externo antes de apagar — assim a próxima sincronização não
  // recria quem já foi descartado de propósito.
  const { data: cliente } = await adminSupabase
    .from("clientes")
    .select("codigo_externo")
    .eq("id", clienteId)
    .single();
  if (cliente?.codigo_externo) {
    await adminSupabase
      .from("clientes_excluidos_integracao")
      .upsert({ codigo_externo: cliente.codigo_externo });
  }

  const { error } = await adminSupabase.from("clientes").delete().eq("id", clienteId);
  if (error) {
    if (error.code === "23503") {
      return NextResponse.json(
        { error: "Não é possível excluir: este cliente possui entregas registradas." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
