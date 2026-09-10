import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { normalizeUsername } from "@/lib/username";

const INVALID_CREDENTIALS = { error: "Usuário ou senha inválidos" } as const;

function getAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Público (sem sessão): login por username ou e-mail. Sempre responde com a
// mesma mensagem genérica em caso de erro (username inexistente, perfil sem
// e-mail resolvido ou senha errada), para não expor um oráculo de
// enumeração de contas — diferente do antigo /api/resolve-username, que
// confirmava a existência do username num endpoint separado.
export async function POST(request: Request) {
  const body = await request.json();
  const identifier = body?.identifier;
  const password = body?.password;

  if (!identifier || typeof identifier !== "string" || !password || typeof password !== "string") {
    return NextResponse.json(INVALID_CREDENTIALS, { status: 400 });
  }

  let email = identifier;
  if (!identifier.includes("@")) {
    const username = normalizeUsername(identifier);
    const adminSupabase = getAdminClient();

    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (!profile) {
      return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
    }

    const { data } = await adminSupabase.auth.admin.getUserById(profile.id);
    if (!data.user?.email) {
      return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
    }
    email = data.user.email;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(INVALID_CREDENTIALS, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
