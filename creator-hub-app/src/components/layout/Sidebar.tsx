import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Camera,
  ShoppingBag,
  Lock,
  UserCircle,
  DollarSign,
  Sparkles,
  X,
  Crown,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useUIStore } from '../../stores/uiStore'

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3, badge: null },
  { path: '/content', label: 'Content Studio', icon: Camera, badge: null },
  { path: '/orders', label: 'Orders', icon: ShoppingBag, badge: null },
  { path: '/subscribers', label: 'Subscribers', icon: Users, badge: null },
  { path: '/vault', label: 'Content Vault', icon: Lock, badge: null },
  { path: '/clients', label: 'Rolodex', icon: UserCircle, badge: null },
  { path: '/finances', label: 'Finances', icon: DollarSign, badge: null },
]

export function Sidebar() {
  const { mobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-64 bg-onyx border-r border-slate-dark',
          'flex flex-col transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-dark">
          <div className="w-9 h-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
            <Crown className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-ivory leading-tight">
              Creator Hub
            </h1>
            <p className="text-[10px] text-gold-dim tracking-widest uppercase">Command Center</p>
          </div>
          <button
            onClick={closeMobileSidebar}
            className="ml-auto lg:hidden p-1 text-muted hover:text-cream"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-soft hover:text-cream hover:bg-charcoal border border-transparent'
                )}
              >
                <Icon className={cn('w-[18px] h-[18px]', isActive ? 'text-gold' : 'text-muted')} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] text-muted bg-slate-dark px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-dark">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Sparkles className="w-3.5 h-3.5 text-gold-dim" />
            <span>v1.0 — All 7 Modules Live ✨</span>
          </div>
        </div>
      </aside>
    </>
  )
}
