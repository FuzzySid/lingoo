export interface DictionaryEntry {
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string
  synonyms: string[]
  antonyms: string[]
  exampleSentence: string
}

export interface HindiEntry {
  word: string           // in Hindi script, e.g. "यात्रा"
  phonetic: string       // romanised transliteration, e.g. "Yātrā"
  meaning: string        // English meaning
  synonyms: string[]     // Hindi script words
  antonyms: string[]     // Hindi script words
  sampleSentence: string // complete Hindi sentence
  hindiNuance: string    // grammatical gender note comparing Hindi & Spanish
}

export interface SpanishEntry {
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string     // Spanish definition
  synonyms: string[]
  antonyms: string[]
  exampleSentence: string
}

export interface TrilingualEntry {
  en: DictionaryEntry
  hi: HindiEntry
  es: SpanishEntry
}

interface DebugInfo {
  tokens: { prompt: number; completion: number; total: number }
  costUSD: number
  costINR: number
}

export async function lookupWord(word: string): Promise<TrilingualEntry> {
  const response = await fetch('/api/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as any)?.error ?? `Lookup failed: ${response.status}`)
  }

  const { debug, ...entry } = await response.json() as TrilingualEntry & { debug: DebugInfo }
  console.log('[Dictionary Debug]', debug)
  return entry as TrilingualEntry
}
