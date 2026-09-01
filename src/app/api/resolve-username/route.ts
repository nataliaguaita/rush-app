import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeUsername } from "@/lib/username";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Público (sem sessão): resolve um nome de usuário para o email interno
// usado no login do Supabase Auth. Não confirma nada além disso.
export async function POST(request: Request) {
  const body = await request.json();
  const rawUsername = body?.username;

  if (!rawUsername || typeof rawUsername !== "string") {
    return NextResponse.json({ email: null });
  }

  const username = normalizeUsername(rawUsername);
  const adminSupabase = getAdminClient();

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!profile) {
    return NextResponse.json({ email: null });
  }

  const { data } = await adminSupabase.auth.admin.getUserById(profile.id);

  return NextResponse.json({ email: data.user?.email ?? null });
}
