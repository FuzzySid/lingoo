import { Search, History, Bookmark } from 'lucide-react'

type Page = 'search' | 'history' | 'saved'

interface LayoutProps {
  children: React.ReactNode
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* TopAppBar — hidden on History page (HistoryView has its own header) */}
      {currentPage !== 'history' && (
        <header className="bg-surface flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-primary tracking-tighter">Lingoo</h1>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="pb-32">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 backdrop-blur-xl z-50 rounded-t-lg shadow-[0_-10px_40px_-10px_rgba(53,37,205,0.08)]">
        <NavItem
          icon={<Search size={22} />}
          label="Search"
          active={currentPage === 'search'}
          onClick={() => onNavigate('search')}
        />
        <NavItem
          icon={<Bookmark size={22} />}
          label="Saved"
          active={currentPage === 'saved'}
          activeClassName="bg-primary text-on-primary"
          onClick={() => onNavigate('saved')}
        />
        <NavItem
          icon={<History size={22} />}
          label="History"
          active={currentPage === 'history'}
          onClick={() => onNavigate('history')}
        />
      </nav>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  activeClassName?: string
  onClick?: () => void
}

function NavItem({ icon, label, active, activeClassName = 'bg-surface-container-low text-primary', onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 transition-all duration-300 ease-in-out rounded-full ${
        active ? activeClassName : 'text-slate-400 hover:text-primary'
      }`}
    >
      {icon}
      <span className="text-[11px] font-medium tracking-wide uppercase mt-1">{label}</span>
    </button>
  )
}
