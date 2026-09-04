import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidUsername, normalizeUsername, usernameToSyntheticEmail } from "@/lib/username";
import { toTitleCase } from "@/lib/utils";

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

  const body = await request.json();
  const { name: rawName, username: rawUsername, password, role, phone } = body;

  if (!rawName || !rawUsername || !password || !role) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const name = toTitleCase(rawName);

  const username = normalizeUsername(rawUsername);
  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Usuário deve ter 3-30 caracteres: letras, números, ponto, hífen ou underscore" },
      { status: 400 }
    );
  }

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email: usernameToSyntheticEmail(username),
    password,
    email_confirm: true,
    user_metadata: { name, role, username },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already been registered")) {
      return NextResponse.json({ error: "Esse nome de usuário já está em uso" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.user) {
    await adminSupabase
      .from("profiles")
      .update({ username, phone: phone || null })
      .eq("id", data.user.id);
  }

  return NextResponse.json({ success: true });
}
