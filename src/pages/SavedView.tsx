import { Bookmark, ArrowRight } from 'lucide-react'
import type { TrilingualEntry } from '../services/dictionaryService'
import type { SavedItem } from '../types/dictionary'

interface SavedViewProps {
  savedItems: SavedItem[]
  onViewDetails: (query: string, data: TrilingualEntry) => void
}

const LANG_BADGE: Record<'en' | 'hi' | 'es', { bg: string; text: string; label: string }> = {
  en: { bg: 'bg-tertiary-fixed',  text: 'text-on-tertiary-fixed-variant', label: 'EN' },
  hi: { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed-variant', label: 'HI' },
  es: { bg: 'bg-primary-fixed',   text: 'text-on-primary-fixed-variant',   label: 'ES' },
}

function getDefinition(item: SavedItem): string {
  if (item.savedFromLanguage === 'hi') return item.fullData.hi.meaning
  if (item.savedFromLanguage === 'es') return item.fullData.es.definition
  return item.fullData.en.definition
}

function formatSavedAge(timestamp: number): string {
  const diffDays = Math.floor((Date.now() - timestamp) / 86400000)
  if (diffDays < 1) return 'Saved today'
  if (diffDays === 1) return 'Saved 1 day ago'
  if (diffDays < 7) return `Saved ${diffDays} days ago`
  const weeks = Math.floor(diffDays / 7)
  if (weeks === 1) return 'Saved 1 week ago'
  if (weeks < 4) return `Saved ${weeks} weeks ago`
  const months = Math.floor(diffDays / 30)
  return months === 1 ? 'Saved 1 month ago' : `Saved ${months} months ago`
}

export default function SavedView({ savedItems, onViewDetails }: SavedViewProps) {
  return (
    <div className="pt-4 pb-32 px-6 max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight leading-none mb-2">
            Saved Words
          </h2>
          <p className="text-on-surface-variant text-sm font-medium">
            {savedItems.length === 0
              ? 'Your library is empty'
              : `${savedItems.length} ${savedItems.length === 1 ? 'item' : 'items'} curated in your library`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors">
          <span className="text-sm font-semibold tracking-wide">Sort</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 9l4-4 4 4" /><path d="M16 15l-4 4-4-4" />
          </svg>
        </button>
      </div>

      {/* Empty state */}
      {savedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <Bookmark size={48} className="opacity-20" />
          <p className="text-sm font-medium text-center">
            No saved words yet.<br />Save words while searching!
          </p>
        </div>
      )}

      {/* Cards */}
      {savedItems.length > 0 && (
        <div className="space-y-6">
          {savedItems.map((item, idx) => {
            const badge = LANG_BADGE[item.savedFromLanguage]
            const isEven = idx % 2 === 0
            const cardBg = isEven
              ? 'bg-surface-container-lowest'
              : 'bg-surface-container-low hover:bg-surface-container-lowest'

            return (
              <div
                key={item.id}
                className={`group relative ${cardBg} p-6 rounded-lg transition-all duration-300 hover:shadow-[0_20px_50px_-20px_rgba(53,37,205,0.12)]`}
              >
                {/* Top row: language badge + icons */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-[10px] font-bold rounded-full tracking-widest`}>
                    {badge.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <Bookmark size={20} fill="currentColor" className="text-primary" />
                    <button
                      onClick={() => onViewDetails(item.query, item.fullData)}
                      className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Word */}
                <h3 className="text-4xl font-black text-on-surface mb-2 tracking-tight">
                  {item.displayWord}
                </h3>

                {/* Definition */}
                <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                  {getDefinition(item)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                  <span className="text-xs font-medium text-outline uppercase tracking-widest">
                    {formatSavedAge(item.timestamp)}
                  </span>
                  <button
                    onClick={() => onViewDetails(item.query, item.fullData)}
                    className="text-primary font-bold text-sm hover:underline underline-offset-4"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
