import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Bloqueado em produção" }, { status: 403 });
  }

  const db = getAdmin();
  const log: string[] = [];

  // Delete all entregas (fotos first due to FK)
  const { data: fotos } = await db.from("entrega_fotos").select("storage_path");
  if (fotos?.length) {
    await db.storage.from("entregas").remove(fotos.map((f) => f.storage_path));
    log.push(`${fotos.length} fotos removidas do storage`);
  }
  await db.from("entrega_fotos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  log.push("entrega_fotos limpo");

  await db.from("rotas_diarias").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  log.push("rotas_diarias limpo");

  await db.from("entregas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  log.push("entregas limpo");

  await db.from("enderecos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  log.push("enderecos limpo");

  await db.from("clientes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  log.push("clientes limpo");

  return NextResponse.json({ success: true, log });
}
