import { Menu, Bell } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { toggleMobileSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-30 bg-obsidian/80 backdrop-blur-xl border-b border-slate-dark">
      <div className="flex items-center gap-4 px-4 py-3 lg:px-6 lg:py-4">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 text-muted hover:text-cream rounded-lg hover:bg-charcoal transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-ivory truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          )}
        </div>

        <button className="relative p-2 text-muted hover:text-cream rounded-lg hover:bg-charcoal transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
        </button>
      </div>
    </header>
  )
}
