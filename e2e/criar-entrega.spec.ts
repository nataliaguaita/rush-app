import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const username = process.env.E2E_USERNAME;
const password = process.env.E2E_PASSWORD;
const marker = `[e2e] ${Date.now()}`;

test.beforeEach(() => {
  test.skip(!username || !password, "Set E2E_USERNAME and E2E_PASSWORD to run this test");
});

// Cleans up the entrega this test creates so E2E runs don't pile up test data.
test.afterEach(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  await createClient(url, key).from("entregas").delete().eq("notes", marker);
});

test("login and create a new entrega", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Usuário").fill(username!);
  await page.getByLabel("Senha", { exact: true }).fill(password!);
  await page.getByRole("button", { name: "Entrar" }).click();

  await page.waitForURL((url) => !url.pathname.startsWith("/login"));

  await page.goto("/dashboard/entregas/nova");
  await expect(page.getByRole("heading", { name: "Nova Entrega" })).toBeVisible();

  await page.getByPlaceholder("Digite o nome do cliente...").fill("a");
  await page.locator("div.absolute.z-50 button").first().click();

  const enderecoTrigger = page.getByText("Escolha o endereço");
  if (await enderecoTrigger.isVisible().catch(() => false)) {
    await enderecoTrigger.click();
    await page.getByRole("option").first().click();
  }

  await page.getByPlaceholder("Observações sobre a entrega...").fill(marker);
  await page.getByRole("button", { name: "Finalizar Cadastro" }).click();

  await expect(page).toHaveURL(/\/dashboard\/entregas$/);
  await expect(page.getByRole("heading", { name: "Organizar Entregas" })).toBeVisible();
});
