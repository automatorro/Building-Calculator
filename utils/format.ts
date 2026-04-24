/**
 * Formatare standard a numerelor în aplicație.
 * Toate sumele / valorile se afișează cu exact 2 zecimale, format ro-RO.
 */
export function fmtRon(n: number): string {
  return n.toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
