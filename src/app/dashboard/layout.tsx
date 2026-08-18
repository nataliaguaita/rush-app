"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import type { Profile } from "@/types/database";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!data) {
        router.replace("/login");
        return;
      }

      if (data.role === "entregador") {
        router.replace("/entregador");
        return;
      }

      setProfile(data as Profile);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <SidebarNav profile={profile} />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
        {children}
      </main>
    </div>
  );
}
