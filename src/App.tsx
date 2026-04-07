import { useState, useCallback } from 'react'
import Layout from './components/Layout'
import DictionaryView from './pages/DictionaryView'
import HistoryView from './pages/HistoryView'
import SavedView from './pages/SavedView'
import { useHistory } from './hooks/useHistory'
import { useSaved } from './hooks/useSaved'
import type { TrilingualEntry } from './services/dictionaryService'

type Page = 'search' | 'history' | 'saved'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('search')
  const [pendingSearch, setPendingSearch] = useState<string | null>(null)
  const [pendingLoad, setPendingLoad] = useState<{ query: string; data: TrilingualEntry } | null>(null)

  const { history, addHistoryItem, clearHistory } = useHistory()
  const { savedItems, toggleSave, refreshSavedData } = useSaved()

  const handleQuickSearch = useCallback((query: string) => {
    setPendingSearch(query)
    setCurrentPage('search')
  }, [])

  const handleViewDetails = useCallback((query: string, data: TrilingualEntry) => {
    setPendingLoad({ query, data })
    setCurrentPage('search')
  }, [])

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'search' && (
        <DictionaryView
          onWordSearched={addHistoryItem}
          pendingSearch={pendingSearch}
          onPendingSearchConsumed={() => setPendingSearch(null)}
          savedItems={savedItems}
          onToggleSave={toggleSave}
          onRefreshSave={refreshSavedData}
          pendingLoad={pendingLoad}
          onPendingLoadConsumed={() => setPendingLoad(null)}
        />
      )}
      {currentPage === 'history' && (
        <HistoryView
          history={history}
          onClearHistory={clearHistory}
          onQuickSearch={handleQuickSearch}
        />
      )}
      {currentPage === 'saved' && (
        <SavedView
          savedItems={savedItems}
          onViewDetails={handleViewDetails}
        />
      )}
    </Layout>
  )
}

export default App
