// Guarda as telas do app do entregador para ele abrir o app sem internet.
// Os dados (lista, perfil, fila de registros) já ficam no aparelho via
// localStorage/IndexedDB — aqui só entram HTML e arquivos estáticos.
// Chamadas ao Supabase (outro domínio) nunca passam por aqui.

const CACHE = "rush-shell-v2";
const NAV_TIMEOUT_MS = 4000;
const PAGES = ["/", "/login", "/entregador", "/entregador/finalizadas", "/entregador/devolucoes"];
const FILES = ["/logo.svg", "/icon.svg", "/manifest.json"];

async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll(FILES).catch(() => {});
  await Promise.all(
    PAGES.map(async (page) => {
      try {
        const res = await fetch(page, { cache: "no-store" });
        if (!res.ok || res.redirected) return;
        const html = await res.clone().text();
        await cache.put(page, res);
        const assets = [...new Set(html.match(/\/_next\/static\/[^"'\s)\\]+/g) ?? [])];
        await Promise.all(
          assets.map(async (url) => {
            if (!(await cache.match(url))) await cache.add(url).catch(() => {});
          }),
        );
      } catch {
        // sem rede agora: fica para o próximo precache
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Apaga caches de versões antigas (v1...) para o celular recomeçar limpo.
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "precache") event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Arquivos com hash no nome nunca mudam: cache primeiro.
  // ponytail: dentro da mesma versão o cache só cresce; subir CACHE limpa tudo no activate.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Logo/ícone/manifest: rede primeiro, cache se estiver sem internet.
  if (FILES.includes(url.pathname)) {
    event.respondWith(fetch(req).catch(async () => (await caches.match(url.pathname)) || Response.error()));
    return;
  }

  // Telas: rede primeiro (sempre a versão nova). Se a rede falhar ou demorar
  // mais que NAV_TIMEOUT_MS (sinal fraco), usa o cache; sem cache, espera a rede.
  if (req.mode === "navigate") {
    const network = fetch(req)
      .then((res) => {
        if (res.ok && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(url.pathname, copy));
        }
        return res;
      })
      .catch(() => null);
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NAV_TIMEOUT_MS));
    event.respondWith(
      (async () => {
        const res = await Promise.race([network, timeout]);
        if (res) return res;
        const hit = await caches.match(url.pathname);
        return hit || (await network) || Response.error();
      })(),
    );
  }
});
