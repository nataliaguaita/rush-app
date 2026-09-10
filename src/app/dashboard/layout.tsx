"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Spinner } from "@/components/ui/spinner";
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
  }, [router, supabase]);

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AppShell profile={profile}>
      {children}
    </AppShell>
  );
}
