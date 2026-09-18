import '@testing-library/jest-dom'

// Testes que renderizam componentes com o client Supabase do browser (ex:
// entregador-nav) quebram sem essas variáveis. Localmente existe .env.local,
// mas o CI roda num checkout limpo sem ele - por isso o job de testes nunca
// tinha passado desde que o CI começou a rodar de verdade (era sempre pulado
// por apontar pra branch errada).
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.test'
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
}
