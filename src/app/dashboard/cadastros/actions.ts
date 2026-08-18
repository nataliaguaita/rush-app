"use client";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const phone = (formData.get("phone") as string) || null;

  const res = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role, phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error };
  }

  return { success: true };
}
