import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

// /api/test/seed e /api/test/cleanup não exigem sessão e cleanup apaga
// entregas/clientes/endereços/fotos do banco inteiro. Checar só
// NODE_ENV !== "production" é fail-open: qualquer preview/staging mal
// configurado (ou rodando com NODE_ENV=development) fica com um endpoint
// destrutivo público. Exige também um segredo compartilhado, comparado em
// tempo constante para não vazar o valor por timing.
export function rejectUnlessTestEndpointsAllowed(request: Request): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Bloqueado em produção" }, { status: 403 });
  }

  const expectedSecret = process.env.TEST_ENDPOINT_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: "TEST_ENDPOINT_SECRET não configurado" }, { status: 403 });
  }

  const providedSecret = request.headers.get("x-test-secret") ?? "";
  if (!safeEqual(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  return null;
}
