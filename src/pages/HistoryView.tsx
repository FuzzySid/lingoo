import { useState } from 'react'
import { Search, Clock, ArrowRight, TrendingUp, Sparkles, History } from 'lucide-react'
import type { HistoryItem } from '../types/dictionary'

interface HistoryViewProps {
  history: HistoryItem[]
  onClearHistory: () => void
  onQuickSearch: (query: string) => void
}

function sameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

function formatTimestamp(timestamp: number): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} mins ago`

  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  if (sameDay(date, now)) return `Today, ${fmt(date)}`

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (sameDay(date, yesterday)) return `Yesterday, ${fmt(date)}`

  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${fmt(date)}`
}

function isDevanagari(text: string) {
  return /[\u0900-\u097F]/.test(text)
}

export default function HistoryView({ history, onClearHistory, onQuickSearch }: HistoryViewProps) {
  const [filter, setFilter] = useState('')

  const filteredHistory = filter.trim()
    ? history.filter(item =>
        item.query.toLowerCase().includes(filter.trim().toLowerCase())
      )
    : history

  const todayCount = history.filter(item => sameDay(new Date(item.timestamp), new Date())).length

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="w-full sticky top-0 z-50 bg-surface">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <h1 className="font-bold text-lg tracking-tight text-primary">History</h1>
          <button
            onClick={onClearHistory}
            className="hover:opacity-80 transition-opacity active:scale-95 font-medium text-sm text-primary"
          >
            Clear All
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Filter input */}
        <div className="mb-12">
          <div className="relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
            <input
              className="w-full h-[60px] bg-surface-container-high border-none rounded-xl px-14 text-on-surface focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-on-surface-variant/50 outline-none"
              placeholder="Search your history..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* History list */}
        <div className="space-y-6">
          {/* Section header */}
          <div className="flex items-center px-2 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 shrink-0">
              Recent Entries
            </h2>
            <span className="flex-grow h-px bg-outline-variant/20 ml-4" />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant gap-3">
              <History size={40} className="opacity-30" />
              <p className="text-sm font-medium">
                {filter ? 'No results match your search' : 'No history yet. Start searching!'}
              </p>
            </div>
          ) : (
            filteredHistory.map(item => (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-lg p-5 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] border border-outline-variant/10 hover:shadow-[0_20px_40px_-15px_rgba(53,37,205,0.08)] transition-all duration-300 group"
              >
                <div className="flex flex-col">
                  <span
                    className={`font-black text-on-surface tracking-tight mb-1 ${
                      isDevanagari(item.query) ? 'text-lg leading-relaxed' : 'text-2xl'
                    }`}
                  >
                    {item.query}
                  </span>
                  <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                <button
                  onClick={() => onQuickSearch(item.query)}
                  className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-primary-container/20 group-hover:bg-primary"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            ))
          )}

          <div className="h-12" />
        </div>

        {/* Vocabulary Insights bento grid */}
        <section className="mt-12 space-y-4">
          <h3 className="text-sm font-bold text-on-surface-variant/80 px-2">Vocabulary Insights</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-container/20 p-6 rounded-lg flex flex-col justify-between aspect-square border border-secondary-container/30">
              <TrendingUp size={36} className="text-secondary" />
              <div>
                <p className="text-3xl font-black text-on-secondary-container">{todayCount}</p>
                <p className="text-xs font-medium text-on-secondary-container/70">New words today</p>
              </div>
            </div>
            <div className="bg-tertiary-fixed p-6 rounded-lg flex flex-col justify-between aspect-square border border-tertiary-container/10">
              <Sparkles size={36} className="text-tertiary" />
              <div>
                <p className="text-3xl font-black text-on-tertiary-fixed">{history.length}</p>
                <p className="text-xs font-medium text-on-tertiary-fixed/70">Total words</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
