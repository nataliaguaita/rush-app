"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EntregadorHeader, EntregadorBottomNav } from "@/components/entregador-nav";
import type { Profile } from "@/types/database";

export default function EntregadorLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data && data.role === "entregador") {
        setProfile(data as Profile);
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
    }
    loadProfile();
  }, []);

  if (loading || !profile) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <EntregadorHeader profile={profile} />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 pb-20 md:p-6 md:pb-20">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
      <EntregadorBottomNav />
    </div>
  );
}
