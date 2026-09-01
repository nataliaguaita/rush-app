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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("[create-user] SUPABASE_URL:", supabaseUrl);
  console.log("[create-user] SERVICE_KEY present:", !!serviceKey, "length:", serviceKey?.length);

  // Test raw fetch to Supabase
  try {
    const testRes = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: serviceKey! },
    });
    console.log("[create-user] raw fetch test:", testRes.status);
  } catch (e: any) {
    console.log("[create-user] raw fetch FAILED:", e.message, e.cause);
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const adminSupabase = getAdminClient();

  const { data: { user }, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !user) {
    console.log("[create-user] auth failed:", authError?.message);
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
  const { name, email, password, role, phone } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (phone && data.user) {
    await adminSupabase
      .from("profiles")
      .update({ phone })
      .eq("id", data.user.id);
  }

  return NextResponse.json({ success: true });
}
