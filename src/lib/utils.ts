import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const TITLE_CASE_LOWERCASE_WORDS = new Set(["de", "da", "do", "das", "dos", "e"]);

// Padroniza nomes e endereços (ex: "joao da silva" -> "Joao da Silva").
// Não usar em campos de observação/texto livre.
export function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      word.length > 0 && (i === 0 || !TITLE_CASE_LOWERCASE_WORDS.has(word))
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");
}
