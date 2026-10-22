/**
 * Schema do Postgres onde ficam as tabelas do Rush.
 * "public" no Supabase atual; "rush" no Supabase novo (self-hosted), que divide o banco com o catálogo e o promo.
 * Troca-se só a variável de ambiente (e refaz o deploy): NEXT_PUBLIC_SUPABASE_SCHEMA=rush.
 */
export const DB_SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || "public";
