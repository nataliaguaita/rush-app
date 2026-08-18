import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EntregadorNav } from "@/components/entregador-nav";

export default async function EntregadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "entregador") redirect("/dashboard");

  return (
    <div className="flex h-screen flex-col">
      <EntregadorNav profile={profile} />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4">
        {children}
      </main>
    </div>
  );
}
