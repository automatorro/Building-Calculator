/**
 * normalize.ts
 * Utilitar pentru normalizarea diacriticelor românești în căutări.
 * Permite căutarea "caramida" → găsește "cărămidă", "tigla" → "țiglă" etc.
 */

export function normalizeRo(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    // Romanian-specific substitutions (both Unicode variants)
    .replace(/[ăâ]/g, 'a')
    .replace(/î/g, 'i')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't')
}

/**
 * Verifică dacă un string conține query-ul, ignorând diacritice și majuscule.
 * Ex: normalizeContains("Zidărie din cărămidă", "caramida") → true
 */
export function normalizeContains(haystack: string, needle: string): boolean {
  return normalizeRo(haystack).includes(normalizeRo(needle))
}
