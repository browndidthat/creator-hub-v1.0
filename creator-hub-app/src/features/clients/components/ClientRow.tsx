import { useState } from 'react'
import {
  Crown,
  AlertTriangle,
  ChevronRight,
  Star,
  User,
  ShieldAlert,
} from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { cn, formatCurrency } from '../../../lib/utils'
import type { Client } from '../types'

const tierConfig = {
  vip: { label: 'VIP', variant: 'gold' as const, icon: Crown },
  regular: { label: 'Regular', variant: 'sapphire' as const, icon: Star },
  new: { label: 'New', variant: 'emerald' as const, icon: User },
  inactive: { label: 'Inactive', variant: 'muted' as const, icon: User },
}

const platformEmoji: Record<string, string> = {
  snapchat: '👻',
  instagram: '📸',
  twitter: '🐦',
  onlyfans: '🔒',
  fansly: '💎',
  telegram: '✈️',
  other: '💬',
}

interface ClientRowProps {
  client: Client
  isSelected: boolean
  onSelect: () => void
}

export function ClientRow({ client, isSelected, onSelect }: ClientRowProps) {
  const tier = tierConfig[client.tier]

  const [daysSinceOrder] = useState(() =>
    client.lastOrderDate
      ? Math.floor((Date.now() - new Date(client.lastOrderDate).getTime()) / 86400000)
      : null
  )

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left bg-charcoal border rounded-xl p-4 transition-all duration-200 group',
        isSelected
          ? 'border-gold/40 bg-gold/5 shadow-[0_0_20px_var(--color-gold-glow)]'
          : 'border-slate-dark hover:border-gold-dim/30',
        client.redFlag && 'border-l-2 border-l-ruby'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ backgroundColor: `${client.avatarColor}20`, color: client.avatarColor }}
        >
          {client.displayName.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-ivory truncate">
              {client.displayName}
            </span>
            <Badge variant={tier.variant} dot>
              {tier.label}
            </Badge>
            {client.redFlag && (
              <Badge variant="ruby" dot>
                {client.redFlag.severity === 'block' ? (
                  <><ShieldAlert className="w-3 h-3" /> Blocked</>
                ) : (
                  <><AlertTriangle className="w-3 h-3" /> Warning</>
                )}
              </Badge>
            )}
          </div>

          {/* Platform usernames */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted overflow-hidden">
            {client.platforms.slice(0, 3).map((p) => (
              <span key={p.platform} className="flex items-center gap-1 truncate">
                <span>{platformEmoji[p.platform] || '💬'}</span>
                <span className="truncate">{p.username}</span>
              </span>
            ))}
            {client.platforms.length > 3 && (
              <span className="text-soft">+{client.platforms.length - 3}</span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="text-gold font-medium">
              {formatCurrency(client.totalSpent)}
            </span>
            <span className="text-muted">
              {client.orderCount} order{client.orderCount !== 1 ? 's' : ''}
            </span>
            {daysSinceOrder !== null && (
              <span className={cn(
                daysSinceOrder > 30 ? 'text-amber' : 'text-soft',
              )}>
                {daysSinceOrder === 0
                  ? 'Today'
                  : daysSinceOrder === 1
                    ? 'Yesterday'
                    : `${daysSinceOrder}d ago`}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight
          className={cn(
            'w-4 h-4 mt-3 shrink-0 transition-colors',
            isSelected ? 'text-gold' : 'text-slate-dark group-hover:text-muted'
          )}
        />
      </div>
    </button>
  )
}
