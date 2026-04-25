import { GoogleGenAI } from '@google/genai'

// NEXT_PUBLIC_ kept as fallback for existing .env files — no longer imported client-side
const apiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GOOGLE_AI_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_AI_KEY ||
  ''

export const geminiClient = new GoogleGenAI({ apiKey })

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  process.env.NEXT_PUBLIC_GEMINI_MODEL ||
  'gemini-3-flash-preview'

// Re-export types for convenience
export type { OptimizationSuggestion, AIAction, SuggestionType } from './ai-types'
