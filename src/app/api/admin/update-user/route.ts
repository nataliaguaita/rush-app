import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidUsername, normalizeUsername, usernameToSyntheticEmail } from "@/lib/username";

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

  const { data: callerProfile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!callerProfile || callerProfile.role !== "admin") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const { id, name, username: rawUsername, password, role, phone, active } = body;

  if (!id || !name || !rawUsername || !role) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const username = normalizeUsername(rawUsername);
  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Usuário deve ter 3-30 caracteres: letras, números, ponto, hífen ou underscore" },
      { status: 400 }
    );
  }

  const authUpdate: Record<string, unknown> = {
    email: usernameToSyntheticEmail(username),
    user_metadata: { name, role, username },
  };
  if (password) {
    authUpdate.password = password;
  }

  const { error: authUpdateError } = await adminSupabase.auth.admin.updateUserById(id, authUpdate);
  if (authUpdateError) {
    if (authUpdateError.message.toLowerCase().includes("already been registered")) {
      return NextResponse.json({ error: "Esse nome de usuário já está em uso" }, { status: 400 });
    }
    return NextResponse.json({ error: authUpdateError.message }, { status: 400 });
  }

  const { error: profileError } = await adminSupabase
    .from("profiles")
    .update({ name, username, role, phone: phone || null, active })
    .eq("id", id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
