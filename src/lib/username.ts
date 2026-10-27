export const USERNAME_PATTERN = /^[a-z0-9._-]{3,30}$/;
// O mesmo domínio está em dental-marechal-catalogo/lib/auth-shared.ts (AUTH_EMAIL_DOMAIN): as contas
// são compartilhadas entre os apps, então mudar um sem o outro impede o login. Altere os dois juntos.
const USERNAME_EMAIL_DOMAIN = "login.dentalmarechal.internal";

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

export function usernameToSyntheticEmail(username: string): string {
  return `${username}@${USERNAME_EMAIL_DOMAIN}`;
}
