import { NextRequest } from 'next/server'

const store = new Map<string, number[]>()

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = (store.get(key) ?? []).filter(t => now - t < windowMs)
  if (timestamps.length >= maxRequests) return false
  timestamps.push(now)
  store.set(key, timestamps)
  return true
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}
