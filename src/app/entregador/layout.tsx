"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EntregadorHeader, EntregadorBottomNav } from "@/components/entregador-nav";
import { OfflineSync } from "@/components/offline-sync";
import { Spinner } from "@/components/ui/spinner";
import { isOffline } from "@/lib/offline-queue";
import type { Profile } from "@/types/database";

const PROFILE_CACHE = "rush-entregador-profile";

function cachedProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch { return null; }
}

export default function EntregadorLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      // getUser() valida o token na rede: sem sinal ele falha e não podemos
      // mandar o entregador para o login no meio da rota.
      const user = await supabase.auth.getUser()
        .then(({ data }) => data.user)
        .catch(() => null);

      if (!user) {
        const cached = cachedProfile();
        if (cached && isOffline()) { setProfile(cached); setLoading(false); return; }
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data && data.role === "entregador") {
        setProfile(data as Profile);
        setLoading(false);
        try { localStorage.setItem(PROFILE_CACHE, JSON.stringify(data)); } catch {}
        return;
      }

      const cached = cachedProfile();
      if (!data && cached && isOffline()) { setProfile(cached); setLoading(false); return; }

      router.replace("/dashboard");
    }
    loadProfile();
  }, [router, supabase]);

  if (loading || !profile) {
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <EntregadorHeader profile={profile} />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 pb-20 md:p-6 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <OfflineSync />
          {children}
        </div>
      </main>
      <EntregadorBottomNav />
    </div>
  );
}
