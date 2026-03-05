import { Badge } from '../../../components/ui/Badge'
import { CountdownTimer } from './CountdownTimer'
import { PLATFORM_EMOJI, SOURCE_LABELS, type Subscriber } from '../types'
import { cn, formatCurrency } from '../../../lib/utils'

const statusConfig = {
  active: { label: '✅ Active', variant: 'emerald' as const },
  'expiring-soon': { label: '🔥 Expiring', variant: 'amber' as const },
  expired: { label: '⏰ Expired', variant: 'ruby' as const },
  purged: { label: '🗑️ Purged', variant: 'muted' as const },
}

interface SubscriberRowProps {
  subscriber: Subscriber
  isSelected: boolean
  onSelect: () => void
}

export function SubscriberRow({ subscriber: sub, isSelected, onSelect }: SubscriberRowProps) {
  const status = statusConfig[sub.status]
  const checkedCount = sub.activityChecklist.filter((i) => i.checked).length
  const totalChecks = sub.activityChecklist.length
  const engagementPct = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0

  const sourceEmoji = PLATFORM_EMOJI[sub.source] || '💬'

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left bg-charcoal border rounded-xl p-4 transition-all duration-200 group',
        isSelected
          ? 'border-gold/40 bg-gold/5 shadow-[0_0_20px_var(--color-gold-glow)]'
          : 'border-slate-dark hover:border-gold-dim/30',
        sub.status === 'purged' && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar with source emoji */}
        <div className="relative shrink-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: `${sub.avatarColor}20`, color: sub.avatarColor }}
          >
            {sub.displayName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-1 -right-1 text-sm" title={SOURCE_LABELS[sub.source]}>
            {sourceEmoji}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-ivory truncate">{sub.displayName}</span>
            <Badge variant={status.variant} dot>{status.label}</Badge>
          </div>

          {/* Social handles */}
          {sub.socialHandles.length > 0 && (
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted overflow-hidden">
              {sub.socialHandles.slice(0, 3).map((h, i) => (
                <span key={i} className="flex items-center gap-0.5 truncate">
                  {PLATFORM_EMOJI[h.platform] || '💬'} {h.username}
                </span>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
            <span className="text-gold font-medium">
              {formatCurrency(sub.monthlyAmount)}/mo
            </span>
            <span className="text-muted">
              {sub.totalMonths} mo{sub.totalMonths !== 1 ? 's' : ''}
            </span>
            {sub.autoRenew && <span className="text-emerald">🔁 Auto</span>}
            <span className="text-muted">
              📊 {engagementPct}% engaged
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="shrink-0 text-right">
          {sub.status !== 'purged' ? (
            <CountdownTimer expiresAt={sub.expiresAt} compact />
          ) : (
            <span className="text-[11px] text-muted">🗑️ {sub.purgedAt}</span>
          )}
        </div>
      </div>
    </button>
  )
}
