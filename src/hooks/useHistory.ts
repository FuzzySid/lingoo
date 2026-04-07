import { useState, useCallback, useEffect } from 'react'
import type { HistoryItem } from '../types/dictionary'

interface UseHistoryReturn {
  history: HistoryItem[]
  addHistoryItem: (query: string) => void
  clearHistory: () => void
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('lingoo_history')
      return stored ? (JSON.parse(stored) as HistoryItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('lingoo_history', JSON.stringify(history))
  }, [history])

  const addHistoryItem = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setHistory(prev => {
      if (prev[0]?.query.toLowerCase() === trimmed.toLowerCase()) return prev
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        query: trimmed,
        timestamp: Date.now(),
      }
      return [newItem, ...prev]
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { history, addHistoryItem, clearHistory }
}
