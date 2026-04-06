import { Menu, Search, History, Bookmark, User } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* TopAppBar */}
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-black text-primary tracking-tighter">Lingoo</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden ring-2 ring-primary/10">
          <span className="text-on-primary text-sm font-bold">S</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-32">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 backdrop-blur-xl z-50 rounded-t-lg shadow-[0_-10px_40px_-10px_rgba(53,37,205,0.08)]">
        <NavItem icon={<Search size={22} />} label="Search" active />
        <NavItem icon={<History size={22} />} label="History" />
        <NavItem icon={<Bookmark size={22} />} label="Saved" />
        <NavItem icon={<User size={22} />} label="Account" />
      </nav>
    </div>
  )
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex flex-col items-center justify-center p-3 transition-all duration-300 ease-in-out ${
        active
          ? 'bg-surface-container-low text-primary rounded-full'
          : 'text-slate-400 hover:text-primary'
      }`}
    >
      {icon}
      <span className="text-[11px] font-medium tracking-wide uppercase mt-1">{label}</span>
    </a>
  )
}
