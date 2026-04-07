import { useState, useCallback, useEffect } from 'react'
import type { TrilingualEntry } from '../services/dictionaryService'
import type { SavedItem } from '../types/dictionary'

interface UseSavedReturn {
  savedItems: SavedItem[]
  toggleSave: (query: string, lang: 'en' | 'hi' | 'es', data: TrilingualEntry) => void
  isSaved: (query: string) => boolean
  getSavedItem: (query: string) => SavedItem | undefined
  refreshSavedData: (query: string, newData: TrilingualEntry) => void
}

function matchQuery(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function useSaved(): UseSavedReturn {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('lingoo_saved')
      return stored ? (JSON.parse(stored) as SavedItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('lingoo_saved', JSON.stringify(savedItems))
  }, [savedItems])

  const isSaved = useCallback((query: string) => {
    return savedItems.some(item => matchQuery(item.query, query))
  }, [savedItems])

  const getSavedItem = useCallback((query: string) => {
    return savedItems.find(item => matchQuery(item.query, query))
  }, [savedItems])

  const toggleSave = useCallback((query: string, lang: 'en' | 'hi' | 'es', data: TrilingualEntry) => {
    const trimmed = query.trim()
    setSavedItems(prev => {
      const exists = prev.some(item => matchQuery(item.query, trimmed))
      if (exists) {
        return prev.filter(item => !matchQuery(item.query, trimmed))
      }
      const displayWord =
        lang === 'hi' ? data.hi.word :
        lang === 'es' ? data.es.word :
        data.en.word
      const newItem: SavedItem = {
        id: crypto.randomUUID(),
        query: trimmed,
        displayWord,
        savedFromLanguage: lang,
        fullData: data,
        timestamp: Date.now(),
      }
      return [newItem, ...prev]
    })
  }, [])

  const refreshSavedData = useCallback((query: string, newData: TrilingualEntry) => {
    setSavedItems(prev =>
      prev.map(item =>
        matchQuery(item.query, query) ? { ...item, fullData: newData } : item
      )
    )
  }, [])

  return { savedItems, toggleSave, isSaved, getSavedItem, refreshSavedData }
}
