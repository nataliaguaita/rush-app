import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const { enderecoId } = await request.json();
  if (!enderecoId) {
    return NextResponse.json({ error: "ID do endereço não informado" }, { status: 400 });
  }

  const { error } = await adminSupabase.from("enderecos").update({ active: false }).eq("id", enderecoId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
