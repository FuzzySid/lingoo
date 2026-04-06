import { useState, useCallback } from 'react'
import { lookupWord, type TrilingualEntry } from '../services/dictionaryService'

interface UseDictionaryReturn {
  data: TrilingualEntry | null
  loading: boolean
  error: string | null
  lookup: (word: string) => Promise<void>
}

export function useDictionary(): UseDictionaryReturn {
  const [data, setData] = useState<TrilingualEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async (word: string) => {
    if (!word.trim()) return
    setLoading(true)
    setError(null)
    try {
      const entry = await lookupWord(word)
      setData(entry)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, lookup }
}
