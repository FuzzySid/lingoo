import type { TrilingualEntry } from '../services/dictionaryService'

export interface HistoryItem {
  id: string
  query: string
  timestamp: number
}

export interface SavedItem {
  id: string
  query: string                          // original search query (used for cache lookup)
  displayWord: string                    // word in savedFromLanguage
  savedFromLanguage: 'en' | 'hi' | 'es'
  fullData: TrilingualEntry
  timestamp: number
}
