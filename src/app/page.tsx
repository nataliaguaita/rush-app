"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const user = await supabase.auth.getUser()
        .then(({ data }) => data.user)
        .catch(() => null);

      // Sem internet, o entregador abre o app pelo ícone e cai aqui:
      // manda para a rota salva no aparelho em vez de travar no spinner
      // (o layout do entregador leva ao login se houver rede e não houver sessão).
      if (!user && localStorage.getItem("rush-entregador-profile")) {
        router.replace("/entregador");
        return;
      }

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "entregador") {
        router.replace("/entregador");
      } else {
        router.replace("/dashboard");
      }
    }

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
