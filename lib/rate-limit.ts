// Sliding window rate limiter în memorie — 5 cereri/minut per IP.
// Suficient pentru edge cases; se înlocuiește cu Redis la scală.

const requests = new Map<string, number[]>()

const WINDOW_MS = 60_000 // 1 minut
const MAX_REQUESTS = 5

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const timestamps = (requests.get(ip) || []).filter(t => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0]
    const retryAfterSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  timestamps.push(now)
  requests.set(ip, timestamps)
  return { allowed: true, retryAfterSeconds: 0 }
}
